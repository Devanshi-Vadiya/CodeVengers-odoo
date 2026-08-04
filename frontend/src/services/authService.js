import { delay } from './mockDb';

// ── Demo credentials per role ─────────────────────────────────────────────────
const DEMO_USERS = {
  'fleet@demo.com':   { id: 1, name: 'Demo User',    email: 'fleet@demo.com',   role: 'fleet_manager',     password: 'password123' },
  'driver@demo.com':  { id: 2, name: 'Demo Driver',  email: 'driver@demo.com',  role: 'driver',            password: 'password123' },
  'safety@demo.com':  { id: 3, name: 'Demo Safety',  email: 'safety@demo.com',  role: 'safety_officer',    password: 'password123' },
  'analyst@demo.com': { id: 4, name: 'Demo Analyst', email: 'analyst@demo.com', role: 'financial_analyst', password: 'password123' },
};

let _currentUser = null;

const authService = {
  login: async (email, password) => {
    await delay(300);
    const user = DEMO_USERS[email];
    if (!user || user.password !== password) {
      const err = new Error('Invalid credentials');
      err.response = { data: { message: 'Invalid email or password.' } };
      throw err;
    }
    _currentUser = user;
    localStorage.setItem('mockUser', JSON.stringify(user));
    return { token: `demo-token-${user.role}`, user };
  },

  getMe: async () => {
    await delay(100);
    const stored = localStorage.getItem('mockUser');
    if (stored) { _currentUser = JSON.parse(stored); return { data: { user: _currentUser } }; }
    const err = new Error('Unauthorized'); err.response = { status: 401 }; throw err;
  },

  logout: async () => {
    _currentUser = null;
    localStorage.removeItem('mockUser');
    return {};
  },
};

export default authService;
