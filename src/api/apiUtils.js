// API utility functions for field mapping and normalization

// Field mapping between frontend camelCase and backend snake_case
export const fieldMapping = {
  // Frontend to Backend (camelCase -> snake_case)
  toBackend: {
    candidateId: 'candidate_id',
    jobId: 'job_id',
    requisitionId: 'requisition_id',
    companyId: 'company_id',
    recruiterId: 'recruiter_id',
    applicationId: 'application_id',
    assessmentId: 'assessment_id',
    sessionId: 'session_id',
    firstName: 'first_name',
    lastName: 'last_name',
    profilePicture: 'profile_picture',
    website: 'website',
    phoneNumber: 'phone_number',
    jobTitle: 'job_title',
    department: 'department',
    seniorityLevel: 'seniority_level',
    employmentType: 'employment_type',
    locationCity: 'location_city',
    locationCountry: 'location_country',
    remoteAvailable: 'remote_available',
    minYearsExperience: 'min_years_experience',
    maxYearsExperience: 'max_years_experience',
    minEducationLevel: 'min_education_level',
    fullJobDescription: 'full_job_description',
    contactEmail: 'contact_email',
    postingStartDate: 'posting_start_date',
    cvCollectionEndDate: 'cv_collection_end_date',
    isOpen: 'is_open',
    shortlistedFrom: 'shortlisted_from',
    shortlistedDate: 'shortlisted_date',
    shortlistNote: 'shortlist_note',
    postingEndDate: 'posting_end_date',
    minSalary: 'min_salary',
    maxSalary: 'max_salary',
    currency: 'currency',
    deadline: 'deadline',
    companyName: 'company_name',
    requiredSkills: 'required_skills',
    preferredSkills: 'preferred_skills'
  },
  
  // Backend to Frontend (snake_case -> camelCase)
  toFrontend: {
    candidate_id: 'candidateId',
    job_id: 'jobId',
    requisition_id: 'requisitionId',
    company_id: 'companyId',
    recruiter_id: 'recruiterId',
    application_id: 'applicationId',
    assessment_id: 'assessmentId',
    session_id: 'sessionId',
    first_name: 'firstName',
    last_name: 'lastName',
    profile_picture: 'profilePicture',
    website: 'website',
    phone_number: 'phoneNumber',
    job_title: 'jobTitle',
    department: 'department',
    seniority_level: 'seniorityLevel',
    employment_type: 'employmentType',
    location_city: 'locationCity',
    location_country: 'locationCountry',
    remote_available: 'remoteAvailable',
    min_years_experience: 'minYearsExperience',
    max_years_experience: 'maxYearsExperience',
    min_education_level: 'minEducationLevel',
    full_job_description: 'fullJobDescription',
    contact_email: 'contactEmail',
    posting_start_date: 'postingStartDate',
    cv_collection_end_date: 'cvCollectionEndDate',
    is_open: 'isOpen',
    shortlisted_from: 'shortlistedFrom',
    shortlisted_date: 'shortlistedDate',
    shortlist_note: 'shortlistNote',
    posting_end_date: 'postingEndDate',
    min_salary: 'minSalary',
    max_salary: 'maxSalary',
    currency: 'currency',
    deadline: 'deadline',
    company_name: 'companyName',
    required_skills: 'requiredSkills',
    preferred_skills: 'preferredSkills'
  }
};

// Transform object keys from camelCase to snake_case for backend
export const transformToBackend = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  
  if (Array.isArray(obj)) {
    return obj.map(item => transformToBackend(item));
  }
  
  const transformed = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = fieldMapping.toBackend[key] || key;
      transformed[newKey] = typeof obj[key] === 'object' 
        ? transformToBackend(obj[key]) 
        : obj[key];
    }
  }
  return transformed;
};

// Transform object keys from snake_case to camelCase for frontend
export const transformToFrontend = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  
  if (Array.isArray(obj)) {
    return obj.map(item => transformToFrontend(item));
  }
  
  const transformed = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = fieldMapping.toFrontend[key] || key;
      transformed[newKey] = typeof obj[key] === 'object' 
        ? transformToFrontend(obj[key]) 
        : obj[key];
    }
  }
  return transformed;
};

// Error handling utilities
export const formatApiError = (error) => {
  if (error.response?.data?.detail) {
    const detail = error.response.data.detail;
    if (Array.isArray(detail)) {
      // Handle Pydantic validation errors
      return detail.map(err => err.msg || err).join(', ');
    }
    return detail;
  }

  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  if (error.response?.data?.error) {
    return error.response.data.error;
  }

  if (error.response?.data?.signal) {
    return error.response.data.signal;
  }

  if (error.response?.status) {
    return `Request failed with status ${error.response.status}: ${error.response.statusText || 'Unknown error'}`;
  }

  return 'An unexpected error occurred. Please try again.';
};

// Authentication utilities
export const getAuthToken = () => {
  return localStorage.getItem('access_token');
};

export const getTokenType = () => {
  return localStorage.getItem('token_type') || 'Bearer';
};

export const getAuthHeaders = () => {
  const token = getAuthToken();
  const tokenType = getTokenType();
  return token ? { Authorization: `${tokenType} ${token}` } : {};
};

export const isAuthenticated = () => {
  return !!getAuthToken();
};

export const getUserInfo = () => {
  const companyInfo = localStorage.getItem('company_info');
  const recruiterInfo = localStorage.getItem('recruiter_info');
  
  if (recruiterInfo) {
    return { type: 'recruiter', ...JSON.parse(recruiterInfo) };
  }
  
  if (companyInfo) {
    return { type: 'company', ...JSON.parse(companyInfo) };
  }
  
  return null;
};

export const clearAuth = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('token_type');
  localStorage.removeItem('company_info');
  localStorage.removeItem('recruiter_info');
  localStorage.removeItem('session_start');
};

// API response standardization
export const createApiResponse = (success, data = null, error = null) => {
  return {
    success,
    data,
    error,
    timestamp: new Date().toISOString()
  };
};

// Date formatting utilities
export const formatDateForBackend = (date) => {
  if (!date) return null;
  if (typeof date === 'string') return date;
  return date.toISOString();
};

export const formatDateForFrontend = (dateString) => {
  if (!dateString) return null;
  return new Date(dateString);
};
