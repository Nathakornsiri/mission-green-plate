import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('gp_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('gp_token');
    if (token) {
      authAPI.me()
        .then((res) => {
          setUser(res.data);
          localStorage.setItem('gp_user', JSON.stringify(res.data));
        })
        .catch(() => {
          localStorage.removeItem('gp_token');
          localStorage.removeItem('gp_user');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (username, password) => {
    const res = await authAPI.login(username, password);
    const { token, user: userData } = res.data;
    localStorage.setItem('gp_token', token);
    localStorage.setItem('gp_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('gp_token');
    localStorage.removeItem('gp_user');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
