/**
 * Land Lots Enterprise Express API Gateway
 * Financial-grade security: bcrypt password hashing, JWT bearer auth,
 * brute-force IP rate limiting, input sanitization, and SQLite WAL persistence.
 */

import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { db, initDatabase } from './db.js';

// Twelve-Factor Environment Loader (.env)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootEnvPath = path.resolve(__dirname, '..', '.env');

if (fs.existsSync(rootEnvPath)) {
  try {
    if (process.loadEnvFile) {
      process.loadEnvFile(rootEnvPath);
    } else {
      const envRaw = fs.readFileSync(rootEnvPath, 'utf8');
      envRaw.split('\n').forEach(line => {
        const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
        if (m) {
          const key = m[1];
          let val = (m[2] || '').trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
          }
          if (process.env[key] === undefined) process.env[key] = val;
        }
      });
    }
  } catch (e) {
    console.warn('[ENV] Note: Native .env loading encountered a warning, using process defaults.');
  }
}

const app = express();
const PORT = process.env.PORT || 5001;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// Never fall back to a secret that is committed to source control
let JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET || JWT_SECRET.length < 32) {
  if (IS_PRODUCTION) {
    console.error('[FATAL] JWT_SECRET must be set (32+ chars) in production. Refusing to start.');
    process.exit(1);
  }
  JWT_SECRET = crypto.randomBytes(48).toString('hex');
  console.warn('[SECURITY] JWT_SECRET not set — using a random per-process secret (sessions reset on restart).');
}

// Collision-resistant record IDs (timestamp slices collide under concurrent writes)
const newId = (prefix) => `${prefix}-${crypto.randomUUID().split('-')[0].toUpperCase()}`;

// Stable account ID derived from email so a buyer keeps saved plots/visits across logins
const buyerIdFor = (email) => `USR-${crypto.createHash('sha256').update(email).digest('hex').slice(0, 12).toUpperCase()}`;

const STAFF_ROLES = ['super_admin', 'sales', 'marketing', 'finance_accounts'];
const LEAD_STATUSES = [
  'New', 'Visit Scheduled', 'Site Inspected', 'Token Advance Received', 'Closed',
  // Pipeline stages used by the admin dashboard CRM
  'New Inquiry', 'Site Visit Scheduled', 'Site Visit Confirmed', 'Callback Requested',
  'Negotiation / Token Stage', 'Deal Closed (Token Paid)'
];
const isValidEmail = (e) => typeof e === 'string' && e.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
const str = (v, max = 500) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const allowedOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',').map(s => s.trim()) 
  : ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174'];

// Initialize SQLite Schema & Default Seed Data
initDatabase();

// 1. Core Security Middleware
app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json({ limit: '1mb' }));

// Baseline security headers
app.disable('x-powered-by');
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// 2. In-Memory Brute-Force Rate Limiting (5 attempts / 5 mins)
const failedLoginTracker = new Map(); // IP -> { count, lockedUntil }

function bruteForceGuard(req, res, next) {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const record = failedLoginTracker.get(ip);
  const now = Date.now();

  if (record && record.lockedUntil > now) {
    const remainingSec = Math.ceil((record.lockedUntil - now) / 1000);
    return res.status(429).json({
      error: `Security Lockout Active: Too many failed login attempts from this address. Locked for ${remainingSec} seconds.`
    });
  }

  next();
}

function recordLoginFailure(ip) {
  const now = Date.now();
  const record = failedLoginTracker.get(ip) || { count: 0, lockedUntil: 0 };
  record.count += 1;

  if (record.count >= 5) {
    record.lockedUntil = now + 5 * 60 * 1000; // 5-minute lockout
    record.count = 0;
  }

  failedLoginTracker.set(ip, record);
}

function clearLoginFailure(ip) {
  failedLoginTracker.delete(ip);
}

// 3. JWT Verification Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access Denied: Missing Authorization Header' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Session Expired or Invalid Token. Please sign in again.' });
    }
    req.user = user;
    next();
  });
}

// 4. Role-Based Access Control (RBAC) Guard
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: `Access Denied: Insufficient permissions for role '${req.user?.role}'. Required: ${allowedRoles.join(', ')}` 
      });
    }
    next();
  };
}

// Helper: Log audit events to database
function logAudit(event, details, severity = 'INFO', actor = 'SYSTEM', ip = '') {
  try {
    const stmt = db.prepare(`
      INSERT INTO audit_logs (id, timestamp, event, details, severity, actor, ip)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(newId('LOG'), new Date().toISOString(), event, details, severity, actor, ip);
  } catch (err) {
    console.error('[AUDIT ERROR]', err);
  }
}

// =========================================================================
// API ROUTES
// =========================================================================

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'HEALTHY',
    service: 'Land Lots Commercial API Engine',
    timestamp: new Date().toISOString(),
    database: 'SQLite 3 (WAL Mode Active)',
    security: 'NIST SP 800-63B + bcrypt + JWT Active'
  });
});

// Shape a DB user row into the session payload shared with the client
function toSessionUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    role_label: user.role_label,
    department: user.department,
    branch: user.branch,
    phone: user.phone || '',
    avatar: user.avatar || ''
  };
}

const insertUserStmt = () => db.prepare(`
  INSERT INTO users (id, name, email, password_hash, role, role_label, department, branch, phone, avatar, created_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

function createBuyerAccount({ name, email, phone, password, role = 'buyer' }) {
  const isSeller = role === 'seller';
  const user = {
    id: buyerIdFor(email),
    name: name || email.split('@')[0],
    email,
    role: isSeller ? 'seller' : 'buyer',
    role_label: isSeller ? 'Verified Land Seller' : 'Verified Buyer / Investor',
    department: 'Client Services',
    branch: 'Online Public Portal',
    phone: phone || '',
    avatar: ''
  };
  insertUserStmt().run(
    user.id, user.name, user.email, bcrypt.hashSync(password, 10), user.role, user.role_label,
    user.department, user.branch, user.phone, user.avatar, new Date().toISOString()
  );
  return user;
}

// 1. Authentication: Corporate Staff & Public Buyer Login
app.post('/api/auth/login', bruteForceGuard, (req, res) => {
  const { email, password } = req.body || {};
  const ip = req.ip || req.socket.remoteAddress || 'unknown';

  if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(cleanEmail);

  if (!user) {
    // First sign-in from an unknown email creates a buyer account (password stored as bcrypt hash)
    if (!isValidEmail(cleanEmail) || password.length < 6) {
      recordLoginFailure(ip);
      return res.status(400).json({ error: 'Enter a valid email and a password of at least 6 characters.' });
    }
    const buyerUser = createBuyerAccount({ email: cleanEmail, password });
    const token = jwt.sign(toSessionUser(buyerUser), JWT_SECRET, { expiresIn: '2h' });
    clearLoginFailure(ip);
    logAudit('BUYER_REGISTERED', `Public buyer account created on first sign-in: ${cleanEmail}`, 'INFO', cleanEmail, ip);
    return res.json({ success: true, token, user: toSessionUser(buyerUser) });
  }

  if (!bcrypt.compareSync(password, user.password_hash)) {
    recordLoginFailure(ip);
    logAudit('AUTH_FAILURE', `Password mismatch for ${user.role}: ${cleanEmail}`, 'WARN', cleanEmail, ip);
    return res.status(401).json({ error: 'Incorrect email or password.' });
  }

  clearLoginFailure(ip);
  const payload = toSessionUser(user);
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '2h' });
  logAudit('AUTH_SUCCESS', `Authenticated: ${user.name} (${user.role_label})`, 'INFO', cleanEmail, ip);

  res.json({ success: true, token, user: payload });
});

// 2. Authentication: Public Buyer / Seller Registration
app.post('/api/auth/register', bruteForceGuard, (req, res) => {
  const { name, email, phone, password, role } = req.body || {};
  const cleanEmail = str(email, 254).toLowerCase();
  const ip = req.ip || req.socket.remoteAddress || 'unknown';

  if (!str(name) || !isValidEmail(cleanEmail) || typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({ error: 'Full name, a valid email address, and a 6+ character password are required.' });
  }
  if (db.prepare('SELECT 1 FROM users WHERE email = ?').get(cleanEmail)) {
    return res.status(409).json({ error: 'An account with this email already exists. Please sign in.' });
  }

  const user = createBuyerAccount({ name: str(name, 100), email: cleanEmail, phone: str(phone, 20), password, role });
  const token = jwt.sign(toSessionUser(user), JWT_SECRET, { expiresIn: '2h' });
  logAudit('USER_REGISTERED', `New account registered: ${cleanEmail} (${user.role_label})`, 'INFO', cleanEmail, ip);
  res.status(201).json({ success: true, token, user: toSessionUser(user) });
});

// Note: the former POST /api/auth/google endpoint issued tokens for any email without
// verifying a Google ID token. It was removed; add it back only with real Google
// Identity Services verification (google-auth-library verifyIdToken).


// 3. Properties: Search & Filter API (Public)
app.get('/api/properties', (req, res) => {
  const { city, category, search, minPrice, maxPrice, facing } = req.query;

  let query = 'SELECT * FROM properties WHERE 1=1';
  const params = [];

  if (city && city !== 'All Cities') {
    query += ' AND city = ?';
    params.push(city);
  }

  if (category && category !== 'all') {
    query += ' AND category = ?';
    params.push(category);
  }

  if (facing && facing !== 'all') {
    query += ' AND facing LIKE ?';
    params.push(`%${facing}%`);
  }

  if (minPrice) {
    query += ' AND price_num >= ?';
    params.push(parseInt(minPrice, 10));
  }

  if (maxPrice) {
    query += ' AND price_num <= ?';
    params.push(parseInt(maxPrice, 10));
  }

  if (search && search.trim()) {
    query += ' AND (title LIKE ? OR location LIKE ? OR city LIKE ? OR approvals LIKE ?)';
    const s = `%${search.trim()}%`;
    params.push(s, s, s, s);
  }

  query += ' ORDER BY featured DESC, price_num ASC';

  const rows = db.prepare(query).all(...params);

  // Parse JSON fields
  const formatted = rows.map(r => ({
    ...r,
    approvals: JSON.parse(r.approvals || '[]'),
    agent: JSON.parse(r.agent_json || '{}'),
    highlights: JSON.parse(r.highlights_json || '[]'),
    featured: Boolean(r.featured),
    trending: Boolean(r.trending)
  }));

  res.json(formatted);
});

// 4. Properties: Add New Plot (Protected: super_admin, sales)
app.post('/api/properties', authenticateToken, requireRole('super_admin', 'sales'), (req, res) => {
  const p = req.body || {};
  const id = newId('LL-PL');
  const priceNum = parseInt(p.priceNum, 10);
  if (p.priceNum !== undefined && (!Number.isFinite(priceNum) || priceNum <= 0)) {
    return res.status(400).json({ error: 'priceNum must be a positive number.' });
  }

  const stmt = db.prepare(`
    INSERT INTO properties (
      id, title, category, type_tag, listing_type, location, city, price, price_num, rate, 
      area, area_sub, facing, road_width, approvals, featured, trending, image, agent_json, highlights_json, status, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    id,
    p.title || 'Verified Open Plot',
    p.category || 'plots',
    p.typeTag || 'RESIDENTIAL PLOT',
    p.listingType || 'sale',
    p.location || 'Vijayawada Highway',
    p.city || 'Vijayawada',
    p.price || '₹30.0 Lakhs',
    priceNum || 3000000,
    p.rate || '₹15,000 / Sq.Yd',
    p.area || '200 Sq.Yds',
    p.areaSub || '1,800 Sq.Ft',
    p.facing || 'East Facing',
    p.roadWidth || '40 Ft Road',
    JSON.stringify(p.approvals || ['DTCP Approved', '100% Clear Title']),
    p.featured ? 1 : 0,
    p.trending ? 1 : 0,
    p.image || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80',
    JSON.stringify(p.agent || { name: req.user.name, phone: '+91 98490 00000' }),
    JSON.stringify(p.highlights || ['Immediate Registration', 'Clear Title']),
    'available',
    new Date().toISOString()
  );

  logAudit('PROPERTY_CREATED', `Plot created: ${p.title} (${id})`, 'INFO', req.user.email);
  res.status(201).json({ success: true, id, message: 'Property listed successfully' });
});

// 5. Leads: Submit Site Visit / Inquiry (Public)
app.post('/api/leads', (req, res) => {
  const body = req.body || {};
  const name = str(body.name, 100);
  const email = str(body.email, 254);
  const [preferredDate, preferredTime, propertyId, propertyTitle, utmSource, utmCampaign] =
    ['preferredDate', 'preferredTime', 'propertyId', 'propertyTitle', 'utmSource', 'utmCampaign'].map(k => str(body[k], 200));
  const notes = str(body.notes, 1000);

  if (!name || typeof body.phone !== 'string' || !body.phone) {
    return res.status(400).json({ error: 'Name and Phone number are required to schedule a site visit.' });
  }

  // Indian phone number regex validation
  const phoneClean = body.phone.replace(/\D/g, '').slice(-10);
  if (!/^[6-9]\d{9}$/.test(phoneClean)) {
    return res.status(400).json({ error: 'Please enter a valid 10-digit Indian mobile number.' });
  }
  if (email && !isValidEmail(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  const id = newId('LD');
  const stmt = db.prepare(`
    INSERT INTO leads (
      id, name, phone, email, preferred_date, preferred_time, notes, property_id, property_title, status, utm_source, utm_campaign, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    id, name, `+91 ${phoneClean}`, email || '', preferredDate || '', preferredTime || '',
    notes || '', propertyId || '', propertyTitle || '', 'New', utmSource || 'Direct Organic',
    utmCampaign || 'None', new Date().toISOString()
  );

  logAudit('LEAD_CAPTURED', `Site visit booked by ${name} for ${propertyTitle || 'General'}`, 'INFO', email || 'PUBLIC');
  res.status(201).json({ success: true, leadId: id, message: 'Site inspection booked successfully' });
});

// 6. Leads: Get All Leads (Protected: super_admin, sales, marketing)
app.get('/api/leads', authenticateToken, requireRole('super_admin', 'sales', 'marketing'), (req, res) => {
  const leads = db.prepare('SELECT * FROM leads ORDER BY created_at DESC').all();
  res.json(leads);
});

// 7. Leads: Update Lead Status (Protected: super_admin, sales)
app.patch('/api/leads/:id', authenticateToken, requireRole('super_admin', 'sales'), (req, res) => {
  const { id } = req.params;
  const { status, assignedTo } = req.body || {};

  if (status !== undefined && !LEAD_STATUSES.includes(status)) {
    return res.status(400).json({ error: `Invalid status. Allowed: ${LEAD_STATUSES.join(', ')}` });
  }

  const stmt = db.prepare(`
    UPDATE leads
    SET status = COALESCE(?, status), assigned_to = COALESCE(?, assigned_to)
    WHERE id = ?
  `);

  // node:sqlite cannot bind `undefined` — omitted fields must be passed as null
  const result = stmt.run(status ?? null, assignedTo === undefined ? null : str(assignedTo, 100), id);
  if (result.changes === 0) {
    return res.status(404).json({ error: 'Lead not found' });
  }
  logAudit('LEAD_STATUS_UPDATED', `Lead ${id} updated to status: ${status}`, 'INFO', req.user.email);

  res.json({ success: true, message: 'Lead updated successfully' });
});

// 8. Financial Ledger: Get Transactions (Protected: super_admin, finance_accounts)
app.get('/api/ledger', authenticateToken, requireRole('super_admin', 'finance_accounts'), (req, res) => {
  const transactions = db.prepare('SELECT * FROM transactions ORDER BY created_at DESC').all();
  res.json(transactions);
});

// 9. Financial Ledger: Record Token Advance (Protected: super_admin, finance_accounts)
app.post('/api/ledger', authenticateToken, requireRole('super_admin', 'finance_accounts'), (req, res) => {
  const tx = req.body || {};
  const txId = newId('TX');

  const stmt = db.prepare(`
    INSERT INTO transactions (
      tx_id, date, plot_id, plot_title, buyer_name, buyer_phone, total_deal_value,
      token_amount, token_num, payment_mode, commission_rate, commission_earned,
      agent_name, agent_commission_share, office_net_margin, status, created_at, buyer_email
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    txId,
    tx.date || new Date().toISOString().split('T')[0],
    tx.plotId || '',
    tx.plotTitle || '',
    tx.buyerName || '',
    tx.buyerPhone || '',
    tx.totalDealValue || '₹30.0 Lakhs',
    tx.tokenAmount || '₹1,00,000',
    tx.tokenNum || 100000,
    tx.paymentMode || 'NEFT / RTGS',
    tx.commissionRate || '2.5%',
    tx.commissionEarned || '₹75,000',
    tx.agentName || req.user.name,
    tx.agentCommissionShare || '₹37,500',
    tx.officeNetMargin || '₹37,500',
    tx.status || 'Token Received',
    new Date().toISOString(),
    str(tx.buyerEmail, 254).toLowerCase()
  );

  // Update property status to token_locked
  if (tx.plotId) {
    db.prepare('UPDATE properties SET status = ? WHERE id = ?').run('token_locked', tx.plotId);
  }

  logAudit('TRANSACTION_RECORDED', `Token advance ${tx.tokenAmount} recorded for ${tx.plotTitle} (${txId})`, 'INFO', req.user.email);
  res.status(201).json({ success: true, txId, message: 'Transaction recorded in office ledger' });
});

// 10. Audit Logs Stream (Protected: super_admin)
app.get('/api/audit-logs', authenticateToken, requireRole('super_admin'), (req, res) => {
  const logs = db.prepare('SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 100').all();
  res.json(logs);
});

// 11. Dashboard Overview Statistics
app.get('/api/stats', authenticateToken, requireRole(...STAFF_ROLES), (req, res) => {
  const propertyCount = db.prepare('SELECT count(*) as count FROM properties').get().count;
  const leadCount = db.prepare('SELECT count(*) as count FROM leads').get().count;
  const txSum = db.prepare("SELECT sum(token_num) as totalTokens FROM transactions WHERE status != 'Pending Verification'").get().totalTokens || 0;

  res.json({
    totalProperties: propertyCount,
    totalLeads: leadCount,
    totalTokenAdvancesPaise: txSum,
    formattedTokenAdvances: `₹${(txSum / 100000).toFixed(2)} Lakhs`,
    databaseEngine: 'SQLite 3 (WAL Mode Active)'
  });
});

// 12. Buyer Portal: Get Saved Properties
app.get('/api/buyer/saved', authenticateToken, (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT p.* FROM properties p
      JOIN buyer_saved_properties b ON p.id = b.property_id
      WHERE b.user_id = ?
    `).all(req.user.id);

    const formatted = rows.map(r => ({
      ...r,
      approvals: JSON.parse(r.approvals || '[]'),
      agent: JSON.parse(r.agent_json || '{}'),
      highlights: JSON.parse(r.highlights_json || '[]'),
      featured: Boolean(r.featured),
      trending: Boolean(r.trending)
    }));
    res.json(formatted);
  } catch (err) {
    res.json([]);
  }
});

// 13. Buyer Portal: Save / Bookmark Property
app.post('/api/buyer/saved', authenticateToken, (req, res) => {
  const { propertyId } = req.body;
  if (!propertyId) return res.status(400).json({ error: 'Property ID is required' });

  try {
    db.prepare(`
      INSERT OR IGNORE INTO buyer_saved_properties (user_id, property_id, created_at)
      VALUES (?, ?, ?)
    `).run(req.user.id, propertyId, new Date().toISOString());

    res.json({ success: true, message: 'Property saved to your investor portfolio.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to bookmark property' });
  }
});

// 14. Buyer Portal: Remove Saved Property
app.delete('/api/buyer/saved/:propertyId', authenticateToken, (req, res) => {
  try {
    db.prepare(`
      DELETE FROM buyer_saved_properties WHERE user_id = ? AND property_id = ?
    `).run(req.user.id, req.params.propertyId);

    res.json({ success: true, message: 'Property removed from saved portfolio.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove saved property' });
  }
});

// 15. Buyer Portal: Get Scheduled Site Visits
app.get('/api/buyer/visits', authenticateToken, (req, res) => {
  try {
    const visits = db.prepare(`
      SELECT v.*, p.title as property_title, p.location as property_location, p.city as property_city, p.image as property_image
      FROM site_visits v
      LEFT JOIN properties p ON v.property_id = p.id
      WHERE v.user_id = ?
      ORDER BY v.created_at DESC
    `).all(req.user.id);

    res.json(visits);
  } catch (err) {
    res.json([]);
  }
});

// 16. Buyer Portal: Get Booking Receipts / Token Advances
app.get('/api/buyer/bookings', authenticateToken, (req, res) => {
  try {
    // Scope strictly to the signed-in account (fuzzy name/phone LIKE matching leaked other buyers' rows)
    const bookings = db.prepare(`
      SELECT * FROM transactions
      WHERE buyer_email = ?
      ORDER BY created_at DESC
    `).all((req.user.email || '').toLowerCase());

    res.json(bookings);
  } catch (err) {
    res.json([]);
  }
});

// Optional auth: attach req.user when a valid bearer token is present, never reject
function optionalAuth(req, res, next) {
  const token = (req.headers['authorization'] || '').split(' ')[1];
  if (token) {
    try { req.user = jwt.verify(token, JWT_SECRET); } catch { /* treat as guest */ }
  }
  next();
}

const ALLOWED_TOKEN_AMOUNTS = [10000, 25000, 50000, 100000];
const PAYMENT_MODES = ['UPI', 'NETBANKING', 'CARDS', 'ESCROW'];
const formatINR = (n) => `₹${Math.round(n).toLocaleString('en-IN')}`;

// 17. Public Plot Booking Request (token advance pending finance verification)
// No payment gateway is integrated yet, so bookings are recorded as 'Pending Verification'
// and do NOT lock the plot until finance confirms receipt via the staff ledger.
app.post('/api/bookings', optionalAuth, (req, res) => {
  const b = req.body || {};
  const buyerName = str(b.buyerName, 100);
  const phoneClean = (typeof b.buyerPhone === 'string' ? b.buyerPhone : '').replace(/\D/g, '').slice(-10);
  const buyerEmail = (req.user?.email || str(b.buyerEmail, 254)).toLowerCase();
  const tokenNum = parseInt(b.tokenNum, 10);
  const paymentMode = str(b.paymentMode, 20).toUpperCase();

  if (!buyerName) return res.status(400).json({ error: 'Buyer name is required.' });
  if (!/^[6-9]\d{9}$/.test(phoneClean)) return res.status(400).json({ error: 'Please enter a valid 10-digit Indian mobile number.' });
  if (buyerEmail && !isValidEmail(buyerEmail)) return res.status(400).json({ error: 'Please enter a valid email address.' });
  if (!ALLOWED_TOKEN_AMOUNTS.includes(tokenNum)) return res.status(400).json({ error: 'Invalid token amount.' });
  if (!PAYMENT_MODES.includes(paymentMode)) return res.status(400).json({ error: 'Invalid payment mode.' });

  const property = db.prepare('SELECT id, title, price, price_num, status FROM properties WHERE id = ?').get(str(b.plotId, 50));
  if (!property) return res.status(404).json({ error: 'Selected plot was not found.' });
  if (property.status !== 'available') return res.status(409).json({ error: 'This plot is already on hold or sold.' });

  // Commission figures are computed server-side; never trust client-supplied amounts
  const commission = property.price_num * 0.025;
  const txId = newId('TX-AP');
  db.prepare(`
    INSERT INTO transactions (
      tx_id, date, plot_id, plot_title, buyer_name, buyer_phone, total_deal_value,
      token_amount, token_num, payment_mode, commission_rate, commission_earned,
      agent_name, agent_commission_share, office_net_margin, status, created_at, buyer_email
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    txId, new Date().toISOString().split('T')[0], property.id, property.title, buyerName, `+91 ${phoneClean}`,
    property.price, formatINR(tokenNum), tokenNum, paymentMode, '2.5%', formatINR(commission),
    'Online Booking', formatINR(commission / 2), formatINR(commission / 2), 'Pending Verification',
    new Date().toISOString(), buyerEmail
  );

  logAudit('BOOKING_REQUESTED', `Token booking ${formatINR(tokenNum)} requested for ${property.title} (${txId})`, 'INFO', buyerEmail || 'PUBLIC', req.ip);
  res.status(201).json({ success: true, txId, status: 'Pending Verification', plotTitle: property.title, totalDealValue: property.price });
});

// 18. Staff Accounts: List & Provision (Protected: super_admin)
app.get('/api/admin/users', authenticateToken, requireRole('super_admin'), (req, res) => {
  const rows = db.prepare(`SELECT * FROM users WHERE role IN (${STAFF_ROLES.map(() => '?').join(',')}) ORDER BY created_at`).all(...STAFF_ROLES);
  res.json(rows.map(toSessionUser));
});

app.post('/api/admin/users', authenticateToken, requireRole('super_admin'), (req, res) => {
  const { name, email, password, role, department, branch, phone } = req.body || {};
  const cleanEmail = str(email, 254).toLowerCase();
  const labels = { super_admin: 'Master Admin & Director', sales: 'Senior Sales Lead', marketing: 'Head of Growth & Campaigns', finance_accounts: 'Office Accounts & Finance Controller' };

  if (!str(name) || !isValidEmail(cleanEmail) || !STAFF_ROLES.includes(role)) {
    return res.status(400).json({ error: 'Name, valid email and a staff role are required.' });
  }
  // No password supplied → issue a one-time temporary password returned only in this response
  const temporaryPassword = password ? null : `Ll-${crypto.randomBytes(9).toString('base64url')}9a`;
  const finalPassword = password || temporaryPassword;
  if (typeof finalPassword !== 'string' || finalPassword.length < 8 || !/[A-Z]/.test(finalPassword) || !/[a-z]/.test(finalPassword) || !/\d/.test(finalPassword)) {
    return res.status(400).json({ error: 'Password must be 8+ characters with uppercase, lowercase and a number.' });
  }
  if (db.prepare('SELECT 1 FROM users WHERE email = ?').get(cleanEmail)) {
    return res.status(409).json({ error: 'An account with this email already exists.' });
  }

  const user = {
    id: newId('ACC'), name: str(name, 100), email: cleanEmail, role, role_label: labels[role],
    department: str(department, 100) || 'Operations', branch: str(branch, 100) || 'Vijayawada HQ',
    phone: str(phone, 20), avatar: ''
  };
  insertUserStmt().run(
    user.id, user.name, user.email, bcrypt.hashSync(finalPassword, 10), user.role, user.role_label,
    user.department, user.branch, user.phone, user.avatar, new Date().toISOString()
  );
  logAudit('STAFF_PROVISIONED', `New office staff provisioned: ${cleanEmail} (${role})`, 'INFO', req.user.email, req.ip);
  res.status(201).json({ success: true, user: toSessionUser(user), temporaryPassword });
});

// Unknown API routes → JSON 404 (instead of falling through to the SPA)
app.use('/api', (req, res) => res.status(404).json({ error: 'API route not found' }));

// 19. Serve Frontend Static Assets in Production
const distPath = path.resolve(__dirname, '..', 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  // Express 5 (path-to-regexp v8) requires a named wildcard; bare '*' crashes on startup
  app.get('/{*splat}', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Central JSON error handler (malformed JSON bodies, unexpected DB errors)
app.use((err, req, res, _next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Malformed JSON request body.' });
  }
  console.error('[API ERROR]', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`  LAND LOTS ENTERPRISE API ENGINE STARTED             `);
  console.log(`  Listening on: http://localhost:${PORT}              `);
  console.log(`  Database: SQLite 3 (WAL Mode Active)                `);
  console.log(`  Health Check: http://localhost:${PORT}/api/health   `);
  console.log(`======================================================\n`);
});
