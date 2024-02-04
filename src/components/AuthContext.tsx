import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import UserPool from '../Cognito';

interface AuthContextProps {
  isAuthenticated: boolean;
  login: (username: string) => void;
  logout: () => void;
  loginData: { username: string | null } | null;
  clearUserData: () => void; // Add clearUserData function
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  const login = (user: string) => {
    setUsername(user);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setUsername(null);
    setIsAuthenticated(false);
  };

  const clearUserData = () => {
    setUsername(null);
    setIsAuthenticated(false);
  };

useEffect(() => {
  const checkAuthenticated = async () => {
    try {
      const user = await UserPool.getCurrentUser();
      setIsAuthenticated(!!user); // Set isAuthenticated to true if user is not null
      if (user) {
        login(user.getUsername());
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
    }
  };

  checkAuthenticated();
}, []);


  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loginData: { username }, clearUserData }}>
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
