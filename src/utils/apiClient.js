/**
 * Land Lots Resilient API Client
 * Seamlessly interfaces with the Express.js + SQLite backend on http://localhost:5001/api
 * Features automatic offline fallback to local mock data to guarantee 100% uptime.
 */

const API_BASE_URL = 'http://localhost:5001/api';

export const apiClient = {
  // Check backend server health
  async checkHealth() {
    try {
      const res = await fetch(`${API_BASE_URL}/health`, { signal: AbortSignal.timeout(1500) });
      if (res.ok) return await res.json();
    } catch (e) {
      // Offline fallback
    }
    return null;
  },

  // Authenticate user via backend
  async login(email, password) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        signal: AbortSignal.timeout(3000)
      });
      return await res.json();
    } catch (e) {
      return { success: false, error: 'Backend unreachable. Using local auth engine.' };
    }
  },

  // Public Google SSO
  async googleLogin(userData) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
        signal: AbortSignal.timeout(3000)
      });
      return await res.json();
    } catch (e) {
      return { success: false, error: 'Backend unreachable.' };
    }
  },

  // Fetch properties from SQLite database with query filters
  async getProperties(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.city && filters.city !== 'All Cities') params.append('city', filters.city);
      if (filters.category && filters.category !== 'all') params.append('category', filters.category);
      if (filters.facing && filters.facing !== 'all') params.append('facing', filters.facing);
      if (filters.search) params.append('search', filters.search);

      const url = `${API_BASE_URL}/properties?${params.toString()}`;
      const res = await fetch(url, { signal: AbortSignal.timeout(2500) });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('[API Client] Backend offline, using local property inventory.');
    }
    return null; // Signals caller to use local fallback
  },

  // Post newly captured lead / site visit
  async submitLead(leadData) {
    try {
      const res = await fetch(`${API_BASE_URL}/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData),
        signal: AbortSignal.timeout(2500)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('[API Client] Failed to sync lead with backend, saved locally.');
    }
    return null;
  },

  // Fetch office financial ledger
  async getLedger(token) {
    try {
      const res = await fetch(`${API_BASE_URL}/ledger`, {
        headers: { 'Authorization': `Bearer ${token}` },
        signal: AbortSignal.timeout(2500)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('[API Client] Ledger offline, using local state.');
    }
    return null;
  },

  // Record token advance in backend database
  async recordTransaction(txData, token) {
    try {
      const res = await fetch(`${API_BASE_URL}/ledger`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(txData),
        signal: AbortSignal.timeout(2500)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('[API Client] Transaction recorded locally.');
    }
    return null;
  }
};
