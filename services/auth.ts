import { ApiService } from './api';
import { TokenStorage } from './tokenStorage';

// Types for authentication responses
interface AuthResponse {
  token: string;
  refreshToken: string;
  user: UserData;
}

interface UserData {
  id: string;
  email: string;
  name?: string;
  [key: string]: any; // Allow for additional user fields
}

/**
 * Authentication service for handling user login, registration, and logout
 */
export class AuthService {
  private api: ApiService;

  constructor() {
    this.api = new ApiService();
  }

  /**
   * Log in with email and password
   * @param email User's email
   * @param password User's password
   * @returns User data
   */
  async login(email: string, password: string): Promise<UserData> {
    try {
      // Make API call to login endpoint
      const response = await this.api.post<AuthResponse>('/auth/login', {
        email,
        password,
      });

      // Store authentication data
      await this.handleAuthResponse(response);

      return response.user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Register a new user
   * @param userData User registration data
   * @returns User data
   */
  async register(userData: {
    email: string;
    password: string;
    name?: string;
    [key: string]: any;
  }): Promise<UserData> {
    try {
      // Make API call to register endpoint
      const response = await this.api.post<AuthResponse>(
        '/auth/register',
        userData
      );

      // Store authentication data
      await this.handleAuthResponse(response);

      return response.user;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  /**
   * Log in with Google
   * @param googleToken Google OAuth token
   * @returns User data
   */
  async loginWithGoogle(googleToken: string): Promise<UserData> {
    try {
      // Make API call to Google login endpoint
      const response = await this.api.post<AuthResponse>('/auth/google', {
        token: googleToken,
      });

      // Store authentication data
      await this.handleAuthResponse(response);

      return response.user;
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  }

  /**
   * Log out the current user
   */
  async logout(): Promise<void> {
    try {
      // Optional: Make API call to invalidate token on the server
      const token = await TokenStorage.getToken();
      if (token) {
        try {
          await this.api.post('/auth/logout');
        } catch (error) {
          // Even if server-side logout fails, continue with client-side logout
          console.warn('Server-side logout failed:', error);
        }
      }

      // Clear local authentication data
      await TokenStorage.clearAuthData();
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  /**
   * Get the current user's data
   * @returns User data or null if not logged in
   */
  async getCurrentUser<T extends UserData = UserData>(): Promise<T | null> {
    try {
      // Check if we have stored user data
      const userData = await TokenStorage.getUserData<T>();
      if (userData) return userData;

      // If no stored user data but we have a token, fetch user data from API
      const isLoggedIn = await TokenStorage.isLoggedIn();
      if (isLoggedIn) {
        // Fetch user data from server
        const response = await this.api.get<T>('/auth/me');

        // Store the user data
        await TokenStorage.saveUserData(response);

        return response;
      }

      return null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  /**
   * Check if user is currently logged in
   * @returns Boolean indicating if user is logged in
   */
  async isLoggedIn(): Promise<boolean> {
    return TokenStorage.isLoggedIn();
  }

  /**
   * Handle the authentication response by storing tokens and user data
   * @param response Authentication response from API
   */
  private async handleAuthResponse(response: AuthResponse): Promise<void> {
    // Store the JWT token
    await TokenStorage.saveToken(response.token);

    // Store the refresh token
    await TokenStorage.saveRefreshToken(response.refreshToken);

    // Store the user data
    await TokenStorage.saveUserData(response.user);
  }
}
