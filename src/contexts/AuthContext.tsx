import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/sonner';
import { api } from '@/services/apiConfig';

interface User {
  email: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
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
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('travelUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('travelUser');
        localStorage.removeItem('travelUserToken');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await api.post('/users/login', { email, password }); // Use relative URL
      const data = response.data; // No await needed
      if (response.status >= 200 && response.status < 300) {
        const user: User = {
          email: data.email || email, // Prefer API response, fallback to input
          role: data.role || 'user', // Use role from API
        };
        setUser(user);
        localStorage.setItem('travelUser', JSON.stringify(user));
        localStorage.setItem('travelUserToken', data.token);
        toast.success('Login successful!');
        navigate('/dashboard');
      } else {
        toast.error('Invalid credentials');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('travelUser');
    localStorage.removeItem('travelUserToken');
    toast.info('You have been logged out');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};