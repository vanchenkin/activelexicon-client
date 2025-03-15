import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { Config } from '../utils/config';
import { TokenStorage } from './tokenStorage';

// Create a function to refresh the token that will be replaced at runtime
let refreshTokenFunction: (
  refreshToken: string
) => Promise<boolean> = async () => false;

// Function to set the refresh token function
export function setRefreshTokenFunction(
  fn: (refreshToken: string) => Promise<boolean>
): void {
  refreshTokenFunction = fn;
}

/**
 * Base API service for making HTTP requests to the backend using Axios
 */
export class ApiService {
  private axiosInstance: AxiosInstance;

  constructor() {
    // Create a new Axios instance with default configuration
    this.axiosInstance = axios.create({
      baseURL: Config.apiUrl,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      timeout: 10000, // 10 seconds timeout
    });

    // Add request interceptor for authentication or other request modifications
    this.axiosInstance.interceptors.request.use(
      async (config) => {
        // Get the token from secure storage
        const token = await TokenStorage.getToken();

        // If token exists, add it to the Authorization header
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor for global error handling and token refresh
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        // Handle 401 Unauthorized errors for token expiration
        if (error.response && error.response.status === 401) {
          // Try to refresh the token
          const refreshToken = await TokenStorage.getRefreshToken();
          if (refreshToken) {
            const refreshed = await refreshTokenFunction(refreshToken);

            if (refreshed && error.config) {
              // Retry the original request with the new token
              return this.axiosInstance(error.config);
            }
          }
        }

        // Handle other errors
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error(
            'API Error:',
            error.response.status,
            error.response.data
          );
        } else if (error.request) {
          // The request was made but no response was received
          console.error('Network Error:', error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('Request Error:', error.message);
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Handle unauthorized errors by clearing authentication data
   */
  private async handleUnauthorized(): Promise<void> {
    // Clear all auth data from secure storage
    await TokenStorage.clearAuthData();

    // Optionally, you could trigger a logout event here
    // Or redirect the user to the login screen
  }

  /**
   * Make a GET request to the API
   * @param endpoint - API endpoint path
   * @param params - Query parameters
   * @param config - Additional Axios request configuration
   * @returns Promise with response data
   */
  async get<T>(
    endpoint: string,
    params?: Record<string, string>,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.axiosInstance.get<T>(endpoint, {
      params,
      ...config,
    });
    return response.data;
  }

  /**
   * Make a POST request to the API
   * @param endpoint - API endpoint path
   * @param data - Request body data
   * @param config - Additional Axios request configuration
   * @returns Promise with response data
   */
  async post<T>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.axiosInstance.post<T>(endpoint, data, config);
    return response.data;
  }

  /**
   * Make a PUT request to the API
   * @param endpoint - API endpoint path
   * @param data - Request body data
   * @param config - Additional Axios request configuration
   * @returns Promise with response data
   */
  async put<T>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.axiosInstance.put<T>(endpoint, data, config);
    return response.data;
  }

  /**
   * Make a DELETE request to the API
   * @param endpoint - API endpoint path
   * @param config - Additional Axios request configuration
   * @returns Promise with response data
   */
  async delete<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.delete<T>(endpoint, config);
    return response.data;
  }

  /**
   * Make a PATCH request to the API
   * @param endpoint - API endpoint path
   * @param data - Request body data
   * @param config - Additional Axios request configuration
   * @returns Promise with response data
   */
  async patch<T>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.axiosInstance.patch<T>(endpoint, data, config);
    return response.data;
  }

  /**
   * Get the Axios instance for custom requests
   * @returns The Axios instance
   */
  getInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}
