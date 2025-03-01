import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockAuthService } from '@/services/mockAuth';

// Define the User type
type User = {
  id: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signUp: async () => {},
  signIn: async () => {},
  logOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  // Check if user is already logged in (could use AsyncStorage in a real app)
  useEffect(() => {
    const currentUser = mockAuthService.getCurrentUser();
    if (currentUser) {
      setUser({
        id: currentUser.id,
        email: currentUser.email,
      });
    }
    setLoading(false);
  }, []);

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    try {
      const newUser = await mockAuthService.register(email, password);
      setUser({
        id: newUser.id,
        email: newUser.email,
      });
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const loggedInUser = await mockAuthService.login(email, password);
      setUser({
        id: loggedInUser.id,
        email: loggedInUser.email,
      });
    } finally {
      setLoading(false);
    }
  };

  const logOut = async () => {
    setLoading(true);
    try {
      await mockAuthService.logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    logOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
