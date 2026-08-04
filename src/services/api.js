import axios from 'axios';
import tokenService from './token.service';
import authEvents from './authEvents';

const baseURL = import.meta.env.DEV
  ? '/api/v1'
  : `${import.meta.env.VITE_API_URL}/api/v1`;

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 90000,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  const token = tokenService.getToken();
  if (token && isAuthRequiredRequest(config)) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function isAuthRequiredRequest(config) {
  const url = config.url || '';
  return !/\/auth\/(login|register|forgot-password|reset-password)/.test(url);
}

function isAuthLoginRequest(config) {
  const url = config.url || '';
  return /\/auth\/(login|register)/.test(url);
}

const IDEMPOTENT_METHODS = ['get', 'head', 'put', 'delete'];
const MAX_RETRIES = 2;
const RETRY_TIMEOUT = 30000;

function isServerUnavailable(error) {
  if (!error.response) return true;
  return error.response.status >= 500;
}

function isTransientError(error) {
  if (error.response) {
    const { status } = error.response;
    return status === 401 || status === 403 || status === 404 || status === 422;
  }
  return false;
}

function canRetry(config) {
  const method = (config.method || 'get').toLowerCase();
  if (!IDEMPOTENT_METHODS.includes(method)) return false;
  const retries = config._retryCount || 0;
  if (retries >= MAX_RETRIES) return false;
  config._retryCount = retries + 1;
  return true;
}

function backoffDelay(attempt) {
  return 800 * Math.pow(2, attempt);
}

let lastOfflineToastAt = 0;
let lastFailedConfig = null;

function showToast(type, title, message) {
  if (!window.__toast) return;
  window.__toast[type]?.(title, message);
}

function showServerUnavailableToast() {
  const now = Date.now();
  if (now - lastOfflineToastAt < 60000) return;
  lastOfflineToastAt = now;

  if (!window.__toast) return;

  window.__toast.error('Server not available', 'Unable to reach the server. Check your connection and try again.', {
    action: {
      label: 'Retry',
      onClick() {
        if (lastFailedConfig) {
          api(lastFailedConfig);
        }
      },
    },
    duration: 0,
  });
}

function onFinalFailure(error, config) {
  lastFailedConfig = config;
  showServerUnavailableToast();
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config || {};

    if (error.response) {
      const { status } = error.response;

      if (status === 401) {
        if (isAuthLoginRequest(config)) {
          return Promise.reject(error);
        }
        tokenService.clearAuthStorage();
        authEvents.emit('session-expired');
        return Promise.reject(error);
      }

      if (status === 403) {
        authEvents.emit('forbidden');
        return Promise.reject(error);
      }

      if (status === 404) {
        showToast('error', 'Not found', 'The requested resource could not be found.');
        return Promise.reject(error);
      }

      if (isServerUnavailable(error) && canRetry(config)) {
        await new Promise((resolve) => setTimeout(resolve, backoffDelay(config._retryCount)));
        return api({ ...config, timeout: RETRY_TIMEOUT });
      }

      if (isServerUnavailable(error)) {
        onFinalFailure(error, config);
      }
      return Promise.reject(error);
    }

    if (isTransientError(error)) {
      return Promise.reject(error);
    }

    if (canRetry(config)) {
      await new Promise((resolve) => setTimeout(resolve, backoffDelay(config._retryCount)));
      return api({ ...config, timeout: RETRY_TIMEOUT });
    }

    onFinalFailure(error, config);
    return Promise.reject(error);
  },
);

export default api;
