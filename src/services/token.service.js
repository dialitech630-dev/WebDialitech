import { STORAGE_KEYS, AUTH_CONFIG } from '../config/security';

function getStorage() {
  if (AUTH_CONFIG.TOKEN_STORAGE === 'sessionStorage' && typeof sessionStorage !== 'undefined') {
    return sessionStorage;
  }
  return localStorage;
}

/**
 * Decodifica el payload de un JWT sin verificar la firma.
 * La verificación de firma la realiza el backend; aquí solo leemos claims
 * públicos (exp, nameid, email, Plan) para validación local de expiración.
 *
 * @param {string} token
 * @returns {import('../services/types').TokenPayload | null}
 */
export function decodeToken(token) {
  if (typeof token !== 'string' || !token) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  let payload;
  try {
    payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
  } catch {
    return null;
  }

  if (!payload || typeof payload !== 'object') return null;
  return payload;
}

/**
 * @param {import('../services/types').TokenPayload} payload
 */
export function getExpiryTime(payload) {
  const exp = payload && payload.exp;
  if (typeof exp !== 'number' || !Number.isFinite(exp)) return null;
  return exp * 1000;
}

/**
 * Valida expiración local del token (con tolerancia de reloj).
 * @param {string} [token]
 * @returns {boolean}
 */
export function isTokenValid(token) {
  const current = getToken();
  const candidate = token || current;
  if (!candidate) return false;

  const payload = decodeToken(candidate);
  if (!payload) return false;

  const expiresAtMs = getExpiryTime(payload);
  if (expiresAtMs === null) return false;

  const skew = (AUTH_CONFIG.TOKEN_CLOCK_SKEW_SECONDS || 30) * 1000;
  return Date.now() < expiresAtMs - skew;
}

export function getToken() {
  try {
    return getStorage().getItem(STORAGE_KEYS.TOKEN) || '';
  } catch {
    return '';
  }
}

export function setToken(token) {
  if (!token) {
    removeToken();
    return;
  }
  try {
    getStorage().setItem(STORAGE_KEYS.TOKEN, token);
  } catch {
    /* storage no disponible */
  }
}

export function removeToken() {
  try {
    getStorage().removeItem(STORAGE_KEYS.TOKEN);
  } catch {
    /* storage no disponible */
  }
}

/**
 * @returns {import('../services/types').CaregiverDto | null}
 */
export function getStoredUser() {
  try {
    const raw = getStorage().getItem(STORAGE_KEYS.USER);
    if (!raw) return null;
    const user = JSON.parse(raw);
    if (!user || typeof user !== 'object' || typeof user.id === 'undefined') return null;
    return user;
  } catch {
    return null;
  }
}

/**
 * @param {import('../services/types').CaregiverDto} user
 */
export function setStoredUser(user) {
  if (!user || typeof user !== 'object') return;
  try {
    getStorage().setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  } catch {
    /* storage no disponible */
  }
}

export function removeStoredUser() {
  try {
    getStorage().removeItem(STORAGE_KEYS.USER);
  } catch {
    /* storage no disponible */
  }
}

export function clearAuthStorage() {
  removeToken();
  removeStoredUser();
}

export const tokenService = {
  decodeToken,
  isTokenValid,
  getToken,
  setToken,
  removeToken,
  getStoredUser,
  setStoredUser,
  removeStoredUser,
  clearAuthStorage,
};

export default tokenService;
