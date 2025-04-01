import axios from 'axios';

// Determine the base URL based on environment
let baseURL = '';

if (typeof window !== 'undefined') {
  // Client-side code
  baseURL = process.env.NEXT_PUBLIC_API_URL || '/api';
} else {
  // Server-side code
  baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api';
}

// Create axios instance with default config
const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 seconds
});

// Request interceptor for adding auth token, etc.
api.interceptors.request.use(
  (config) => {
    // You can add auth headers here if needed in the future
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    
    // Handle specific error status codes
    if (response) {
      if (response.status === 401) {
        console.error('Unauthorized access');
      }
      
      if (response.status === 404) {
        console.error('Resource not found');
      }
      
      if (response.status >= 500) {
        console.error('Server error, please try again later');
      }
    } else {
      console.error('Network error, please check your connection');
    }
    
    return Promise.reject(error);
  }
);

export default api; 