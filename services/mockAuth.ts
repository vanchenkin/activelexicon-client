// Mock user data store
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

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class MockAuthService {
  // Current authenticated user
  private currentUser: User | null = null;

  // Register a new user
  async register(email: string, password: string): Promise<User> {
    // Simulate network delay
    await delay(800);

    // Check if user already exists
    if (users.find((user) => user.email === email)) {
      throw new Error('User already exists');
    }

    // Create new user
    const newUser: User = {
      id: String(users.length + 1),
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

    // Set as current user
    this.currentUser = newUser;

    return this.getPublicUserData(newUser);
  }

  // Login user
  async login(email: string, password: string): Promise<User> {
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

    // Set as current user
    this.currentUser = user;

    return this.getPublicUserData(user);
  }

  // Logout user
  async logout(): Promise<void> {
    // Simulate network delay
    await delay(300);

    // Clear current user
    this.currentUser = null;
  }

  // Get current user
  getCurrentUser(): User | null {
    if (!this.currentUser) return null;
    return this.getPublicUserData(this.currentUser);
  }

  // Update user profile
  async updateUserProfile(updates: Partial<User['profile']>): Promise<User> {
    await delay(500);

    if (!this.currentUser) {
      throw new Error('Not authenticated');
    }

    // Update profile
    this.currentUser.profile = {
      ...this.currentUser.profile,
      ...updates,
    };

    // Find and update user in database
    const userIndex = users.findIndex((u) => u.id === this.currentUser!.id);
    if (userIndex >= 0) {
      users[userIndex] = this.currentUser;
    }

    return this.getPublicUserData(this.currentUser);
  }

  // Update user experience (when completing exercises)
  async addExperience(points: number): Promise<User> {
    await delay(400);

    if (!this.currentUser) {
      throw new Error('Not authenticated');
    }

    // Add experience points
    this.currentUser.profile.experiencePoints += points;

    // Check if level up (simple logic: 100 XP per level)
    const newLevel =
      Math.floor(this.currentUser.profile.experiencePoints / 100) + 1;
    if (newLevel > this.currentUser.profile.level) {
      this.currentUser.profile.level = Math.min(
        newLevel,
        this.currentUser.profile.maxLevel
      );
    }

    // Find and update user in database
    const userIndex = users.findIndex((u) => u.id === this.currentUser!.id);
    if (userIndex >= 0) {
      users[userIndex] = this.currentUser;
    }

    return this.getPublicUserData(this.currentUser);
  }

  // Helper to omit sensitive information (like password)
  private getPublicUserData(user: User): User {
    const { password, ...publicUser } = user;
    return { ...publicUser, password: '' } as User;
  }
}

// Create and export a singleton instance
export const mockAuthService = new MockAuthService();
