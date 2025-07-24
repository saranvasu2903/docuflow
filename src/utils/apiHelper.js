import axios from 'axios';
import { store } from '@/store'

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});
axiosInstance.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const { organizationId, userId, role } = state.user || {};

    config.headers = { ...config.headers };

    if (organizationId) {
      config.headers['X-Organization-Id'] = organizationId;
    }
    if (role) {
      config.headers['X-Role'] = role;
    }
    if (userId) {
      config.headers['X-User-Id'] = userId;
    }

    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

const apiRequest = async (method, url, data = null, config = {}) => {
  try {
    const response = await axiosInstance({
      method,
      url,
      data,
      ...config,
    });
    return response.data;
  } catch (error) {
    const message = error?.response?.data?.error;
    error.message = message;
    throw error;
  }
};

export const get = (url, config = {}) => apiRequest('GET', url, null, config);
export const post = (url, data, config = {}) => apiRequest('POST', url, data, config);
export const put = (url, data, config = {}) => apiRequest('PUT', url, data, config);
export const patch = (url, data, config = {}) => apiRequest('PATCH', url, data, config);
export const del = (url, config = {}) => apiRequest('DELETE', url, null, config);
