import React, { createContext, useContext, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService, profileServiceInstance, User } from '@/services/api';
import { AuthResponse } from '@/services/api/authService';
import { Alert } from './crossPlatformAlert';

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isError: boolean;
  signUp: (
    email: string,
    password: string,
    languageLevel: string
  ) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  isError: false,
  signUp: async () => {},
  signIn: async () => {},
  logOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading: isLoadingUser,
    isError: isErrorUser,
    refetch,
  } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      try {
        const userData = await profileServiceInstance.getProfile();
        return userData;
      } catch (err) {
        throw err;
      }
    },
    staleTime: 1000 * 60 * 60,
    retry: 1,
  });

  useEffect(() => {
    refetch();
  }, [refetch]);

  const loginMutation = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      return authService.login(email, password);
    },
    onSuccess: () => {
      refetch();
      queryClient.invalidateQueries({ queryKey: ['userWords'] });
      queryClient.invalidateQueries({ queryKey: ['exercises'] });
      queryClient.invalidateQueries({ queryKey: ['userStats'] });
    },
  });

  const loginWithGoogleMutation = useMutation({
    mutationFn: (token: string) => {
      if ('loginWithGoogle' in authService) {
        return authService.loginWithGoogle(token);
      } else {
        return authService.login('google-user@example.com', 'google-password');
      }
    },
    onSuccess: () => {
      refetch();
      queryClient.invalidateQueries({ queryKey: ['userWords'] });
      queryClient.invalidateQueries({ queryKey: ['exercises'] });
      queryClient.invalidateQueries({ queryKey: ['userStats'] });
    },
    onError: (error) => {
      console.error('Google Login error:', error);
      Alert.alert(
        'Google Login Failed',
        'Could not sign in with Google. Please try again.'
      );
    },
  });

  const registerMutation = useMutation<
    AuthResponse,
    Error,
    { email: string; password: string; languageLevel: string }
  >({
    mutationFn: ({
      email,
      password,
      languageLevel,
    }: {
      email: string;
      password: string;
      languageLevel: string;
    }) => {
      return authService.register(email, password, languageLevel);
    },
    onSuccess: () => {
      refetch();
    },
    onError: (error) => {
      console.error('Registration error:', error);
      Alert.alert(
        'Registration Failed',
        'Could not create account. Please try again.'
      );
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => {
      return authService.logout();
    },
    onSuccess: () => {
      queryClient.setQueryData(['user'], null);

      queryClient.invalidateQueries();
    },
    onError: (error) => {
      console.error('Logout error:', error);
      queryClient.setQueryData(['user'], null);
      queryClient.invalidateQueries();
    },
  });

  const signIn = async (email: string, password: string) => {
    await loginMutation.mutateAsync({ email, password });
  };

  const signUp = async (
    email: string,
    password: string,
    languageLevel: string
  ) => {
    await registerMutation.mutateAsync({ email, password, languageLevel });
  };

  const logOut = async () => {
    await logoutMutation.mutateAsync();
  };

  const isLoading =
    isLoadingUser ||
    loginMutation.isPending ||
    registerMutation.isPending ||
    logoutMutation.isPending ||
    loginWithGoogleMutation.isPending;

  const isError =
    isErrorUser ||
    loginMutation.isError ||
    registerMutation.isError ||
    logoutMutation.isError ||
    loginWithGoogleMutation.isError;

  const value = {
    user: user || null,
    isLoading,
    isError,
    signUp,
    signIn,
    logOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
