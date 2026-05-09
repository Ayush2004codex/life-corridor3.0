import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const USERS_KEY = 'lc_users';
const SESSION_KEY = 'lc_session';

function getStoredUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]'); }
  catch { return []; }
}

function getStoredSession() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); }
  catch { return null; }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const session = getStoredSession();
    if (session && session.loggedIn) {
      setUser(session);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const register = (name, email, password, role) => {
    const users = getStoredUsers();
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, message: 'An account with this email already exists.' };
    }
    const newUser = { name, email, password, role };
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    // Auto-login after registration
    const session = { loggedIn: true, name, email, role, loginTime: Date.now() };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setUser(session);
    setIsAuthenticated(true);
    return { success: true, role };
  };

  const login = (email, password) => {
    const users = getStoredUsers();
    const found = users.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!found) {
      // Demo accounts fallback
      if (email.toLowerCase().includes('admin')) {
        const session = { loggedIn: true, name: 'Admin User', email, role: 'admin', loginTime: Date.now() };
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        setUser(session);
        setIsAuthenticated(true);
        return { success: true, role: 'admin' };
      }
      if (email.toLowerCase().includes('driver')) {
        const session = { loggedIn: true, name: 'Driver User', email, role: 'driver', loginTime: Date.now() };
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        setUser(session);
        setIsAuthenticated(true);
        return { success: true, role: 'driver' };
      }
      return { success: false, message: 'Invalid email or password.' };
    }
    const session = { loggedIn: true, name: found.name, email: found.email, role: found.role, loginTime: Date.now() };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setUser(session);
    setIsAuthenticated(true);
    return { success: true, role: found.role };
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
    setIsAuthenticated(false);
  };

  if (loading) return null; // Prevent flash

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
