// Configuration for different environments
const config = {
  development: {
    apiUrl: 'http://localhost:8000',
    wsUrl: 'ws://localhost:8000'
  },
  production: {
    apiUrl: process.env.REACT_APP_API_URL || 'https://your-app.vercel.app',
    wsUrl: process.env.REACT_APP_WS_URL || 'wss://your-app.vercel.app'
  }
};

// Get current environment
const environment = process.env.NODE_ENV || 'development';

// Export the appropriate config
export const API_BASE_URL = config[environment].apiUrl;
export const WS_BASE_URL = config[environment].wsUrl;

// Helper function to get full API URL
export const getApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`;
};

export default config[environment]; 