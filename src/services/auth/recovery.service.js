import api from '../api';
import { authService } from './auth.service';

/**
 * Servicio de recuperación de contraseña.
 *
 * Flujo simplificado: el usuario introduce su email y una nueva contraseña, y
 * `resetPassword` establece la contraseña directamente (el backend aún no
 * implementa el envío/validación de códigos de verificación).
 */
export const RECOVERY_ENDPOINTS = Object.freeze({
  RESET_PASSWORD: '/auth/reset-password',
});

export const recoveryService = {
  /**
   * Establece una nueva contraseña para el email indicado.
   * @param {{ email: string, newPassword: string }} data
   * @returns {Promise<import('../types').ApiResponse>}
   */
  resetPassword(data) {
    return api.post(RECOVERY_ENDPOINTS.RESET_PASSWORD, data);
  },

  extractError: authService.extractError,
};
