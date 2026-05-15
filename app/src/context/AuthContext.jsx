import { createContext, useContext, useState, useEffect } from 'react';
import { api, setToken, getToken, clearToken } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Restore session from token on mount
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const token = getToken();
        if (token) {
          setToken(token);
          const userData = await api.auth.getMe();
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error('Session restoration failed:', err);
        clearToken();
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const register = async (name, email, password, role) => {
    setError(null);
    setIsLoading(true);
    try {
      const response = await api.auth.register({
        name,
        email,
        password,
        role,
      });

      setToken(response.tokens.accessToken);
      setUser(response.user);
      setIsAuthenticated(true);
      return { success: true, role: response.user.role };
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        'Registration failed. Please try again.';
      setError(message);
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    setError(null);
    setIsLoading(true);
    try {
      const response = await api.auth.login(email, password);

      setToken(response.tokens.accessToken);
      setUser(response.user);
      setIsAuthenticated(true);
      return { success: true, role: response.user.role };
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        'Login failed. Please try again.';
      setError(message);
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.auth.logout();
    } catch (err) {
      console.error('Logout API error (non-critical):', err);
    } finally {
      clearToken();
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
    }
  };

  const clearError = () => setError(null);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    register,
    clearError,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0a0f1a]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00c853]"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
