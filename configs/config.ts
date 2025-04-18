export const Config = {
  apiUrl: process.env.EXPO_PUBLIC_API_URL,
};

export const validateConfig = (): boolean => {
  if (!Config.apiUrl) {
    console.warn('API_URL is not defined in environment variables');
    return false;
  }

  return true;
};

validateConfig();
