import { TokenStorage } from '../tokenStorage';
import { ApiService } from './api';

export interface User {
  email: string;
  profile: {
    avatarId: number;
    languageLevel: string;
    calculatedLanguageLevel?: string;
  };
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
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
      language_level: languageLevel,
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
        access_token: string;
        refresh_token: string;
      }>('/auth/refresh', { refresh_token: refreshToken });

      await this.saveTokens(response);

      return true;
    } catch (error: unknown) {
      console.error('Error refreshing token:', error);
      return false;
    }
  }

  private async saveTokens(authResponse: AuthResponse): Promise<void> {
    await TokenStorage.saveAccessToken(authResponse.access_token);
    await TokenStorage.saveRefreshToken(authResponse.refresh_token);
  }
}

export const realAuthService = new AuthService();
