import { ApiService } from './api';
import { TokenStorage } from './tokenStorage';

export interface User {
  email: string;
  profile: {
    level: number;
    maxLevel: number;
    experiencePoints: number;
  };
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

export class AuthService {
  private api: ApiService;

  constructor() {
    this.api = new ApiService();
  }

  async register(email: string, password: string): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>('/auth/register', {
      email,
      password,
    });

    await this.saveTokens(response);

    return response;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>('/auth/login', {
      email,
      password,
    });

    await this.saveTokens(response);

    return response;
  }

  async logout(): Promise<void> {
    await TokenStorage.clearAuthData();
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const accessToken = await TokenStorage.getAccessToken();
      if (!accessToken) return null;

      const user = await this.api.get<User>('/user');

      return user;
    } catch (error: any) {
      console.error('Error getting current user:', error);

      if (error.response && error.response.status === 401) {
        await TokenStorage.clearAuthData();
      }

      return null;
    }
  }

  async refreshToken(refreshToken: string): Promise<boolean> {
    try {
      const response = await this.api.post<{
        accessToken: string;
        refreshToken: string;
      }>('/auth/refresh', { refreshToken });

      await TokenStorage.saveAccessToken(response.accessToken);
      await TokenStorage.saveRefreshToken(response.refreshToken);

      return true;
    } catch (error: any) {
      console.error('Error refreshing token:', error);
      return false;
    }
  }

  async updateUserProfile(updates: Partial<User['profile']>): Promise<User> {
    const response = await this.api.patch<User>('/user', updates);

    return response;
  }

  private async saveTokens(authResponse: AuthResponse): Promise<void> {
    await TokenStorage.saveAccessToken(authResponse.accessToken);
    await TokenStorage.saveRefreshToken(authResponse.refreshToken);
  }
}

export const realAuthService = new AuthService();
