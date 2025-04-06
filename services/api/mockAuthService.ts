import { TokenStorage } from '../tokenStorage';
import uuid from 'react-native-uuid';
import { User, AuthResponse } from './authService';

interface ExtendedUser extends User {
  id: string;
}

interface MockUser extends ExtendedUser {
  password: string;
  profile: {
    level: number;
    maxLevel: number;
    experiencePoints: number;
    lastLogin?: Date;
    joinedDate?: Date;
  };
}

const users: MockUser[] = [
  {
    id: '1',
    email: '123',
    password: '123',
    profile: {
      level: 26,
      maxLevel: 27,
      experiencePoints: 2680,
    },
  },
];

interface TokenData {
  userId: string;
  accessToken: string;
  refreshToken: string;
  expires: Date;
}

const tokens: TokenData[] = [];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const findTokenInMemory = (accessToken: string): TokenData | undefined => {
  return tokens.find((t) => t.accessToken === accessToken);
};

const findTokenByRefreshToken = (
  refreshToken: string
): TokenData | undefined => {
  return tokens.find((t) => t.refreshToken === refreshToken);
};

class MockAuthService {
  private mockAccessToken = 'mock-jwt-token';

  constructor() {
    this.initializeFromStorage();
  }

  private async initializeFromStorage(): Promise<void> {
    try {
      const accessToken = await TokenStorage.getAccessToken();
      const refreshToken = await TokenStorage.getRefreshToken();
      const userData = await TokenStorage.getUserData<ExtendedUser>();

      if (accessToken && refreshToken && userData) {
        const existingToken = findTokenInMemory(accessToken);
        if (!existingToken) {
          const expires = new Date();
          expires.setHours(expires.getHours() + 1);

          tokens.push({
            userId: userData.id,
            accessToken,
            refreshToken,
            expires,
          });

          if (!users.find((u) => u.id === userData.id)) {
            const userWithPassword = {
              ...userData,
              password: 'restored-from-storage',
            };
            users.push(userWithPassword as MockUser);
          }
        }
      }
    } catch (error) {
      console.error('Error initializing from storage:', error);
    }
  }

  async register(email: string, password: string): Promise<AuthResponse> {
    await delay(600);

    const newUser: MockUser = {
      id: String(uuid.v4()),
      email,
      password,
      profile: {
        level: 2,
        maxLevel: 10,
        experiencePoints: 2680,
      },
    };

    users.push(newUser);

    const authResponse = this.generateTokens(newUser);

    await this.saveTokens(authResponse);

    return authResponse;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    await delay(800);

    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      throw new Error('Invalid credentials');
    }

    if (user.profile) {
      user.profile.lastLogin = new Date();
    }

    const authResponse = this.generateTokens(user);

    await this.saveTokens(authResponse);

    return authResponse;
  }

  async logout(): Promise<void> {
    await TokenStorage.clearAuthData();
  }

  async pingAuth(ping?: string): Promise<{ pong: string }> {
    return {
      pong: ping || 'auth-pong',
    };
  }

  async refreshToken(refreshToken: string): Promise<boolean> {
    await TokenStorage.saveAccessToken(this.mockAccessToken);
    return true;
  }

  async getCurrentUser(): Promise<ExtendedUser | null> {
    const accessToken = await TokenStorage.getAccessToken();

    if (!accessToken) {
      return null;
    }

    const tokenData = findTokenInMemory(accessToken);
    if (!tokenData) {
      await this.initializeFromStorage();

      const restoredToken = findTokenInMemory(accessToken);
      if (!restoredToken) {
        return null;
      }

      return this.handleTokenData(restoredToken);
    }

    return this.handleTokenData(tokenData);
  }

  private async handleTokenData(
    tokenData: TokenData
  ): Promise<ExtendedUser | null> {
    if (new Date() > tokenData.expires) {
      const refreshed = await this.refreshToken(tokenData.refreshToken);
      if (!refreshed) {
        await TokenStorage.clearAuthData();
        return null;
      }

      const newTokenData = findTokenByRefreshToken(tokenData.refreshToken);
      if (!newTokenData) {
        await TokenStorage.clearAuthData();
        return null;
      }

      const user = users.find((u) => u.id === newTokenData.userId);
      if (!user) {
        await TokenStorage.clearAuthData();
        return null;
      }

      return this.getPublicUserData(user);
    }

    const user = users.find((u) => u.id === tokenData.userId);
    if (!user) {
      await TokenStorage.clearAuthData();
      return null;
    }

    return this.getPublicUserData(user);
  }

  async updateUserProfile(
    updates: Partial<User['profile']>
  ): Promise<ExtendedUser> {
    await delay(500);

    const user = await this.getCurrentUser();
    if (!user) {
      throw new Error('Not authenticated');
    }

    const originalUser = users.find((u) => u.id === user.id);
    if (!originalUser) {
      throw new Error('User not found');
    }

    originalUser.profile = {
      ...originalUser.profile,
      ...updates,
    };

    return this.getPublicUserData(originalUser);
  }

  async loginWithGoogle(token: string): Promise<AuthResponse> {
    await delay(800);

    let user = users.find((u) => u.email === 'google-user@example.com');

    if (!user) {
      user = {
        id: String(uuid.v4()),
        email: 'google-user@example.com',
        password: 'google-password',
        profile: {
          level: 5,
          maxLevel: 27,
          experiencePoints: 450,
          joinedDate: new Date(),
          lastLogin: new Date(),
        },
      };

      users.push(user);
    }

    if (user && user.profile) {
      user.profile.lastLogin = new Date();
    }

    const authResponse = this.generateTokens(user);

    await this.saveTokens(authResponse);

    return authResponse;
  }

  private getPublicUserData(user: MockUser): ExtendedUser {
    const { password, ...publicUser } = user;
    return publicUser as ExtendedUser;
  }

  private generateTokens(
    user: MockUser
  ): AuthResponse & { user: ExtendedUser } {
    const accessToken = `mock-token-${user.id}-${Date.now()}`;
    const refreshToken = `mock-refresh-${user.id}-${Date.now()}`;

    return {
      user: this.getPublicUserData(user),
      accessToken,
      refreshToken,
    };
  }

  private async saveTokens(
    authResponse: AuthResponse & { user: ExtendedUser }
  ): Promise<void> {
    await TokenStorage.saveAccessToken(authResponse.accessToken);
    await TokenStorage.saveRefreshToken(authResponse.refreshToken);
    await TokenStorage.saveUserData(authResponse.user);
  }
}

export const mockAuthService = new MockAuthService();
