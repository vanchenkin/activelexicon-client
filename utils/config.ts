import {
  API_URL,
  GOOGLE_CLIENT_ID,
  GOOGLE_ANDROID_CLIENT_ID,
  GOOGLE_IOS_CLIENT_ID,
} from '@env';

// Default values as fallbacks
const DEFAULT_API_URL = 'https://api.example.com';

// Configuration object with environment variables and fallbacks
export const Config = {
  // API
  apiUrl: API_URL || DEFAULT_API_URL,

  // Google Authentication
  googleClientId: GOOGLE_CLIENT_ID || '',
  googleAndroidClientId: GOOGLE_ANDROID_CLIENT_ID || '',
  googleIosClientId: GOOGLE_IOS_CLIENT_ID || '',
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
