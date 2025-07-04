import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import api from '../services/api';
import { User } from '../types';
import { authApi } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!user && !!token;

  const hasRole = useCallback((role: string): boolean => {
    if (!user) return false;
    if (role === 'VISITOR') return true;
    if (role === 'EDITOR') return user.role === 'EDITOR' || user.role === 'ADMIN';
    if (role === 'ADMIN') return user.role === 'ADMIN';
    return false;
  }, [user]);

  const login = async (username: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await retryWithBackoff(() => authApi.login({ username, password }));
      const { token, user } = response.data;
      
      setToken(token);
      setUser(user);
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Identifiants invalides';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await authApi.logout();
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  };

  // Fonction utilitaire pour retry avec backoff exponentiel
  const retryWithBackoff = async (fn: () => Promise<any>, maxRetries = 3, baseDelay = 1000) => {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error: any) {
        // Ne pas retry pour les erreurs d'authentification
        if (error.response?.status === 401 || error.response?.status === 403) {
          throw error;
        }
        
        // Pour les erreurs 429 ou réseau, attendre avant de retry
        if (i < maxRetries - 1 && (error.response?.status === 429 || error.code === 'ERR_NETWORK')) {
          const delay = baseDelay * Math.pow(2, i); // Backoff exponentiel
          console.log(`Retry ${i + 1}/${maxRetries} après ${delay}ms pour:`, error.message);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        
        throw error;
      }
    }
  };

  // Vérifier le token au chargement et périodiquement
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      
      if (savedToken && savedUser) {
        try {
          setToken(savedToken);
          const response = await retryWithBackoff(() => authApi.getProfile());
          setUser(response.data);
        } catch (err: any) {
          console.error('Auth verification failed:', err);
          // Ne supprimer le token que pour les erreurs d'auth, pas pour les erreurs réseau
          if (err.response?.status === 401 || err.response?.status === 403) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setToken(null);
            setUser(null);
          }
        }
      }
      
      setLoading(false);
    };
    
    initAuth();

    // Vérification périodique du token (toutes les 30 minutes pour éviter le rate limiting)
    const tokenCheckInterval = setInterval(async () => {
      const currentToken = localStorage.getItem('token');
      if (currentToken) {
        try {
          const response = await retryWithBackoff(() => authApi.getProfile());
          setUser(response.data);
        } catch (err: any) {
          console.error('Token validation failed during periodic check:', err);
          // Ne déconnecter que si c'est une erreur d'authentification (401/403)
          // Pas pour les erreurs réseau (CORS, 429, etc.)
          if (err.response?.status === 401 || err.response?.status === 403) {
            logout();
          }
          // Pour les autres erreurs (429, réseau), on garde l'utilisateur connecté
        }
      }
    }, 30 * 60 * 1000); // 30 minutes

    return () => {
      clearInterval(tokenCheckInterval);
    };
  }, []);

  const value: AuthContextType = {
    user,
    token,
    loading,
    error,
    login,
    logout,
    isAuthenticated,
    hasRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};