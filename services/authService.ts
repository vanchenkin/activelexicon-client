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

  async register(email: string, password: string): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>('/auth/register', {
      email,
      password,
    });

    await this.saveTokens(response);

    this.parseUserDates(response.user);

    return response;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>('/auth/login', {
      email,
      password,
    });

    await this.saveTokens(response);

    this.parseUserDates(response.user);

    return response;
  }

  async logout(): Promise<void> {
    await TokenStorage.clearAuthData();
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const token = await TokenStorage.getToken();
      if (!token) return null;

      const user = await this.api.get<User>('/user');

      this.parseUserDates(user);

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
        token: string;
        refreshToken: string;
      }>('/auth/refresh', { refreshToken });

      await TokenStorage.saveToken(response.token);
      await TokenStorage.saveRefreshToken(response.refreshToken);

      return true;
    } catch (error: any) {
      console.error('Error refreshing token:', error);
      return false;
    }
  }

  async updateUserProfile(updates: Partial<User['profile']>): Promise<User> {
    const response = await this.api.patch<User>('/user', updates);

    this.parseUserDates(response);

    return response;
  }

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

  private async saveTokens(authResponse: AuthResponse): Promise<void> {
    await TokenStorage.saveToken(authResponse.token);
    await TokenStorage.saveRefreshToken(authResponse.refreshToken);
    await TokenStorage.saveUserData(authResponse.user);
  }
}

export const realAuthService = new AuthService();
