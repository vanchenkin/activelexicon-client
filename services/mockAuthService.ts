import { TokenStorage } from './tokenStorage';
import { v4 as uuidv4 } from 'uuid';
import { User, AuthResponse } from './authService';

interface MockUser extends User {
  password: string;
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
      joinedDate: new Date('2023-01-15'),
      lastLogin: new Date(),
    },
  },
];

interface TokenData {
  userId: string;
  token: string;
  refreshToken: string;
  expires: Date;
}

const tokens: TokenData[] = [];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const findTokenInMemory = (token: string): TokenData | undefined => {
  return tokens.find((t) => t.token === token);
};

const findTokenByRefreshToken = (
  refreshToken: string
): TokenData | undefined => {
  return tokens.find((t) => t.refreshToken === refreshToken);
};

class MockAuthService {
  private mockUser: MockUser = {
    id: 'mock-user-id',
    email: 'mock@example.com',
    password: 'mock-password',
    profile: {
      level: 1,
      maxLevel: 10,
      experiencePoints: 0,
      joinedDate: new Date(),
      lastLogin: new Date(),
    },
  };

  private mockToken = 'mock-jwt-token';

  constructor() {
    this.initializeFromStorage();
  }

  private async initializeFromStorage(): Promise<void> {
    try {
      const token = await TokenStorage.getToken();
      const refreshToken = await TokenStorage.getRefreshToken();
      const userData = await TokenStorage.getUserData<User>();

      if (token && refreshToken && userData) {
        const existingToken = findTokenInMemory(token);
        if (!existingToken) {
          const expires = new Date();
          expires.setHours(expires.getHours() + 1);

          tokens.push({
            userId: userData.id,
            token,
            refreshToken,
            expires,
          });

          if (!users.find((u) => u.id === userData.id)) {
            const userWithPassword = {
              ...userData,
              password: 'restored-from-storage',
            };
            users.push(userWithPassword);
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
      id: uuidv4(),
      email,
      password,
      profile: {
        level: 1,
        maxLevel: 10,
        experiencePoints: 0,
        joinedDate: new Date(),
        lastLogin: new Date(),
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

    user.profile.lastLogin = new Date();

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
    await TokenStorage.saveToken(this.mockToken);
    return true;
  }

  async getCurrentUser(): Promise<User | null> {
    const token = await TokenStorage.getToken();

    if (!token) {
      return null;
    }

    const tokenData = findTokenInMemory(token);
    if (!tokenData) {
      await this.initializeFromStorage();

      const restoredToken = findTokenInMemory(token);
      if (!restoredToken) {
        return null;
      }

      return this.handleTokenData(restoredToken);
    }

    return this.handleTokenData(tokenData);
  }

  private async handleTokenData(tokenData: TokenData): Promise<User | null> {
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

  async updateUserProfile(updates: Partial<User['profile']>): Promise<User> {
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
        id: uuidv4(),
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

    if (!user) {
      throw new Error('Failed to create or find Google user');
    }

    user.profile.lastLogin = new Date();

    const authResponse = this.generateTokens(user);

    await this.saveTokens(authResponse);

    return authResponse;
  }

  private getPublicUserData(user: MockUser): User {
    const { password, ...publicUser } = user;
    return publicUser;
  }

  private generateTokens(user: MockUser): AuthResponse {
    const token = `mock-token-${user.id}-${Date.now()}`;
    const refreshToken = `mock-refresh-${user.id}-${Date.now()}`;

    return {
      user: this.getPublicUserData(user),
      token,
      refreshToken,
    };
  }

  private async saveTokens(authResponse: AuthResponse): Promise<void> {
    await TokenStorage.saveToken(authResponse.token);
    await TokenStorage.saveRefreshToken(authResponse.refreshToken);
    await TokenStorage.saveUserData(authResponse.user);
  }
}

export const mockAuthService = new MockAuthService();
