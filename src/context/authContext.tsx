import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';

import { authService } from '../service/auth.service';

interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: { username?: string; avatar?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  updateProfile: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const init = async () => {
      if (authService.isAuthenticated()) {
        try {
          const data = await authService.getMe();
          setUser(data);
        } catch {
          authService.clearToken();
        }
      }
      setIsLoading(false);
    };
    init();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const data = await authService.login(email, password);
    setUser(data.user);
  }, []);

  const register = useCallback(async (username: string, email: string, password: string) => {
    const data = await authService.register(username, email, password);
    setUser(data.user);
  }, []);

  const logout = useCallback(() => {
    authService.clearToken();
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (updates: { username?: string; avatar?: string }) => {
    const data = await authService.updateProfile(updates);
    setUser(data);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
