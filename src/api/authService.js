import axios from 'axios';

// Create Axios instance with base URL
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/v1/auth',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    const tokenType = localStorage.getItem('token_type') || 'Bearer';
    if (token) {
      config.headers.Authorization = `${tokenType} ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

// Format error message from backend
const formatErrorMessage = (error) => {
  console.log('Full error object:', error);
  console.log('Error response:', error.response);
  console.log('Error response data:', error.response?.data);

  if (error.response?.data?.detail) {
    const detail = error.response.data.detail;
    if (Array.isArray(detail)) {
      // Handle Pydantic validation errors
      return detail.map(err => err.msg || err).join(', ');
    }
    return detail;
  }

  // Check for other common error formats
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  if (error.response?.data?.error) {
    return error.response.data.error;
  }

  // Return status code with generic message
  if (error.response?.status) {
    return `Request failed with status ${error.response.status}: ${error.response.statusText || 'Unknown error'}`;
  }

  return 'An unexpected error occurred. Please try again.';
};

// Signup function
export const signup = async (userData) => {
  try {
    console.log('Sending signup data:', userData);
    const response = await api.post('/signup', userData);
    console.log('Signup response:', response.data);

    // Store token and company data (assuming same response structure as login)
    const { access_token, token_type, company } = response.data;
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('token_type', token_type);
    localStorage.setItem('company_info', JSON.stringify(company));

    // Set default header for future calls
    api.defaults.headers.common['Authorization'] = `${token_type} ${access_token}`;

    return { success: true, data: response.data };
  } catch (error) {
    console.log('Signup error:', error);
    const errorMessage = formatErrorMessage(error);
    return { success: false, error: errorMessage };
  }
};

// Login function
export const login = async (credentials) => {
  try {
    console.log('Sending login data:', credentials);
    const response = await api.post('/login', credentials);
    console.log('Login response:', response.data);

    // Store token and company data
    const { access_token, token_type, company } = response.data;
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('token_type', token_type);
    localStorage.setItem('company_info', JSON.stringify(company));

    // Set default header for future calls
    api.defaults.headers.common['Authorization'] = `${token_type} ${access_token}`;

    return { success: true, data: response.data };
  } catch (error) {
    console.log('Login error:', error);
    const errorMessage = formatErrorMessage(error);
    return { success: false, error: errorMessage };
  }
};

// Logout function
export const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('token_type');
  localStorage.removeItem('company_info');
  delete api.defaults.headers.common['Authorization'];
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem('access_token');
  return !!token;
};

// Get company info
export const getCompanyInfo = () => {
  const companyInfo = localStorage.getItem('company_info');
  return companyInfo ? JSON.parse(companyInfo) : null;
};

export default api;
