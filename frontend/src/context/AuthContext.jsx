import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, try to restore session from localStorage
  useEffect(() => {
    const isAuthPage = ['/login', '/register'].some(p =>
      window.location.pathname.startsWith(p)
    );
    const token = localStorage.getItem('uconnect_token');
    const savedUser = localStorage.getItem('uconnect_user');
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('uconnect_user');
      }
      // Skip re-verification on auth pages to avoid interfering with login/register
      if (!isAuthPage) {
        authAPI.me()
          .then((res) => setUser(res.data.data))
          .catch(() => logout())
          .finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    const res = await authAPI.login(credentials);
    const { user, token } = res.data.data;
    localStorage.setItem('uconnect_token', token);
    localStorage.setItem('uconnect_user', JSON.stringify(user));
    setUser(user);
    return user;
  };

  const register = async (data) => {
    const res = await authAPI.register(data);
    const { user, token } = res.data.data;
    localStorage.setItem('uconnect_token', token);
    localStorage.setItem('uconnect_user', JSON.stringify(user));
    setUser(user);
    return user;
  };

  const logout = () => {
    localStorage.removeItem('uconnect_token');
    localStorage.removeItem('uconnect_user');
    setUser(null);
  };

  const isStudent = user?.role === 'STUDENT';
  const isTeacher = user?.role === 'TEACHER';
  const isRecruiter = user?.role === 'RECRUITER';

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isStudent, isTeacher, isRecruiter }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
