import React, { createContext, useContext, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import { Config } from '@/utils/config';
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

// The provider component that uses the existing QueryClient
export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Use the queryClient
  const queryClient = useQueryClient();

  // Google Auth configuration
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: Config.googleAndroidClientId,
    iosClientId: Config.googleIosClientId,
    clientId: Config.googleClientId, // For Expo web
    scopes: ['profile', 'email'],
  });

  // Query for getting the current user
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
    staleTime: 1000 * 60 * 60, // 1 hour
    retry: 1,
  });

  // Run on mount to ensure we have the most up-to-date user data
  useEffect(() => {
    refetch();
  }, [refetch]);

  // Mutation for login
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
      // Also invalidate other user-related queries that might depend on auth status
      queryClient.invalidateQueries({ queryKey: ['userWords'] });
      queryClient.invalidateQueries({ queryKey: ['exercises'] });
      queryClient.invalidateQueries({ queryKey: ['userStats'] });
    },
    onError: (error) => {
      Alert.alert(
        'Login Failed',
        'Invalid email or password. Please try again.'
      );
    },
  });

  // Mutation for Google login
  const loginWithGoogleMutation = useMutation({
    mutationFn: (token: string) => {
      // Use a conditional to check if authService has loginWithGoogle method
      // For mock service, we'll fallback to regular login with default credentials
      if ('loginWithGoogle' in authService) {
        return (authService as any).loginWithGoogle(token);
      } else {
        // Fallback to regular login with Google credentials for testing
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
      Alert.alert(
        'Google Login Failed',
        'Could not sign in with Google. Please try again.'
      );
    },
  });

  // Handle Google sign-in response
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

  // Mutation for registration
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
      Alert.alert(
        'Registration Failed',
        'Could not create account. Please try again.'
      );
    },
  });

  // Mutation for logout
  const logoutMutation = useMutation({
    mutationFn: () => {
      return authService.logout();
    },
    onSuccess: () => {
      queryClient.setQueryData(['user'], null);
      // Clear other cached data when logging out
      queryClient.invalidateQueries();
    },
    onError: (error) => {
      // Still clear local data even if server logout fails
      queryClient.setQueryData(['user'], null);
      queryClient.invalidateQueries();
    },
  });

  // Sign in function
  const signIn = async (email: string, password: string) => {
    await loginMutation.mutateAsync({ email, password });
  };

  // Sign in with Google function
  const signInWithGoogle = async () => {
    if (!request) {
      Alert.alert('Error', 'Google sign-in is not available');
      return;
    }
    await promptAsync();
  };

  // Sign up function
  const signUp = async (email: string, password: string) => {
    await registerMutation.mutateAsync({ email, password });
  };

  // Log out function
  const logOut = async () => {
    await logoutMutation.mutateAsync();
  };

  // Combine loading states
  const isLoading =
    isLoadingUser ||
    loginMutation.isPending ||
    registerMutation.isPending ||
    logoutMutation.isPending ||
    loginWithGoogleMutation.isPending;

  // Combine error states
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
