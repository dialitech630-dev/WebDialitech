import api from '../api';
import { authService } from './auth.service';

/**
 * Servicio de recuperación de contraseña desacoplado del envío de correos (EmailSender).
 *
 * Flujo temporal: el usuario introduce su email o teléfono y, si la cuenta existe,
 * actualiza directamente su contraseña (sin código ni OTP). Este contrato está
 * aislado en `RECOVERY_ENDPOINTS` para que, cuando el backend disponga de OTP/email,
 * solo haya que apuntar estos endpoints al nuevo flujo sin tocar las vistas.
 */
export const RECOVERY_ENDPOINTS = Object.freeze({
  VERIFY_IDENTIFIER: '/auth/recovery/verify',
  RESET_PASSWORD: '/auth/recovery/reset-password',
});

export const recoveryService = {
  /**
   * @param {{ identifier: string }} data - email o teléfono del caregiver.
   * @returns {Promise<import('../types').ApiResponse>}
   */
  verifyIdentifier(data) {
    return api.post(RECOVERY_ENDPOINTS.VERIFY_IDENTIFIER, data);
  },

  /**
   * @param {{ identifier: string, newPassword: string }} data
   * @returns {Promise<import('../types').ApiResponse>}
   */
  resetPassword(data) {
    return api.post(RECOVERY_ENDPOINTS.RESET_PASSWORD, data);
  },

  extractError: authService.extractError,
};
