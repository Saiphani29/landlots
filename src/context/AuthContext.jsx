import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { SECURITY_CONFIG } from '../config/security.config';
import { apiClient } from '../utils/apiClient';

const AuthContext = createContext(null);

// Office staff directory shown before the live directory loads from the server.
// Credentials are verified ONLY by the API server (bcrypt + signed JWT) — no passwords
// or password hashes may ever be shipped in this client bundle.
export const DEFAULT_OFFICE_ACCOUNTS = [
  {
    id: "ACC-001",
    name: "Srikanth Varma",
    email: "admin@landlots.co",
    role: "super_admin",
    roleLabel: "Master Admin & Principal",
    department: "Executive Management",
    branch: "Vijayawada HQ",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80",
    phone: "+91 98490 11111"
  },
  {
    id: "ACC-002",
    name: "Suresh Varma",
    email: "sales@landlots.co",
    role: "sales",
    roleLabel: "Senior Sales Lead",
    department: "Sales & Client Advisory",
    branch: "Vijayawada - Bandar Road",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80",
    phone: "+91 98490 12345"
  },
  {
    id: "ACC-003",
    name: "Pooja Reddy",
    email: "marketing@landlots.co",
    role: "marketing",
    roleLabel: "Head of Growth & Campaigns",
    department: "Digital Marketing & Branding",
    branch: "Hyderabad Corporate",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    phone: "+91 91210 56789"
  },
  {
    id: "ACC-004",
    name: "Lakshmi Narayana",
    email: "accounts@landlots.co",
    role: "finance_accounts",
    roleLabel: "Office Accounts & Finance Controller",
    department: "Treasury & Office Accounts",
    branch: "Vijayawada HQ",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    phone: "+91 94400 33445"
  }
];

const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80";

// Normalize a server user (snake_case) into the client shape, keeping directory avatars
function fromServerUser(u) {
  const known = DEFAULT_OFFICE_ACCOUNTS.find(a => a.email === u.email);
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    roleLabel: u.role_label || u.roleLabel,
    department: u.department,
    branch: u.branch,
    phone: u.phone || known?.phone || '',
    avatar: u.avatar || known?.avatar || DEFAULT_AVATAR
  };
}

// Decode a JWT payload and check expiry (server tokens use seconds, per RFC 7519)
function isTokenLive(token) {
  try {
    const parts = (token || '').split('.');
    if (parts.length !== 3) return false;
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    if (!payload.exp) return false;
    const expMs = payload.exp < 1e12 ? payload.exp * 1000 : payload.exp;
    return expMs > Date.now();
  } catch {
    return false;
  }
}

// Helper: NIST SP 800-63B Password Complexity Analyzer
export function evaluatePasswordStrength(password = '') {
  const minLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

  const passedCount = [minLength, hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;

  let label = 'Weak';
  let color = '#ef4444';
  if (passedCount >= 5) {
    label = 'Enterprise Grade';
    color = '#00b074';
  } else if (passedCount >= 4) {
    label = 'Strong';
    color = '#10b981';
  } else if (passedCount >= 3) {
    label = 'Moderate';
    color = '#f59e0b';
  }

  return {
    score: passedCount,
    percentage: Math.min(100, Math.round((passedCount / 5) * 100)),
    label,
    color,
    checks: {
      minLength,
      hasUpper,
      hasLower,
      hasNumber,
      hasSpecial
    }
  };
}

export function AuthProvider({ children }) {
  // Current Authenticated Session (restored only while its token is unexpired)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('landlots_auth_user');
      const token = localStorage.getItem('landlots_session_token');
      if (saved && isTokenLive(token)) return JSON.parse(saved);
    } catch (e) {
      console.warn("Corrupt or expired session token detected and purged.", e);
    }
    return null;
  });

  // Office staff directory (live list loaded from the server for super admins)
  const [officeAccounts, setOfficeAccounts] = useState(DEFAULT_OFFICE_ACCOUNTS);

  // Lockout state mirrors the server's brute-force guard (HTTP 429)
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLockedOut, setIsLockedOut] = useState(false);
  const [lockoutRemainingSec, setLockoutRemainingSec] = useState(0);

  // Client-side activity trail (informational only; the authoritative audit log is server-side)
  const [auditLogs, setAuditLogs] = useState(() => {
    try {
      const saved = localStorage.getItem('landlots_audit_trail');
      if (saved) return JSON.parse(saved);
    } catch { /* fall through to default */ }
    return [
      {
        id: 'LOG-INIT',
        timestamp: new Date().toISOString(),
        event: 'SECURITY_SUBSYSTEM_INITIALIZED',
        details: 'Server-side bcrypt + JWT authentication & RBAC active',
        severity: 'INFO',
        actor: 'SYSTEM'
      }
    ];
  });

  // Sync state to persistent storage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('landlots_auth_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('landlots_auth_user');
      localStorage.removeItem('landlots_session_token');
    }
  }, [currentUser]);

  useEffect(() => {
    // Purge data persisted by the old client-side auth engine (contained plaintext passwords)
    localStorage.removeItem('landlots_office_accounts');
    localStorage.removeItem('landlots_registered_users');
  }, []);

  useEffect(() => {
    localStorage.setItem('landlots_audit_trail', JSON.stringify(auditLogs.slice(0, 100))); // Keep latest 100 entries
  }, [auditLogs]);

  // Load the live staff directory for super admins
  useEffect(() => {
    if (currentUser?.role !== 'super_admin') return;
    const token = localStorage.getItem('landlots_session_token');
    apiClient.getStaff(token).then(list => {
      if (Array.isArray(list) && list.length) setOfficeAccounts(list.map(fromServerUser));
    });
  }, [currentUser]);

  // Lockout countdown
  useEffect(() => {
    if (!isLockedOut) return;
    const timer = setInterval(() => {
      setLockoutRemainingSec(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsLockedOut(false);
          setFailedAttempts(0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isLockedOut]);

  // Append entry to activity trail
  const logAuditEvent = useCallback((event, details, severity = 'INFO', actor = currentUser?.email || 'ANONYMOUS') => {
    const newEntry = {
      id: `LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      event,
      details,
      severity,
      actor
    };
    setAuditLogs(prev => [newEntry, ...prev]);
  }, [currentUser]);

  const startSession = (token, serverUser) => {
    const user = fromServerUser(serverUser);
    localStorage.setItem('landlots_session_token', token);
    setCurrentUser(user);
    return user;
  };

  // Server-verified sign-in (staff, returning buyers, and first-time buyer sign-up)
  const loginWithEmail = async (email, password) => {
    const cleanEmail = (email || '').trim().toLowerCase();

    if (isLockedOut) {
      return {
        success: false,
        error: `Security Lockout Active: Too many failed attempts. Please wait ${lockoutRemainingSec}s.`
      };
    }

    const res = await apiClient.login(cleanEmail, password);

    if (res.success && res.token) {
      setFailedAttempts(0);
      const user = startSession(res.token, res.user);
      logAuditEvent('AUTH_SUCCESS', `Signed in: ${user.name} (${user.roleLabel})`, 'INFO', user.email);
      return { success: true, user };
    }

    if (res.status === 429) {
      const match = /(\d+) seconds/.exec(res.error || '');
      setIsLockedOut(true);
      setLockoutRemainingSec(match ? parseInt(match[1], 10) : SECURITY_CONFIG.passwordPolicy.lockoutDurationMinutes * 60);
    } else if (res.status === 401 || res.status === 400) {
      setFailedAttempts(prev => prev + 1);
      logAuditEvent('AUTH_FAILURE', `Failed sign-in attempt for ${cleanEmail}`, 'WARN', cleanEmail);
    }

    return { success: false, error: res.error || 'Authentication failed. Please verify your credentials.' };
  };

  // Register New User (Buyer, Investor, or Plot Seller)
  const registerUser = async ({ name, email, phone, role = 'buyer', password }) => {
    const res = await apiClient.register({ name, email, phone, role, password });
    if (!res.success || !res.token) {
      return { success: false, error: res.error || 'Registration failed. Please try again.' };
    }
    const user = startSession(res.token, res.user);
    logAuditEvent('USER_REGISTERED', `New account registered: ${user.email} (${user.roleLabel})`, 'INFO', user.email);
    return { success: true, user };
  };

  // Google sign-in DEMO: no Google OAuth client is configured, so this opens a local
  // preview session only (no server token — server-protected data stays inaccessible).
  const loginWithGoogle = () => {
    const googleUser = {
      id: 'G-DEMO',
      name: "Public Verified Buyer",
      email: "buyer.google@gmail.com",
      role: "buyer",
      roleLabel: "Verified Google Investor",
      department: "Public Marketplace",
      branch: "Global Online",
      avatar: DEFAULT_AVATAR,
      authProvider: "google"
    };

    const payload = btoa(JSON.stringify({ sub: googleUser.id, role: 'buyer', exp: Math.floor(Date.now() / 1000) + 2 * 3600 }));
    localStorage.setItem('landlots_session_token', `demo.${payload}.unsigned`);
    setCurrentUser(googleUser);

    logAuditEvent('GOOGLE_SSO_DEMO', 'Google SSO demo session initialized', 'INFO', googleUser.email);

    return { success: true, user: googleUser };
  };

  // Provision new office account on the server (super_admin only)
  const createOfficeAccount = async (accountData) => {
    const token = localStorage.getItem('landlots_session_token');
    const res = await apiClient.createStaff(accountData, token);
    if (!res.success) {
      throw new Error(res.error || 'Failed to provision staff account.');
    }
    const newAcc = fromServerUser(res.user);
    setOfficeAccounts(prev => [...prev, newAcc]);
    logAuditEvent('STAFF_PROVISIONED', `New office staff provisioned: ${newAcc.email} (${newAcc.role})`, 'INFO');
    return { ...newAcc, temporaryPassword: res.temporaryPassword };
  };

  // Check RBAC permission for current user (UI gating only — the server enforces access)
  const hasPermission = (permissionName) => {
    if (!currentUser) return false;
    const roleConfig = Object.values(SECURITY_CONFIG.roles).find(r => r.id === currentUser.role);
    if (!roleConfig) return false;
    return roleConfig.permissions.includes(permissionName);
  };

  const logout = () => {
    if (currentUser) {
      logAuditEvent('AUTH_LOGOUT', `User signed out: ${currentUser.email}`, 'INFO', currentUser.email);
    }
    setCurrentUser(null);
    localStorage.removeItem('landlots_auth_user');
    localStorage.removeItem('landlots_session_token');
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      officeAccounts,
      loginWithEmail,
      loginWithGoogle,
      registerUser,
      createOfficeAccount,
      logout,
      failedAttempts,
      isLockedOut,
      lockoutRemainingSec,
      auditLogs,
      logAuditEvent,
      hasPermission,
      evaluatePasswordStrength,
      securityConfig: SECURITY_CONFIG,
      isAuthenticated: !!currentUser,
      isAdmin: currentUser?.role === 'super_admin',
      isSales: currentUser?.role === 'sales' || currentUser?.role === 'super_admin',
      isMarketing: currentUser?.role === 'marketing' || currentUser?.role === 'super_admin',
      isAccounts: currentUser?.role === 'finance_accounts' || currentUser?.role === 'super_admin'
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
