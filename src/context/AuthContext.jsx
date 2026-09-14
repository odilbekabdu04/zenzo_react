import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Brauzerdan userni yuklash
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('access_token');

    if (storedUser && token) {
      try {
        const parsed = JSON.parse(storedUser);
        const role = parsed.is_superuser ? 'admin' : (parsed.role || 'customer');
        setUser({ ...parsed, role });
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // ============================================
  // ODDIY USER LOGIN (email + parol)
  // ============================================
  const login = async (email, password) => {
    const res = await API.post('/login/', { email, password });

    const userData = { ...res.data.user, role: res.data.role };

    localStorage.setItem('access_token', res.data.access);
    localStorage.setItem('refresh_token', res.data.refresh);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('role', res.data.role);

    setUser(userData);
    return res.data;
  };

  // ============================================
  // 🔐 ADMIN LOGIN (username + parol)
  // ============================================
  const adminLogin = async (username, password) => {
    const res = await API.post('/admin-login/', { username, password });

    const userData = { ...res.data.user, role: 'admin' };

    localStorage.setItem('access_token', res.data.access);
    localStorage.setItem('refresh_token', res.data.refresh);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('role', 'admin');

    setUser(userData);
    return res.data;
  };

  // ============================================
  // REGISTER
  // ============================================
  const register = async (data) => {
    const res = await API.post('/register/', data);
    return res.data;
  };

  // ============================================
  // LOGOUT
  // ============================================
  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, adminLogin, register, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);