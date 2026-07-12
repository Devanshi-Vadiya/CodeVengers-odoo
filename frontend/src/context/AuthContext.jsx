import { createContext, useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';
import authService from '../services/authService';

const AuthContext = createContext(null);

// Map frontend roleId (URL param) → backend DB role
const ROLE_MAP = {
  manager: 'fleet_manager',
  driver: 'driver',
  safety: 'safety_officer',
  analyst: 'financial_analyst',
};

// Reverse map: DB role → frontend roleId
const REVERSE_ROLE_MAP = Object.fromEntries(
  Object.entries(ROLE_MAP).map(([k, v]) => [v, k])
);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [role, setRole] = useState(localStorage.getItem('role'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      if (token) {
        try {
          const res = await authService.getMe();
          const userData = res.data.user;
          // Map DB role to frontend role for sidebar/permissions
          const frontendRole = REVERSE_ROLE_MAP[userData.role] || userData.role;
          setUser({ ...userData, role: frontendRole });
          setRole(frontendRole);
          localStorage.setItem('role', frontendRole);
        } catch {
          // Token expired or invalid — clear everything
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          setToken(null);
          setRole(null);
          setUser(null);
        }
      }
      setLoading(false);
    };
    restoreSession();
  }, [token]);

  const login = (newToken, userData) => {
    const frontendRole = REVERSE_ROLE_MAP[userData.role] || userData.role;
    localStorage.setItem('token', newToken);
    localStorage.setItem('role', frontendRole);
    setToken(newToken);
    setRole(frontendRole);
    setUser({ ...userData, role: frontendRole });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setToken(null);
    setRole(null);
    setUser(null);
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, role, token, login, logout, loading, ROLE_MAP }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
