import api from './api';
import { delay } from './mockDb';

// ── Demo credentials per role ─────────────────────────────────────────────────
const DEMO_USERS = {
  'fleet@demo.com':   { id: 1, name: 'Demo User',    email: 'fleet@demo.com',   role: 'fleet_manager',     password: 'password123' },
  'driver@demo.com':  { id: 2, name: 'Demo Driver',  email: 'driver@demo.com',  role: 'driver',            password: 'password123' },
  'safety@demo.com':  { id: 3, name: 'Demo Safety',  email: 'safety@demo.com',  role: 'safety_officer',    password: 'password123' },
  'analyst@demo.com': { id: 4, name: 'Demo Analyst', email: 'analyst@demo.com', role: 'financial_analyst', password: 'password123' },
  'finance@demo.com': { id: 4, name: 'Demo Analyst', email: 'finance@demo.com', role: 'financial_analyst', password: 'password123' },
};

let _currentUser = null;

const authService = {
  login: async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password }, { timeout: 3500 });
      if (res.data?.data?.token) {
        _currentUser = res.data.data.user;
        localStorage.setItem('token', res.data.data.token);
        localStorage.setItem('mockUser', JSON.stringify(_currentUser));
        return { token: res.data.data.token, user: _currentUser };
      }
    } catch (err) {
      // If error is 401 or 400 from actual backend, re-throw if it wasn't a network failure
      if (err.response && err.response.status !== 502 && err.response.status !== 503 && err.response.status !== 504) {
        // If wrong credentials on backend, check if demo credentials match for fallback
        const demo = DEMO_USERS[email];
        if (!demo || demo.password !== password) {
          throw err;
        }
      }
      console.warn('[authService] Backend login unreachable, falling back to demo session:', err.message);
    }

    // Local / offline fallback
    await delay(200);
    const user = DEMO_USERS[email];
    if (!user || user.password !== password) {
      const err = new Error('Invalid credentials');
      err.response = { data: { message: 'Invalid email or password.' } };
      throw err;
    }
    _currentUser = user;
    const fakeToken = `demo-token-${user.role}`;
    localStorage.setItem('token', fakeToken);
    localStorage.setItem('mockUser', JSON.stringify(user));
    return { token: fakeToken, user };
  },

  getMe: async () => {
    try {
      const res = await api.get('/auth/me', { timeout: 2500 });
      if (res.data?.data?.user) {
        _currentUser = res.data.data.user;
        localStorage.setItem('mockUser', JSON.stringify(_currentUser));
        return { data: { user: _currentUser } };
      }
    } catch (err) {
      // Backend not reached or token not recognized on backend, try local storage
    }

    await delay(100);
    const stored = localStorage.getItem('mockUser');
    if (stored) {
      _currentUser = JSON.parse(stored);
      return { data: { user: _currentUser } };
    }
    const err = new Error('Unauthorized');
    err.response = { status: 401 };
    throw err;
  },

  logout: async () => {
    try {
      await api.post('/auth/logout', {}, { timeout: 2000 });
    } catch {
      // Ignore network errors on logout
    }
    _currentUser = null;
    localStorage.removeItem('token');
    localStorage.removeItem('mockUser');
    localStorage.removeItem('role');
    return { success: true };
  },
};

export default authService;
