import api from '../api';

function extractError(err) {
  if (err.response?.data) {
    const data = err.response.data;
    if (typeof data === 'string') return { message: data, fields: {} };
    if (data.errors) {
      const fields = {};
      for (const [key, msgs] of Object.entries(data.errors)) {
        fields[key.toLowerCase()] = Array.isArray(msgs) ? msgs[0] : msgs;
      }
      return { message: data.title || 'Validación fallida', fields };
    }
    if (data.message) return { message: data.message, fields: {} };
    if (data.error) return { message: data.error, fields: {} };
    return { message: data.title || 'La solicitud falló', fields: {} };
  }
  if (err.message === 'Network Error') {
    return { message: 'Algo salió mal. Inténtalo de nuevo más tarde.', fields: {} };
  }
  return { message: err.message || 'Algo salió mal. Inténtalo de nuevo más tarde.', fields: {} };
}

export const authService = {
  /**
   * @param {{ email: string, password: string }} data
   * @returns {Promise<import('../types').ApiResponse>}
   */
  login(data) {
    return api.post('/auth/login', data);
  },

  /**
   * @param {{ name: string, lastname: string, email: string, phone: string, password: string, imageUrl?: string, plan?: string }} data
   */
  register(data) {
    return api.post('/auth/register', data);
  },

  /**
   * @returns {Promise<import('../types').ApiResponse>}
   */
  me() {
    return api.get('/auth/me');
  },

  /**
   * @param {{ name: string, lastname: string, phone: string, imageUrl?: string }} data
   * @returns {Promise<import('../types').ApiResponse>}
   */
  updateProfile(data) {
    return api.put('/auth/profile', data);
  },

  deleteAccount() {
    return api.delete('/auth/account');
  },

  /**
   * @param {{ currentPassword: string, newPassword: string }} data
   */
  changePassword(data) {
    return api.post('/auth/change-password', data);
  },

  extractError,
};
