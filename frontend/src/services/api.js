import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request Interceptor: Attach JWT token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('agridirect_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Extract clean error message
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    let message = 'An unexpected error occurred. Please try again.';
    if (error.response) {
      if (error.response.data && error.response.data.detail) {
        message = typeof error.response.data.detail === 'string'
          ? error.response.data.detail
          : JSON.stringify(error.response.data.detail);
      } else if (error.response.data && error.response.data.error) {
        message = error.response.data.error;
      } else if (error.response.status === 401) {
        message = 'Your session has expired. Please login again.';
      } else if (error.response.status === 403) {
        message = 'You do not have permission to perform this action.';
      } else if (error.response.status === 404) {
        message = 'The requested resource was not found.';
      }
    } else if (error.request) {
      message = 'Could not connect to AgriDirect backend server. Please ensure backend is running.';
    }
    return Promise.reject(new Error(message));
  }
);

// Auth Endpoints
export const authAPI = {
  login: (username, password) => api.post('/auth/login', { username, password }),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
};

// Crops Endpoints
export const cropsAPI = {
  getAll: (params = {}) => api.get('/crops', { params }),
  getMy: () => api.get('/crops/my'),
  getById: (id) => api.get(`/crops/${id}`),
  create: (cropData) => api.post('/crops', cropData),
  update: (id, cropData) => api.put(`/crops/${id}`, cropData),
  delete: (id) => api.delete(`/crops/${id}`),
  markSold: (id) => api.patch(`/crops/${id}/sold`),
};

// Farmers Endpoints
export const farmersAPI = {
  getPublicProfile: (id) => api.get(`/farmers/${id}`),
  updateProfile: (profileData) => api.put('/farmers/profile', profileData),
};

// Buyers Endpoints
export const buyersAPI = {
  updateProfile: (profileData) => api.put('/buyers/profile', profileData),
};

// Enquiries Endpoints
export const enquiriesAPI = {
  create: (enquiryData) => api.post('/enquiries', enquiryData),
  getFarmerEnquiries: () => api.get('/enquiries/farmer'),
  getBuyerEnquiries: () => api.get('/enquiries/buyer'),
  updateStatus: (id, status) => api.patch(`/enquiries/${id}/status`, { status }),
};

// Market Prices Endpoints
export const marketPricesAPI = {
  getAll: (params = {}) => api.get('/market-prices', { params }),
  getByCrop: (cropName) => api.get(`/market-prices/${encodeURIComponent(cropName)}`),
  compare: (cropName, expectedPrice, district = '') =>
    api.get('/market-prices/compare', {
      params: { crop_name: cropName, expected_price: expectedPrice, district },
    }),
};

// Optional AI Endpoints
export const aiAPI = {
  getPricePrediction: (cropName, location = 'Tamil Nadu') =>
    api.get('/ai/price-prediction', { params: { crop_name: cropName, location } }),
  getDemandPrediction: (cropName, location = 'Tamil Nadu') =>
    api.get('/ai/demand-prediction', { params: { crop_name: cropName, location } }),
};

export default api;
