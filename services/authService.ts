import { ApiService } from './api';
import { TokenStorage } from './tokenStorage';

export interface User {
  id: string;
  email: string;
  profile: {
    level: number;
    maxLevel: number;
    experiencePoints: number;
    joinedDate: Date;
    lastLogin: Date;
  };
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export class AuthService {
  private api: ApiService;

  constructor() {
    this.api = new ApiService();
  }

  // Register a new user
  async register(email: string, password: string): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>('/auth/register', {
      email,
      password,
    });

    // Store tokens securely
    await this.saveTokens(response);

    // Parse dates in the user object
    this.parseUserDates(response.user);

    return response;
  }

  // Login user
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>('/auth/login', {
      email,
      password,
    });

    // Store tokens securely
    await this.saveTokens(response);

    // Parse dates in the user object
    this.parseUserDates(response.user);

    return response;
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      // Invalidate token on the server
      const token = await TokenStorage.getToken();
      if (token) {
        await this.api.post('/auth/logout');
      }
    } catch (error) {
      console.error('Error during server logout:', error);
    } finally {
      // Always clear local storage even if server request fails
      await TokenStorage.clearAuthData();
    }
  }

  // Get current user using token
  async getCurrentUser(): Promise<User | null> {
    try {
      // Check if we have a token
      const token = await TokenStorage.getToken();
      if (!token) return null;

      // Fetch the current user from the API
      const user = await this.api.get<User>('/auth/me');

      // Parse dates
      this.parseUserDates(user);

      return user;
    } catch (error: any) {
      console.error('Error getting current user:', error);

      // If unauthorized, clear tokens
      if (error.response && error.response.status === 401) {
        await TokenStorage.clearAuthData();
      }

      return null;
    }
  }

  // Refresh token
  async refreshToken(refreshToken: string): Promise<boolean> {
    try {
      const response = await this.api.post<{
        token: string;
        refreshToken: string;
      }>('/auth/refresh', { refreshToken });

      // Save the new tokens
      await TokenStorage.saveToken(response.token);
      await TokenStorage.saveRefreshToken(response.refreshToken);

      return true;
    } catch (error: any) {
      console.error('Error refreshing token:', error);
      return false;
    }
  }

  // Update user profile
  async updateUserProfile(updates: Partial<User['profile']>): Promise<User> {
    const response = await this.api.patch<User>('/auth/profile', updates);

    // Parse dates
    this.parseUserDates(response);

    return response;
  }

  // Helper to parse date strings into Date objects
  private parseUserDates(user: User): void {
    if (user.profile) {
      if (user.profile.joinedDate) {
        user.profile.joinedDate = new Date(user.profile.joinedDate);
      }
      if (user.profile.lastLogin) {
        user.profile.lastLogin = new Date(user.profile.lastLogin);
      }
    }
  }

  // Save tokens to secure storage
  private async saveTokens(authResponse: AuthResponse): Promise<void> {
    await TokenStorage.saveToken(authResponse.token);
    await TokenStorage.saveRefreshToken(authResponse.refreshToken);
    await TokenStorage.saveUserData(authResponse.user);
  }
}

export const realAuthService = new AuthService();
