// AuthContext.tsx

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import UserPool from '../Cognito';

interface AuthContextProps {
  isAuthenticated: boolean;
  login: (username: string) => void;
  logout: () => void;
  loginData: { username: string | null } | null;
  clearUserData: () => void;
  isLoading: boolean; // Add isLoading property
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = (user: string) => {
    setUsername(user);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setUsername(null);
    setIsAuthenticated(false);

    // Clear Cognito-related data
    const user = UserPool.getCurrentUser();
    if (user) {
      user.signOut();
    }

    setIsLoading(false); // Set loading to false during logout
  };

  const clearUserData = () => {
    setUsername(null);
    setIsAuthenticated(false);
    setIsLoading(false); // Set loading to false when clearing user data
  };

  useEffect(() => {
    const checkAuthenticated = async () => {
      try {
        const user = await UserPool.getCurrentUser();
        setIsAuthenticated(!!user);
        if (user) {
          login(user.getUsername());
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthenticated();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loginData: { username }, clearUserData, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
