// Mock user data store
import { TokenStorage } from './tokenStorage';
import { v4 as uuidv4 } from 'uuid';
import { User, AuthResponse } from './authService';

// Type augmentation to add password to User type for mock purposes only
interface MockUser extends User {
  password: string;
}

// In-memory user database
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

// Helper function to find a token in our in-memory database
const findTokenInMemory = (token: string): TokenData | undefined => {
  return tokens.find((t) => t.token === token);
};

// Helper function to find a token by refresh token
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
    // Initialize by loading any stored tokens into memory
    this.initializeFromStorage();
  }

  // Initialize the service by loading any stored tokens into memory
  private async initializeFromStorage(): Promise<void> {
    try {
      // Get stored token and refreshToken
      const token = await TokenStorage.getToken();
      const refreshToken = await TokenStorage.getRefreshToken();
      const userData = await TokenStorage.getUserData<User>();

      if (token && refreshToken && userData) {
        // Check if the token is already in memory
        const existingToken = findTokenInMemory(token);
        if (!existingToken) {
          // Create a new token entry in memory
          const expires = new Date();
          expires.setHours(expires.getHours() + 1); // Set to expire in 1 hour

          tokens.push({
            userId: userData.id,
            token,
            refreshToken,
            expires,
          });

          // Ensure user exists in our database
          if (!users.find((u) => u.id === userData.id)) {
            // Add a fake password since we don't have the real one
            const userWithPassword = {
              ...userData,
              password: 'restored-from-storage',
            };
            users.push(userWithPassword);
          }
        }
      }
    } catch (error) {
      // Error initializing from storage - silently fail
    }
  }

  // Register a new user
  async register(email: string, password: string): Promise<AuthResponse> {
    await delay(600); // Simulate network delay

    // Create a new user
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

    // Generate tokens for the new user
    const authResponse = this.generateTokens(newUser);

    // Save tokens
    await this.saveTokens(authResponse);

    return authResponse;
  }

  // Login user
  async login(email: string, password: string): Promise<AuthResponse> {
    await delay(800); // Simulate network delay

    // Find the user
    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Update last login
    user.profile.lastLogin = new Date();

    // Generate tokens
    const authResponse = this.generateTokens(user);

    // Save tokens
    await this.saveTokens(authResponse);

    return authResponse;
  }

  // Logout user
  async logout(): Promise<void> {
    await TokenStorage.clearAuthData();
  }

  // Ping with authentication
  async pingAuth(ping?: string): Promise<{ pong: string }> {
    return {
      pong: ping || 'auth-pong',
    };
  }

  // Refresh token
  async refreshToken(refreshToken: string): Promise<boolean> {
    // Always return success in mock
    await TokenStorage.saveToken(this.mockToken);
    return true;
  }

  // Get current user using token
  async getCurrentUser(): Promise<User | null> {
    // Get token from secure storage
    const token = await TokenStorage.getToken();

    if (!token) {
      return null;
    }

    // Find token in database
    const tokenData = findTokenInMemory(token);
    if (!tokenData) {
      // Try to restore the session from storage
      await this.initializeFromStorage();

      // Check again after initialization
      const restoredToken = findTokenInMemory(token);
      if (!restoredToken) {
        return null;
      }

      return this.handleTokenData(restoredToken);
    }

    return this.handleTokenData(tokenData);
  }

  // Helper method to handle token data and token refresh if needed
  private async handleTokenData(tokenData: TokenData): Promise<User | null> {
    // Check if token is expired
    if (new Date() > tokenData.expires) {
      // Try to refresh the token
      const refreshed = await this.refreshToken(tokenData.refreshToken);
      if (!refreshed) {
        await TokenStorage.clearAuthData();
        return null;
      }

      // Get updated token data after refresh
      const newTokenData = findTokenByRefreshToken(tokenData.refreshToken);
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

  // Login with Google (mock implementation)
  async loginWithGoogle(token: string): Promise<AuthResponse> {
    // Simulate network delay
    await delay(800);

    // Create or find a mock Google user
    let user = users.find((u) => u.email === 'google-user@example.com');

    if (!user) {
      // Create new user
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

      // Add to "database"
      users.push(user);
    }

    // Ensure user exists at this point
    if (!user) {
      throw new Error('Failed to create or find Google user');
    }

    // Update last login
    user.profile.lastLogin = new Date();

    // Generate tokens
    const authResponse = this.generateTokens(user);

    // Store tokens securely
    await this.saveTokens(authResponse);

    return authResponse;
  }

  // Helper to omit sensitive information (like password)
  private getPublicUserData(user: MockUser): User {
    // Destructure to remove password and create a clean user object
    const { password, ...publicUser } = user;
    return publicUser;
  }

  // Generate tokens for a user
  private generateTokens(user: MockUser): AuthResponse {
    const token = `mock-token-${user.id}-${Date.now()}`;
    const refreshToken = `mock-refresh-${user.id}-${Date.now()}`;

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
