import React, { createContext, useContext, useState, useEffect } from 'react';
import { buildApiUrl, getAuthHeaders } from '../utils/config';

interface User {
  id: string;
  username: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkSession: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user has valid session on app start
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async (): Promise<boolean> => {
    const token = localStorage.getItem('flixplayer-token');
    
    if (!token) {
      setIsLoading(false);
      return false;
    }

    try {
      const response = await fetch(buildApiUrl('/auth/session'), {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setIsAuthenticated(true);
        setIsLoading(false);
        return true;
      } else {
        // Token is invalid, remove it
        console.error('Session check failed:', response.status, response.statusText);
        localStorage.removeItem('flixplayer-token');
        setUser(null);
        setIsAuthenticated(false);
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Session check error:', error);
      localStorage.removeItem('flixplayer-token');
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
      return false;
    }
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(buildApiUrl('/auth/login'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Store JWT token
        localStorage.setItem('flixplayer-token', data.token);
        
        setUser(data.user);
        setIsAuthenticated(true);
        return true;
      } else {
        const errorData = await response.json();
        console.error('Login failed:', errorData.error);
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('flixplayer-token');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoading,
      login, 
      logout, 
      checkSession 
    }}>
      {children}
    </AuthContext.Provider>
  );
};