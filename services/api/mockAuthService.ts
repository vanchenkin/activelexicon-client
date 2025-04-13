import { TokenStorage } from '../tokenStorage';
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
    languageLevel: string;
    calculatedLanguageLevel?: string;
    avatarId: number;
  };
}

const generateRandomId = (): string => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

const users: MockUser[] = [
  {
    id: '1',
    email: '123',
    password: '123',
    profile: {
      level: 26,
      maxLevel: 27,
      experiencePoints: 2680,
      languageLevel: 'B2',
      calculatedLanguageLevel: 'C1',
      avatarId: 3,
    },
  },
  {
    id: '2',
    email: 'beginner@example.com',
    password: 'beginner123',
    profile: {
      level: 5,
      maxLevel: 10,
      experiencePoints: 450,
      languageLevel: 'A1',
      calculatedLanguageLevel: 'A2',
      avatarId: 1,
    },
  },
  {
    id: '3',
    email: 'advanced@example.com',
    password: 'advanced123',
    profile: {
      level: 42,
      maxLevel: 50,
      experiencePoints: 4200,
      languageLevel: 'C1',
      calculatedLanguageLevel: 'C1',
      avatarId: 5,
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
      const userData = await this.getUserData<ExtendedUser>();

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

  async register(
    email: string,
    password: string,
    languageLevel: string
  ): Promise<AuthResponse> {
    await delay(600);

    const randomAvatarId = Math.floor(Math.random() * 11);

    const newUser: MockUser = {
      id: generateRandomId(),
      email,
      password,
      profile: {
        level: 2,
        maxLevel: 10,
        experiencePoints: 200,
        languageLevel,
        calculatedLanguageLevel: 'A1',
        avatarId: randomAvatarId,
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

    const authResponse = this.generateTokens(user);

    await this.saveTokens(authResponse);

    return authResponse;
  }

  async logout(): Promise<void> {
    await TokenStorage.clearAuthData();
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

  async loginWithGoogle(token: string): Promise<AuthResponse> {
    await delay(800);

    let user = users.find((u) => u.email === 'google-user@example.com');

    if (!user) {
      user = {
        id: generateRandomId(),
        email: 'google-user@example.com',
        password: 'google-password',
        profile: {
          level: 15,
          maxLevel: 27,
          experiencePoints: 1450,
          languageLevel: 'B1',
          calculatedLanguageLevel: 'B2',
          avatarId: 7,
        },
      };

      users.push(user);
    }

    const authResponse = this.generateTokens(user);

    await this.saveTokens(authResponse);

    return authResponse;
  }

  private getPublicUserData(user: MockUser): ExtendedUser {
    const { password, ...publicUser } = user;
    return publicUser as ExtendedUser;
  }

  private generateTokens(user: MockUser): AuthResponse {
    const accessToken = `mock-token-${user.id}-${Date.now()}`;
    const refreshToken = `mock-refresh-${user.id}-${Date.now()}`;

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  private async saveTokens(authResponse: AuthResponse): Promise<void> {
    await TokenStorage.saveAccessToken(authResponse.access_token);
    await TokenStorage.saveRefreshToken(authResponse.refresh_token);
  }

  private async getUserData<T>(): Promise<T | null> {
    try {
      const accessToken = await TokenStorage.getAccessToken();
      if (!accessToken) return null;

      const tokenData = findTokenInMemory(accessToken);
      if (tokenData) {
        const user = users.find((u) => u.id === tokenData.userId);
        if (user) return this.getPublicUserData(user) as unknown as T;
      }

      const tokenParts = accessToken.split('-');
      if (
        tokenParts.length >= 3 &&
        tokenParts[0] === 'mock' &&
        tokenParts[1] === 'token'
      ) {
        const userId = tokenParts[2];
        const user = users.find((u) => u.id === userId);
        if (user) {
          const expires = new Date();
          expires.setHours(expires.getHours() + 1);

          const refreshToken = await TokenStorage.getRefreshToken();
          if (refreshToken) {
            tokens.push({
              userId,
              accessToken,
              refreshToken,
              expires,
            });

            return this.getPublicUserData(user) as unknown as T;
          }
        }
      }

      return null;
    } catch (error) {
      console.error('Error retrieving user data:', error);
      return null;
    }
  }
}

export const mockAuthService = new MockAuthService();
