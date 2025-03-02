import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Key constants
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';
const REFRESH_TOKEN_KEY = 'refresh_token';

/**
 * Check if the app is running in a web environment
 */
const isWeb = Platform.OS === 'web';

/**
 * Service for securely storing and retrieving authentication tokens and user data
 * Uses SecureStore on native platforms and AsyncStorage on web
 */
export class TokenStorage {
  /**
   * Save authentication token to secure storage
   * @param token - JWT token or other authentication token
   */
  static async saveToken(token: string): Promise<void> {
    try {
      if (isWeb) {
        await AsyncStorage.setItem(TOKEN_KEY, token);
        console.warn(
          'Running on web - tokens are stored in AsyncStorage which is not secure. Do not store sensitive information in production.'
        );
      } else {
        await SecureStore.setItemAsync(TOKEN_KEY, token);
      }
    } catch (error) {
      console.error('Error saving token to storage:', error);
      throw error;
    }
  }

  /**
   * Retrieve authentication token from secure storage
   * @returns The stored token or null if not found
   */
  static async getToken(): Promise<string | null> {
    try {
      if (isWeb) {
        return await AsyncStorage.getItem(TOKEN_KEY);
      } else {
        return await SecureStore.getItemAsync(TOKEN_KEY);
      }
    } catch (error) {
      console.error('Error retrieving token from storage:', error);
      return null;
    }
  }

  /**
   * Save refresh token to secure storage
   * @param refreshToken - Refresh token for renewing authentication
   */
  static async saveRefreshToken(refreshToken: string): Promise<void> {
    try {
      if (isWeb) {
        await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      } else {
        await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
      }
    } catch (error) {
      console.error('Error saving refresh token to storage:', error);
      throw error;
    }
  }

  /**
   * Retrieve refresh token from secure storage
   * @returns The stored refresh token or null if not found
   */
  static async getRefreshToken(): Promise<string | null> {
    try {
      if (isWeb) {
        return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
      } else {
        return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
      }
    } catch (error) {
      console.error('Error retrieving refresh token from storage:', error);
      return null;
    }
  }

  /**
   * Save user data to secure storage
   * @param userData - User data object (will be JSON stringified)
   */
  static async saveUserData(userData: any): Promise<void> {
    try {
      const userDataString = JSON.stringify(userData);
      if (isWeb) {
        await AsyncStorage.setItem(USER_KEY, userDataString);
      } else {
        await SecureStore.setItemAsync(USER_KEY, userDataString);
      }
    } catch (error) {
      console.error('Error saving user data to storage:', error);
      throw error;
    }
  }

  /**
   * Retrieve user data from secure storage
   * @returns The stored user data object or null if not found
   */
  static async getUserData<T = any>(): Promise<T | null> {
    try {
      let userDataString;
      if (isWeb) {
        userDataString = await AsyncStorage.getItem(USER_KEY);
      } else {
        userDataString = await SecureStore.getItemAsync(USER_KEY);
      }

      if (!userDataString) return null;
      return JSON.parse(userDataString) as T;
    } catch (error) {
      console.error('Error retrieving user data from storage:', error);
      return null;
    }
  }

  /**
   * Clear all authentication data from secure storage
   */
  static async clearAuthData(): Promise<void> {
    try {
      if (isWeb) {
        await AsyncStorage.multiRemove([
          TOKEN_KEY,
          REFRESH_TOKEN_KEY,
          USER_KEY,
        ]);
      } else {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
        await SecureStore.deleteItemAsync(USER_KEY);
      }
    } catch (error) {
      console.error('Error clearing authentication data from storage:', error);
      throw error;
    }
  }

  /**
   * Check if user is logged in by verifying token existence
   * @returns Boolean indicating if token exists
   */
  static async isLoggedIn(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  }
}
