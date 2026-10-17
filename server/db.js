/**
 * Land Lots Enterprise SQLite Database Engine
 * Utilizes Node.js native DatabaseSync (node:sqlite) with Write-Ahead Logging (WAL)
 * Compliant with ACID transaction isolation and financial integrity controls.
 */

import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'landlots.db');

export const db = new DatabaseSync(dbPath);

// Enable Write-Ahead Logging (WAL) for high concurrency and atomic durability
db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA foreign_keys = ON;');
db.exec('PRAGMA synchronous = NORMAL;');

export function initDatabase() {
  console.log('[DB] Initializing Land Lots database tables...');

  // 1. Users & Staff Accounts Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL,
      role_label TEXT NOT NULL,
      department TEXT,
      branch TEXT,
      phone TEXT,
      avatar TEXT,
      failed_attempts INTEGER DEFAULT 0,
      locked_until INTEGER DEFAULT 0,
      created_at TEXT NOT NULL
    );
  `);

  // 2. Properties Catalog Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS properties (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      type_tag TEXT,
      listing_type TEXT DEFAULT 'sale',
      location TEXT NOT NULL,
      city TEXT NOT NULL,
      price TEXT NOT NULL,
      price_num INTEGER NOT NULL,
      rate TEXT,
      area TEXT,
      area_sub TEXT,
      facing TEXT,
      road_width TEXT,
      approvals TEXT, -- JSON array
      featured INTEGER DEFAULT 0,
      trending INTEGER DEFAULT 0,
      image TEXT,
      agent_json TEXT, -- JSON stringified agent object
      highlights_json TEXT, -- JSON stringified array
      status TEXT DEFAULT 'available', -- 'available' | 'token_locked' | 'sold'
      created_at TEXT NOT NULL
    );
  `);

  // 3. Leads & Site Visits Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS leads (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT,
      preferred_date TEXT,
      preferred_time TEXT,
      notes TEXT,
      property_id TEXT,
      property_title TEXT,
      status TEXT DEFAULT 'New', -- 'New' | 'Visit Scheduled' | 'Site Inspected' | 'Token Advance Received' | 'Closed'
      utm_source TEXT,
      utm_campaign TEXT,
      assigned_to TEXT,
      created_at TEXT NOT NULL
    );
  `);

  // 4. Financial Transactions & Ledger Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS transactions (
      tx_id TEXT PRIMARY KEY,
      date TEXT NOT NULL,
      plot_id TEXT NOT NULL,
      plot_title TEXT NOT NULL,
      buyer_name TEXT NOT NULL,
      buyer_phone TEXT NOT NULL,
      total_deal_value TEXT NOT NULL,
      token_amount TEXT NOT NULL,
      token_num INTEGER NOT NULL,
      payment_mode TEXT NOT NULL,
      commission_rate TEXT NOT NULL,
      commission_earned TEXT NOT NULL,
      agent_name TEXT NOT NULL,
      agent_commission_share TEXT NOT NULL,
      office_net_margin TEXT NOT NULL,
      status TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);

  // 5. Tamper-Evident Audit Trail Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      timestamp TEXT NOT NULL,
      event TEXT NOT NULL,
      details TEXT NOT NULL,
      severity TEXT DEFAULT 'INFO',
      actor TEXT NOT NULL,
      ip TEXT
    );
  `);

  // 6. Buyer Saved Properties (Buyer Portal)
  db.exec(`
    CREATE TABLE IF NOT EXISTS buyer_saved_properties (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      property_id TEXT NOT NULL,
      created_at TEXT NOT NULL,
      UNIQUE(user_id, property_id)
    );
  `);

  // 7. Buyer Scheduled Site Visits (Buyer Portal)
  db.exec(`
    CREATE TABLE IF NOT EXISTS site_visits (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      property_id TEXT NOT NULL,
      visit_date TEXT NOT NULL,
      slot TEXT NOT NULL,
      pickup_required INTEGER DEFAULT 1,
      pickup_address TEXT,
      cab_status TEXT DEFAULT 'Driver Assigned',
      driver_name TEXT,
      driver_phone TEXT,
      assigned_advisor TEXT,
      status TEXT DEFAULT 'Confirmed',
      created_at TEXT NOT NULL
    );
  `);

  // Seed default office staff with real bcrypt hashes if not already populated
  seedInitialData();
}

function seedInitialData() {
  const userCount = db.prepare('SELECT count(*) as count FROM users').get().count;
  if (userCount === 0) {
    console.log('[DB] Seeding default office accounts with bcrypt hashes...');
    const salt = bcrypt.genSaltSync(10);

    const defaultStaff = [
      {
        id: "ACC-001",
        name: "Srikanth Varma",
        email: "admin@landlots.co",
        password: "Admin@LandLots2026!",
        role: "super_admin",
        role_label: "Master Admin & Principal",
        department: "Executive Management",
        branch: "Vijayawada HQ",
        phone: "+91 98490 11111",
        avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80"
      },
      {
        id: "ACC-002",
        name: "Suresh Varma",
        email: "sales@landlots.co",
        password: "Sales@LandLots2026!",
        role: "sales",
        role_label: "Senior Sales Lead",
        department: "Sales & Client Advisory",
        branch: "Vijayawada - Bandar Road",
        phone: "+91 98490 12345",
        avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80"
      },
      {
        id: "ACC-003",
        name: "Pooja Reddy",
        email: "marketing@landlots.co",
        password: "Marketing@LandLots2026!",
        role: "marketing",
        role_label: "Head of Growth & Campaigns",
        department: "Digital Marketing & Branding",
        branch: "Hyderabad Corporate",
        phone: "+91 91210 56789",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80"
      },
      {
        id: "ACC-004",
        name: "Lakshmi Narayana",
        email: "accounts@landlots.co",
        password: "Accounts@LandLots2026!",
        role: "finance_accounts",
        role_label: "Office Accounts & Finance Controller",
        department: "Treasury & Office Accounts",
        branch: "Vijayawada HQ",
        phone: "+91 94400 33445",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
      }
    ];

    const insertUser = db.prepare(`
      INSERT INTO users (id, name, email, password_hash, role, role_label, department, branch, phone, avatar, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const u of defaultStaff) {
      const hash = bcrypt.hashSync(u.password, salt);
      insertUser.run(
        u.id, u.name, u.email, hash, u.role, u.role_label, 
        u.department, u.branch, u.phone, u.avatar, new Date().toISOString()
      );
    }
  }

  // Seed default properties if table is empty
  const propCount = db.prepare('SELECT count(*) as count FROM properties').get().count;
  if (propCount === 0) {
    console.log('[DB] Seeding certified property catalog...');
    const insertProp = db.prepare(`
      INSERT INTO properties (
        id, title, category, type_tag, listing_type, location, city, price, price_num, rate, 
        area, area_sub, facing, road_width, approvals, featured, trending, image, agent_json, highlights_json, status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const initialProps = [
      {
        id: "LL-PL-101",
        title: "Green Valley Eco Plots",
        category: "plots",
        type_tag: "RESIDENTIAL PLOT",
        listing_type: "sale",
        location: "Kankipadu - Bandar Highway, Vijayawada",
        city: "Vijayawada",
        price: "₹34.5 Lakhs",
        price_num: 3450000,
        rate: "₹17,250 / Sq.Yd",
        area: "200 Sq.Yds",
        area_sub: "1,800 Sq.Ft • 4.13 Cents",
        facing: "East Facing (Vastu Compliant)",
        road_width: "40 Ft CC Roads",
        approvals: JSON.stringify(["DTCP Approved", "APCRDA Approved", "100% Clear Title", "RERA: P03290120932"]),
        featured: 1,
        trending: 1,
        image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80",
        agent_json: JSON.stringify({ name: "Suresh Varma", phone: "+91 98490 12345", verified: true, dealsClosed: 42 }),
        highlights_json: JSON.stringify(["Immediate Registration", "Underground Electricity", "Compound Wall", "Overhead Water Tank"]),
        status: "available"
      },
      {
        id: "LL-VL-202",
        title: "The Royal Crest Luxury Villa",
        category: "residential",
        type_tag: "4 BHK LUXURY VILLA",
        listing_type: "sale",
        location: "Mokila, Near Financial District, Hyderabad",
        city: "Hyderabad",
        price: "₹1.95 Crores",
        price_num: 19500000,
        rate: "₹5,400 / Sq.Ft",
        area: "3,610 Sq.Ft",
        area_sub: "320 Sq.Yds Land Share",
        facing: "North-East Facing",
        road_width: "50 Ft Avenue Roads",
        approvals: JSON.stringify(["HMDA Approved", "TS RERA: P02400003182", "SBI & HDFC Pre-Approved"]),
        featured: 1,
        trending: 1,
        image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1000&q=80",
        agent_json: JSON.stringify({ name: "Pooja Reddy", phone: "+91 91210 56789", verified: true, dealsClosed: 68 }),
        highlights_json: JSON.stringify(["Private Plunge Pool", "Clubhouse with 25+ Amenities", "EV Charging Point"]),
        status: "available"
      },
      {
        id: "LL-AG-303",
        title: "Krishna River Valley Agro Farm",
        category: "agricultural",
        type_tag: "MANAGED FARM LAND",
        listing_type: "sale",
        location: "Amaravati Capital Border, Guntur District",
        city: "Amaravati",
        price: "₹72.0 Lakhs / Acre",
        price_num: 7200000,
        rate: "₹1,487 / Sq.Yd",
        area: "1.5 Acres",
        area_sub: "6,070 Sq.Meters • 150 Cents",
        facing: "Highway Facing (60 Ft)",
        road_width: "60 Ft Road",
        approvals: JSON.stringify(["100% Freehold Title", "Pattadar Passbook Verified", "Clear 30-Yr EC"]),
        featured: 0,
        trending: 1,
        image: "https://images.unsplash.com/photo-1500076656116-558758c991c1?auto=format&fit=crop&w=1000&q=80",
        agent_json: JSON.stringify({ name: "Venkata Raman", phone: "+91 94400 98765", verified: true, dealsClosed: 35 }),
        highlights_json: JSON.stringify(["Red Soil Fertile Land", "Sweet Water Borewell", "Red Sandalwood Plantation"]),
        status: "available"
      }
    ];

    for (const p of initialProps) {
      insertProp.run(
        p.id, p.title, p.category, p.type_tag, p.listing_type, p.location, p.city,
        p.price, p.price_num, p.rate, p.area, p.area_sub, p.facing, p.road_width,
        p.approvals, p.featured, p.trending, p.image, p.agent_json, p.highlights_json,
        p.status, new Date().toISOString()
      );
    }
  }

  // Seed default financial ledger transactions
  const txCount = db.prepare('SELECT count(*) as count FROM transactions').get().count;
  if (txCount === 0) {
    console.log('[DB] Seeding default office accounts transactions ledger...');
    const insertTx = db.prepare(`
      INSERT INTO transactions (
        tx_id, date, plot_id, plot_title, buyer_name, buyer_phone, total_deal_value,
        token_amount, token_num, payment_mode, commission_rate, commission_earned,
        agent_name, agent_commission_share, office_net_margin, status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const initialTx = [
      {
        tx_id: "TX-9901",
        date: "2026-10-15",
        plot_id: "LL-PL-101",
        plot_title: "Green Valley Eco Plots (Plot #42)",
        buyer_name: "Vikramaditya Raju",
        buyer_phone: "+91 98480 22334",
        total_deal_value: "₹34.50 Lakhs",
        token_amount: "₹2,00,000",
        token_num: 200000,
        payment_mode: "RTGS (HDFC Bank)",
        commission_rate: "2.5%",
        commission_earned: "₹86,250",
        agent_name: "Suresh Varma",
        agent_commission_share: "₹43,125",
        office_net_margin: "₹43,125",
        status: "Token Received"
      },
      {
        tx_id: "TX-9902",
        date: "2026-10-14",
        plot_id: "LL-VL-202",
        plot_title: "The Royal Crest Villa (#B-12)",
        buyer_name: "Sneha Deshmukh",
        buyer_phone: "+91 98230 45671",
        total_deal_value: "₹1.95 Crores",
        token_amount: "₹10,00,000",
        token_num: 1000000,
        payment_mode: "Cheque (#409122 - ICICI)",
        commission_rate: "2.0%",
        commission_earned: "₹3,90,000",
        agent_name: "Pooja Reddy",
        agent_commission_share: "₹1,95,000",
        office_net_margin: "₹1,95,000",
        status: "Sale Agreement Executed"
      }
    ];

    for (const tx of initialTx) {
      insertTx.run(
        tx.tx_id, tx.date, tx.plot_id, tx.plot_title, tx.buyer_name, tx.buyer_phone,
        tx.total_deal_value, tx.token_amount, tx.token_num, tx.payment_mode,
        tx.commission_rate, tx.commission_earned, tx.agent_name, tx.agent_commission_share,
        tx.office_net_margin, tx.status, new Date().toISOString()
      );
    }
  }
}
