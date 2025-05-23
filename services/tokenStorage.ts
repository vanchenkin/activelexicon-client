import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ACCESS_TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

const isWeb = Platform.OS === 'web';

export class TokenStorage {
  static async saveAccessToken(accessToken: string): Promise<void> {
    try {
      if (isWeb) {
        await AsyncStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
        console.warn(
          'Running on web - tokens are stored in AsyncStorage which is not secure. Do not store sensitive information in production.'
        );
      } else {
        await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
      }
    } catch (error) {
      console.error('Error saving access token to storage:', error);
      throw error;
    }
  }

  static async getAccessToken(): Promise<string | null> {
    try {
      if (isWeb) {
        return await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
      } else {
        return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
      }
    } catch (error) {
      console.error('Error retrieving access token from storage:', error);
      return null;
    }
  }

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

  static async clearAuthData(): Promise<void> {
    try {
      if (isWeb) {
        await AsyncStorage.multiRemove([ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY]);
      } else {
        await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
        await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
      }
    } catch (error) {
      console.error('Error clearing authentication data from storage:', error);
      throw error;
    }
  }

  static async isLoggedIn(): Promise<boolean> {
    const accessToken = await this.getAccessToken();
    return !!accessToken;
  }
}
