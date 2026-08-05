import api from '../api';
import { authService } from './auth.service';

/**
 * Servicio de recuperación de contraseña (flujo con código de verificación).
 *
 * Flujo: el usuario introduce su email o teléfono → `forgotPassword` solicita el
 * envío de un código de verificación; luego `resetPassword` valida el código y
 * establece la nueva contraseña. Los endpoints están aislados en `RECOVERY_ENDPOINTS`.
 */
export const RECOVERY_ENDPOINTS = Object.freeze({
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
});

export const recoveryService = {
  /**
   * Solicita el envío del código de recuperación al email o teléfono indicado.
   * @param {{ email: string }} data - email o teléfono del caregiver (contrato OpenAPI `ForgotPasswordRequest`).
   * @returns {Promise<import('../types').ApiResponse>}
   */
  forgotPassword(data) {
    return api.post(RECOVERY_ENDPOINTS.FORGOT_PASSWORD, data);
  },

  /**
   * Valida el código recibido y establece la nueva contraseña.
   * @param {{ email: string, code: string, newPassword: string }} data
   * @returns {Promise<import('../types').ApiResponse>}
   */
  resetPassword(data) {
    return api.post(RECOVERY_ENDPOINTS.RESET_PASSWORD, data);
  },

  extractError: authService.extractError,
};
