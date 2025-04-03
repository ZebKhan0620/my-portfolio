import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { createLogger } from './logging';

const logger = createLogger('ApiClient');

// Create API client with default config
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Types for the API response structure
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  status: number;
}

/**
 * Enhanced API client with better error handling
 */
class EnhancedApiClient {
  /**
   * Make a GET request to the API
   */
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await apiClient.get<ApiResponse<T>>(url, config);
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError<T>(error as AxiosError);
    }
  }

  /**
   * Make a POST request to the API
   */
  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await apiClient.post<ApiResponse<T>>(url, data, config);
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError<T>(error as AxiosError);
    }
  }

  /**
   * Make a PUT request to the API
   */
  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await apiClient.put<ApiResponse<T>>(url, data, config);
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError<T>(error as AxiosError);
    }
  }

  /**
   * Make a DELETE request to the API
   */
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await apiClient.delete<ApiResponse<T>>(url, config);
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError<T>(error as AxiosError);
    }
  }

  /**
   * Handle a successful response
   */
  private handleResponse<T>(response: AxiosResponse<ApiResponse<T>>): ApiResponse<T> {
    const { data } = response;
    
    // Check if the API returned a success flag (our API convention)
    if (data.success === false) {
      logger.warn('API returned success: false', { 
        url: response.config.url,
        message: data.message 
      });
      
      // Even though HTTP status was 200, API indicated an error
      return {
        data: {} as T,
        success: false,
        message: data.message || 'Unknown API error'
      };
    }
    
    // Everything successful
    return data;
  }

  /**
   * Handle an error response
   */
  private handleError<T>(error: AxiosError): ApiResponse<T> {
    const status = error.response?.status || 500;
    const data = error.response?.data as any;
    
    // Log the error with appropriate level based on status
    if (status >= 500) {
      logger.error('API server error', { 
        status,
        url: error.config?.url,
        message: data?.message || error.message
      });
    } else {
      logger.warn('API client error', { 
        status,
        url: error.config?.url,
        message: data?.message || error.message
      });
    }
    
    // Return a structured error response
    return {
      data: {} as T,
      success: false,
      message: 
        data?.message || 
        error.message || 
        (status >= 500 
          ? 'An unexpected server error occurred. Please try again later.' 
          : 'There was an error with your request.')
    };
  }
}

export const enhancedApi = new EnhancedApiClient();
export default apiClient; 