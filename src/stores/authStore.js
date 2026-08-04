import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { authService } from '../services/auth/auth.service';
import tokenService, { decodeToken, isTokenValid, getExpiryTime } from '../services/token.service';
import { normalizePlanId, normalizeRole } from '../services/permission.service';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(tokenService.getStoredUser());
  const token = ref(tokenService.getToken());
  const loading = ref(false);
  const error = ref('');
  const fieldErrors = ref({});
  const userLoaded = ref(false);

  const expiresAt = computed(() => {
    const payload = decodeToken(token.value);
    return getExpiryTime(payload) || 0;
  });

  const plan = computed(() => normalizePlanId(user.value?.plan));
  const role = computed(() => normalizeRole(user.value?.role || 'caregiver'));

  const isActive = computed(() => {
    if (!user.value) return false;
    if (user.value.status === undefined || user.value.status === null || user.value.status === '') return true;
    return String(user.value.status).toLowerCase() === 'active';
  });

  const isAuthenticated = computed(() => {
    if (!token.value || !isTokenValid(token.value)) return false;
    if (!user.value || !isActive.value) return false;
    return true;
  });

  const userName = computed(() => user.value?.name || '');
  const userEmail = computed(() => user.value?.email || '');
  const userId = computed(() => user.value?.id || '');
  const photo = computed(() => user.value?.imageUrl || '');
  const fullName = computed(() => {
    const parts = [user.value?.name, user.value?.lastname].filter(Boolean);
    return parts.join(' ') || '';
  });
  const initials = computed(() => {
    const name = fullName.value || userName.value;
    return name
      .split(' ')
      .map((n) => n[0])
      .filter(Boolean)
      .join('')
      .toUpperCase()
      .slice(0, 2);
  });

  function setSession(authResponse) {
    const caregiver = authResponse?.caregiver || authResponse?.user || authResponse || null;
    const nextToken = authResponse?.token || '';
    if (!nextToken || !caregiver) {
      logout();
      return;
    }
    token.value = nextToken;
    user.value = caregiver;
    tokenService.setToken(nextToken);
    tokenService.setStoredUser(caregiver);
    userLoaded.value = true;
  }

  function updateUser(patch) {
    if (!user.value) return;
    user.value = { ...user.value, ...patch };
    tokenService.setStoredUser(user.value);
  }

  function updatePhoto(url) {
    updateUser({ imageUrl: url || '' });
  }

  async function login(email, password) {
    loading.value = true;
    error.value = '';
    fieldErrors.value = {};
    try {
      const { data } = await authService.login({ email, password });
      setSession(data);
      return { success: true, caregiver: data?.caregiver || data?.user };
    } catch (err) {
      const parsed = authService.extractError(err);
      error.value = parsed.message;
      fieldErrors.value = parsed.fields;
      return { success: false, error: parsed.message, fields: parsed.fields };
    } finally {
      loading.value = false;
    }
  }

  async function register(data) {
    loading.value = true;
    error.value = '';
    fieldErrors.value = {};
    try {
      const { data: responseData } = await authService.register(data);
      return { success: true, data: responseData };
    } catch (err) {
      const parsed = authService.extractError(err);
      error.value = parsed.message;
      fieldErrors.value = parsed.fields;
      return { success: false, error: parsed.message, fields: parsed.fields };
    } finally {
      loading.value = false;
    }
  }

  async function fetchMe() {
    if (!token.value) return false;
    try {
      const { data } = await authService.me();
      if (!data || typeof data !== 'object' || typeof data.id === 'undefined') {
        logout();
        return false;
      }
      user.value = data;
      tokenService.setStoredUser(data);
      userLoaded.value = true;
      return true;
    } catch (err) {
      const status = err?.response?.status;
      if (status === 401) {
        logout();
        return false;
      }
      // Sin respuesta o error 5xx: la sesión local se mantiene (el backend
      // no rechazó el token). El interceptor reintenta/avisa en segundo plano.
      userLoaded.value = true;
      return true;
    }
  }

  async function refreshSession() {
    if (!token.value || !isTokenValid(token.value)) {
      logout();
      return false;
    }
    const ok = await fetchMe();
    return ok;
  }

  function clearErrors() {
    error.value = '';
    fieldErrors.value = {};
  }

  function logout() {
    user.value = null;
    token.value = '';
    userLoaded.value = false;
    tokenService.clearAuthStorage();
  }

  return {
    user, token, loading, error, fieldErrors, userLoaded, expiresAt,
    plan, role,
    isAuthenticated, userName, userEmail, userId,
    photo, fullName, initials,
    login, register, fetchMe, refreshSession, logout,
    updateUser, updatePhoto, clearErrors, setSession,
  };
});
