/**
 * Land Lots Resilient API Client
 * Seamlessly interfaces with the Express.js + SQLite backend on http://localhost:5001/api
 * Features automatic offline fallback to local mock data to guarantee 100% uptime.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1' 
    ? '/api' 
    : 'http://localhost:5001/api');

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
        signal: AbortSignal.timeout(5000)
      });
      const data = await res.json().catch(() => ({}));
      return { ...data, status: res.status };
    } catch {
      return { success: false, error: 'Unable to reach the sign-in server. Please try again shortly.' };
    }
  },

  // Register a public buyer / seller account
  async register(userData) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
        signal: AbortSignal.timeout(5000)
      });
      return await res.json();
    } catch {
      return { success: false, error: 'Unable to reach the server. Please try again shortly.' };
    }
  },

  // Staff directory (super_admin only)
  async getStaff(token) {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/users`, {
        headers: { 'Authorization': `Bearer ${token}` },
        signal: AbortSignal.timeout(3000)
      });
      if (res.ok) return await res.json();
    } catch {
      // Keep the locally cached directory
    }
    return null;
  },

  // Provision a staff account (super_admin only)
  async createStaff(staffData, token) {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(staffData),
        signal: AbortSignal.timeout(5000)
      });
      return await res.json();
    } catch {
      return { success: false, error: 'Unable to reach the server. Staff account was not created.' };
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

  // Submit a public plot booking (token advance pending finance verification).
  // Unlike the other calls this surfaces server errors, since a silent failure
  // would show the buyer a receipt for a booking that was never stored.
  async createBooking(bookingData, token) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    try {
      const res = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers,
        body: JSON.stringify(bookingData),
        signal: AbortSignal.timeout(8000)
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) return data;
      return { success: false, error: data.error || 'Booking could not be recorded. Please try again.' };
    } catch {
      return { success: false, error: 'Unable to reach the booking server. Please check your connection and try again.' };
    }
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
