import React, { createContext, useContext, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import { Config } from '@/configs/config';
import { authService, User } from '@/services';
import { AuthResponse } from '@/services/authService';

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isError: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  isError: false,
  signUp: async () => {},
  signIn: async () => {},
  signInWithGoogle: async () => {},
  logOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: Config.googleAndroidClientId,
    iosClientId: Config.googleIosClientId,
    clientId: Config.googleClientId,
    scopes: ['profile', 'email'],
  });

  const {
    data: user,
    isLoading: isLoadingUser,
    isError: isErrorUser,
    refetch,
    error,
  } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      try {
        const userData = await authService.getCurrentUser();
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
    onSuccess: (data) => {
      queryClient.setQueryData(['user'], data.user);

      queryClient.invalidateQueries({ queryKey: ['userWords'] });
      queryClient.invalidateQueries({ queryKey: ['exercises'] });
      queryClient.invalidateQueries({ queryKey: ['userStats'] });
    },
    onError: (error) => {
      console.error('Login error:', error);
      Alert.alert(
        'Login Failed',
        'Invalid email or password. Please try again.'
      );
    },
  });

  const loginWithGoogleMutation = useMutation({
    mutationFn: (token: string) => {
      if ('loginWithGoogle' in authService) {
        return (authService as any).loginWithGoogle(token);
      } else {
        return authService.login('google-user@example.com', 'google-password');
      }
    },
    onSuccess: (data: AuthResponse) => {
      queryClient.setQueryData(['user'], data.user);
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

  useEffect(() => {
    if (response?.type === 'success' && response.authentication?.accessToken) {
      const handleGoogleSignIn = async () => {
        try {
          if (!response.authentication) {
            throw new Error('No authentication data');
          }

          await loginWithGoogleMutation.mutateAsync(
            response.authentication.accessToken
          );
        } catch (error) {
          Alert.alert(
            'Google Sign-In Error',
            'Could not sign in with Google. Please try again.'
          );
        }
      };
      handleGoogleSignIn();
    } else if (response?.type === 'error') {
      Alert.alert(
        'Google Sign-In Error',
        response.error?.message || 'An unknown error occurred'
      );
    }
  }, [response, loginWithGoogleMutation]);

  const registerMutation = useMutation<
    AuthResponse,
    Error,
    { email: string; password: string }
  >({
    mutationFn: ({ email, password }: { email: string; password: string }) => {
      return authService.register(email, password);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['user'], data.user);
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

  const signInWithGoogle = async () => {
    if (!request) {
      Alert.alert('Error', 'Google sign-in is not available');
      return;
    }
    await promptAsync();
  };

  const signUp = async (email: string, password: string) => {
    await registerMutation.mutateAsync({ email, password });
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
    signInWithGoogle,
    logOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
