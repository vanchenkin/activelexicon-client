// Mock user data store
interface User {
  id: string;
  email: string;
  password: string;
}

// In-memory user database
const users: User[] = [
  {
    id: '1',
    email: 'test@example.com',
    password: 'password123'
  }
];

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class MockAuthService {
  // Current authenticated user
  private currentUser: User | null = null;

  // Register a new user
  async register(email: string, password: string): Promise<User> {
    // Simulate network delay
    await delay(800);
    
    // Check if user already exists
    if (users.find(user => user.email === email)) {
      throw new Error('User already exists');
    }
    
    // Create new user
    const newUser: User = {
      id: String(users.length + 1),
      email,
      password
    };
    
    // Add to "database"
    users.push(newUser);
    
    // Set as current user
    this.currentUser = newUser;
    
    return newUser;
  }

  // Login user
  async login(email: string, password: string): Promise<User> {
    // Simulate network delay
    await delay(800);
    
    // Find user
    const user = users.find(u => u.email === email);
    
    // Check if user exists and password matches
    if (!user || user.password !== password) {
      throw new Error('Invalid email or password');
    }
    
    // Set as current user
    this.currentUser = user;
    
    return user;
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
    return this.currentUser;
  }
}

// Create and export a singleton instance
export const mockAuthService = new MockAuthService(); 