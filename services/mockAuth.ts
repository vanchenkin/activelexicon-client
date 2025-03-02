// Mock user data store
import { TokenStorage } from './tokenStorage';
import { v4 as uuidv4 } from 'uuid';

export interface User {
  id: string;
  email: string;
  password: string;
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

// In-memory user database
const users: User[] = [
  {
    id: '1',
    email: 'test@example.com',
    password: 'password123',
    profile: {
      level: 26,
      maxLevel: 27,
      experiencePoints: 2680,
      joinedDate: new Date('2023-01-15'),
      lastLogin: new Date(),
    },
  },
];

// In-memory token storage
interface TokenData {
  userId: string;
  token: string;
  refreshToken: string;
  expires: Date;
}

const tokens: TokenData[] = [];

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class MockAuthService {
  // Register a new user
  async register(email: string, password: string): Promise<AuthResponse> {
    // Simulate network delay
    await delay(800);

    // Check if user already exists
    if (users.find((user) => user.email === email)) {
      throw new Error('User already exists');
    }

    // Create new user
    const newUser: User = {
      id: uuidv4(),
      email,
      password,
      profile: {
        level: 1,
        maxLevel: 27,
        experiencePoints: 0,
        joinedDate: new Date(),
        lastLogin: new Date(),
      },
    };

    // Add to "database"
    users.push(newUser);

    // Generate tokens
    const authResponse = this.generateTokens(newUser);

    // TODO: fix
    // // Store tokens securely
    // await this.saveTokens(authResponse);

    return authResponse;
  }

  // Login user
  async login(email: string, password: string): Promise<AuthResponse> {
    // Simulate network delay
    await delay(800);

    // Find user
    const user = users.find((u) => u.email === email);

    // Check if user exists and password matches
    if (!user || user.password !== password) {
      throw new Error('Invalid email or password');
    }

    // Update last login
    user.profile.lastLogin = new Date();

    // Generate tokens
    const authResponse = this.generateTokens(user);

    // Store tokens securely
    // await this.saveTokens(authResponse);

    return authResponse;
  }

  // Logout user
  async logout(): Promise<void> {
    // Simulate network delay
    await delay(300);

    // Clear stored tokens
    await TokenStorage.clearAuthData();

    // Remove token from in-memory database
    const currentToken = await TokenStorage.getToken();
    if (currentToken) {
      const tokenIndex = tokens.findIndex((t) => t.token === currentToken);
      if (tokenIndex >= 0) {
        tokens.splice(tokenIndex, 1);
      }
    }
  }

  // Get current user using token
  async getCurrentUser(): Promise<User | null> {
    // Get token from secure storage
    const token = await TokenStorage.getToken();
    if (!token) return null;

    // Find token in database
    const tokenData = tokens.find((t) => t.token === token);
    if (!tokenData) return null;

    // Check if token is expired
    if (new Date() > tokenData.expires) {
      // Try to refresh the token
      const refreshToken = await TokenStorage.getRefreshToken();
      if (!refreshToken) {
        await TokenStorage.clearAuthData();
        return null;
      }

      const refreshed = await this.refreshToken(refreshToken);
      if (!refreshed) {
        await TokenStorage.clearAuthData();
        return null;
      }

      // Get updated token data
      const newTokenData = tokens.find((t) => t.refreshToken === refreshToken);
      if (!newTokenData) {
        await TokenStorage.clearAuthData();
        return null;
      }

      // Find user with the updated token
      const user = users.find((u) => u.id === newTokenData.userId);
      if (!user) {
        await TokenStorage.clearAuthData();
        return null;
      }

      return this.getPublicUserData(user);
    }

    // Find user with token
    const user = users.find((u) => u.id === tokenData.userId);
    if (!user) {
      await TokenStorage.clearAuthData();
      return null;
    }

    return this.getPublicUserData(user);
  }

  // Refresh token
  async refreshToken(refreshToken: string): Promise<boolean> {
    // Simulate network delay
    await delay(500);

    // Find token in database
    const tokenData = tokens.find((t) => t.refreshToken === refreshToken);
    if (!tokenData) return false;

    // Find user
    const user = users.find((u) => u.id === tokenData.userId);
    if (!user) return false;

    // Generate new tokens
    const authResponse = this.generateTokens(user);

    // Remove old token
    const tokenIndex = tokens.findIndex((t) => t.refreshToken === refreshToken);
    if (tokenIndex >= 0) {
      tokens.splice(tokenIndex, 1);
    }

    // Save new tokens
    await this.saveTokens(authResponse);

    return true;
  }

  // Update user profile
  async updateUserProfile(updates: Partial<User['profile']>): Promise<User> {
    await delay(500);

    // Get current user
    const user = await this.getCurrentUser();
    if (!user) {
      throw new Error('Not authenticated');
    }

    // Find original user
    const originalUser = users.find((u) => u.id === user.id);
    if (!originalUser) {
      throw new Error('User not found');
    }

    // Update profile
    originalUser.profile = {
      ...originalUser.profile,
      ...updates,
    };

    return this.getPublicUserData(originalUser);
  }

  // Helper to omit sensitive information (like password)
  private getPublicUserData(user: User): User {
    const { password, ...publicUser } = user;
    return { ...publicUser, password: '' } as User;
  }

  // Generate authentication tokens
  private generateTokens(user: User): AuthResponse {
    const token = uuidv4();
    const refreshToken = uuidv4();

    // Token expires in 1 hour
    const expires = new Date();
    expires.setHours(expires.getHours() + 1);

    // Add to tokens database
    tokens.push({
      userId: user.id,
      token,
      refreshToken,
      expires,
    });

    return {
      user: this.getPublicUserData(user),
      token,
      refreshToken,
    };
  }

  // Save tokens to secure storage
  private async saveTokens(authResponse: AuthResponse): Promise<void> {
    await TokenStorage.saveToken(authResponse.token);
    await TokenStorage.saveRefreshToken(authResponse.refreshToken);
    await TokenStorage.saveUserData(authResponse.user);
  }
}

// Create and export a singleton instance
export const mockAuthService = new MockAuthService();
