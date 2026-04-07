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

    // Set session start time for timeout tracking
    localStorage.setItem('session_start', Date.now().toString());

    // Set default header for future calls
    api.defaults.headers.common['Authorization'] = `${token_type} ${access_token}`;

    // Start session timeout monitoring
    startSessionTimeout();

    return { success: true, data: response.data };
  } catch (error) {
    console.log('Login error:', error);
    const errorMessage = formatErrorMessage(error);
    return { success: false, error: errorMessage };
  }
};

// Logout function
export const logout = (showMessage = false) => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('token_type');
  localStorage.removeItem('company_info');
  localStorage.removeItem('session_start');
  delete api.defaults.headers.common['Authorization'];

  // Clear session timeout
  if (window.sessionTimeoutTimer) {
    clearTimeout(window.sessionTimeoutTimer);
    window.sessionTimeoutTimer = null;
  }

  // Show session expired message if requested
  if (showMessage) {
    localStorage.setItem('session_expired_message', 'Your session has expired. Please log in again.');
  }

  // Redirect to login
  window.location.hash = '#login';
  window.location.reload();
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

// Session timeout functions
const SESSION_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

export const startSessionTimeout = () => {
  console.log('Starting session timeout for', SESSION_DURATION / 1000 / 60, 'minutes');

  // Clear any existing timeout
  if (window.sessionTimeoutTimer) {
    clearTimeout(window.sessionTimeoutTimer);
    console.log('Cleared existing timeout');
  }

  // Set new timeout for 1 hour
  window.sessionTimeoutTimer = setTimeout(() => {
    console.log('Session timeout triggered - logging out');
    logout(true); // Show session expired message
  }, SESSION_DURATION);

  console.log('Session timeout set with timer ID:', window.sessionTimeoutTimer);
};

export const checkSessionTimeout = () => {
  const sessionStart = localStorage.getItem('session_start');
  if (!sessionStart) {
    console.log('No session start time found');
    return false;
  }

  const currentTime = Date.now();
  const sessionAge = currentTime - parseInt(sessionStart);
  const remainingTime = SESSION_DURATION - sessionAge;

  console.log('Session check - Age:', sessionAge / 1000 / 60, 'minutes, Remaining:', remainingTime / 1000 / 60, 'minutes');

  if (sessionAge >= SESSION_DURATION) {
    console.log('Session expired - logging out');
    logout(true); // Show session expired message
    return true;
  }

  // Reset timeout with remaining time
  if (window.sessionTimeoutTimer) {
    clearTimeout(window.sessionTimeoutTimer);
  }

  window.sessionTimeoutTimer = setTimeout(() => {
    console.log('Session timeout triggered - logging out');
    logout(true);
  }, remainingTime);

  console.log('Session timeout reset with remaining time:', remainingTime / 1000 / 60, 'minutes');

  return false;
};

export const getSessionExpiredMessage = () => {
  const message = localStorage.getItem('session_expired_message');
  localStorage.removeItem('session_expired_message');
  return message;
};

// Submit job requisition
export const submitJobRequisition = async (requisitionData) => {
  try {
    console.log('Submitting job requisition:', requisitionData);

    // Transform the data to match API requirements
    const transformedData = {
      ...requisitionData,
      // Convert question objects to text strings for API
      technicalInterviewQuestions: Array.isArray(requisitionData.technicalInterviewQuestions)
        ? requisitionData.technicalInterviewQuestions.map(q =>
          typeof q === 'string' ? q : q.text || String(q)
        ).filter(q => q && q.trim())
        : [],
      hrInterviewQuestions: Array.isArray(requisitionData.hrInterviewQuestions)
        ? requisitionData.hrInterviewQuestions.map(q =>
          typeof q === 'string' ? q : q.text || String(q)
        ).filter(q => q && q.trim())
        : [],
      // Ensure assessmentQuestions are also strings
      assessmentQuestions: Array.isArray(requisitionData.assessmentQuestions)
        ? requisitionData.assessmentQuestions.map(q =>
          typeof q === 'string' ? q : q.text || String(q)
        ).filter(q => q && q.trim())
        : [],
      // Ensure templateTask is null if empty (as per API spec)
      templateTask: requisitionData.templateTask || null,
    };

    console.log('Transformed data for API:', transformedData);

    // Create a new axios instance for requisitions API
    const requisitionsApi = axios.create({
      baseURL: 'http://127.0.0.1:8000/api/v1',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add auth token
    const token = localStorage.getItem('access_token');
    const tokenType = localStorage.getItem('token_type') || 'Bearer';
    if (token) {
      requisitionsApi.defaults.headers.common['Authorization'] = `${tokenType} ${token}`;
    }

    const response = await requisitionsApi.post('/requisitions/full', transformedData);
    console.log('Job requisition response:', response.data);

    return { success: true, data: response.data };
  } catch (error) {
    console.log('Job requisition submission error:', error);
    const errorMessage = formatErrorMessage(error);
    return { success: false, error: errorMessage };
  }
};

export default api;
