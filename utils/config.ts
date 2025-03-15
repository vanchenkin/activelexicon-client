export const Config = {
  apiUrl: process.env.API_URL || 'https://api.example.com',

  googleClientId: process.env.GOOGLE_CLIENT_ID || '',
  googleAndroidClientId: process.env.GOOGLE_ANDROID_CLIENT_ID || '',
  googleIosClientId: process.env.GOOGLE_IOS_CLIENT_ID || '',
};

export const validateConfig = (): boolean => {
  if (!Config.apiUrl) {
    console.warn('API_URL is not defined in environment variables');
    return false;
  }

  return true;
};

validateConfig();
