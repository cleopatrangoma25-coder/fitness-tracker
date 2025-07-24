import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useAuthStore } from '@fitness-tracker/store';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, user: authUser } = useAuthStore();

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if user is already authenticated
        if (isAuthenticated && authUser) {
          setUser({
            id: authUser.userId,
            email: authUser.email || '',
            firstName: authUser.firstName || '',
            lastName: authUser.lastName || '',
            displayName: authUser.displayName || '',
          });
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [isAuthenticated, authUser]);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      // Use existing auth store login method
      // This will be integrated with your existing Firebase auth
      
      // For now, simulate successful login
      const mockUser: User = {
        id: 'user1',
        email,
        firstName: 'John',
        lastName: 'Doe',
        displayName: 'JohnDoe',
      };
      
      setUser(mockUser);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      // Use existing auth store logout method
      
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      setIsLoading(true);
      // Use existing auth store signup method
      console.log('Signup attempt:', { email, password, firstName, lastName });
      
      // For now, simulate successful signup
      const mockUser: User = {
        id: 'user1',
        email,
        firstName,
        lastName,
        displayName: `${firstName}${lastName}`,
      };
      
      setUser(mockUser);
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    signup,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 