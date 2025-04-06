import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { Config } from '../configs/config';
import { TokenStorage } from './tokenStorage';

let refreshTokenFunction: (
  refreshToken: string
) => Promise<boolean> = async () => false;

export function setRefreshTokenFunction(
  fn: (refreshToken: string) => Promise<boolean>
): void {
  refreshTokenFunction = fn;
}

export class ApiService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: Config.apiUrl,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      timeout: 10000,
    });

    this.axiosInstance.interceptors.request.use(
      async (config) => {
        const accessToken = await TokenStorage.getAccessToken();

        if (accessToken && config.headers) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response && error.response.status === 401) {
          const refreshToken = await TokenStorage.getRefreshToken();
          if (refreshToken) {
            const refreshed = await refreshTokenFunction(refreshToken);

            if (refreshed && error.config) {
              return this.axiosInstance(error.config);
            }
          }
        }

        if (error.response) {
          console.error(
            'API Error:',
            error.response.status,
            error.response.data
          );
        } else if (error.request) {
          console.error('Network Error:', error.request);
        } else {
          console.error('Request Error:', error.message);
        }
        return Promise.reject(error);
      }
    );
  }

  private async handleUnauthorized(): Promise<void> {
    await TokenStorage.clearAuthData();
  }

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

  async post<T>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.axiosInstance.post<T>(endpoint, data, config);
    return response.data;
  }

  async put<T>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.axiosInstance.put<T>(endpoint, data, config);
    return response.data;
  }

  async delete<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.delete<T>(endpoint, config);
    return response.data;
  }

  async patch<T>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.axiosInstance.patch<T>(endpoint, data, config);
    return response.data;
  }

  getInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}
