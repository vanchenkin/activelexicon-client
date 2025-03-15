// Configuration object with environment variables and fallbacks
export const Config = {
  // API
  apiUrl: process.env.API_URL || 'https://api.example.com',

  // Google Authentication
  googleClientId: process.env.GOOGLE_CLIENT_ID || '',
  googleAndroidClientId: process.env.GOOGLE_ANDROID_CLIENT_ID || '',
  googleIosClientId: process.env.GOOGLE_IOS_CLIENT_ID || '',
};

// Helper function to validate the configuration
export const validateConfig = (): boolean => {
  // Add validation logic as needed
  if (!Config.apiUrl) {
    console.warn('API_URL is not defined in environment variables');
    return false;
  }

  return true;
};

// Validate configuration on import
validateConfig();
