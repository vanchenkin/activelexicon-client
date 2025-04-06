import { TokenStorage } from '../tokenStorage';
import { ApiService } from './api';

export interface User {
  email: string;
  profile: {
    level: number;
    maxLevel: number;
    experiencePoints: number;
    avatarId: number;
    languageLevel: string;
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

  async register(
    email: string,
    password: string,
    languageLevel: string
  ): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>('/auth/register', {
      email,
      password,
      languageLevel,
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

  async refreshToken(refreshToken: string): Promise<boolean> {
    try {
      const response = await this.api.post<{
        accessToken: string;
        refreshToken: string;
      }>('/auth/refresh', { refreshToken });

      await this.saveTokens(response);

      return true;
    } catch (error: any) {
      console.error('Error refreshing token:', error);
      return false;
    }
  }

  private async saveTokens(authResponse: AuthResponse): Promise<void> {
    await TokenStorage.saveAccessToken(authResponse.accessToken);
    await TokenStorage.saveRefreshToken(authResponse.refreshToken);
  }
}

export const realAuthService = new AuthService();
