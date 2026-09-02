import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8080/api';

function extractErrorMessage(error) {
  if (error && error.response && error.response.data && error.response.data.message) {
    return error.response.data.message;
  }
  if (error && error.message) {
    return error.message;
  }
  return String(error);
}

function attachInterceptors(instance) {
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('promptport_token');
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error && error.response && error.response.status === 401) {
        localStorage.removeItem('promptport_token');
        localStorage.removeItem('promptport_user');
        if (process.env.NODE_ENV !== 'test') {
          window.location.href = '/login';
        }
        return Promise.reject('Session expired. Please login again.');
      }
      return Promise.reject(extractErrorMessage(error));
    }
  );

  return instance;
}

function getSafeApi() {
  try {
    const instance = axios.create({ baseURL: BASE_URL });
    return attachInterceptors(instance);
  } catch (e) {
    // Fallback to base axios if instance creation fails, ensuring
    // interceptors and HTTP methods always exist.
    const fallback = axios;
    fallback.defaults.baseURL = BASE_URL;
    if (!fallback.interceptors) {
      fallback.interceptors = { request: { use: () => {} }, response: { use: () => {} } };
    }
    ['get', 'post', 'put', 'delete', 'patch'].forEach((method) => {
      if (typeof fallback[method] !== 'function') {
        fallback[method] = () => Promise.reject('HTTP method unavailable');
      }
    });
    return attachInterceptors(fallback);
  }
}

const api = getSafeApi();

export default api;