/**
 * Servicio de Pagos.
 *
 * Arquitectura preparada para la futura pasarela de pago. Por ahora devuelve
 * datos placeholder (sin conexión a una pasarela real). Cuando se conecte la
 * pasarela, reemplaza los retornos de placeholder por las llamadas reales a la
 * API comentadas en cada método.
 */

const PLACEHOLDER_METHODS = [
  { id: 'visa', name: 'Visa', type: 'card' },
  { id: 'mastercard', name: 'Mastercard', type: 'card' },
  { id: 'amex', name: 'American Express', type: 'card' },
  { id: 'mercadopago', name: 'Mercado Pago', type: 'wallet' },
  { id: 'paypal', name: 'PayPal', type: 'wallet' },
  { id: 'spei', name: 'SPEI', type: 'bank' },
];

const PLACEHOLDER_HISTORY = [
  {
    id: 'pay-1',
    concept: 'Suscripción mensual',
    amount: null,
    date: null,
    status: 'completed',
  },
];

export const paymentService = {
  /**
   * Lista los métodos de pago disponibles.
   * TODO: reemplazar por GET /payments/methods
   */
  getPaymentMethods() {
    return Promise.resolve(PLACEHOLDER_METHODS);
  },

  /**
   * Registra una tarjeta.
   * TODO: reemplazar por POST /payments/cards (sin enviar datos sensibles al
   * backend directamente; usar tokenización de la pasarela).
   */
  addCard(payload) {
    // eslint-disable-next-line no-unused-vars
    const { cardNumber, cvv, ...safePayload } = payload || {};
    return Promise.resolve({ id: 'card-placeholder', ...safePayload, last4: String(payload?.cardNumber || '').replace(/\D/g, '').slice(-4) });
  },

  /**
   * Historial de pagos.
   * TODO: reemplazar por GET /payments/history
   */
  getPaymentHistory() {
    return Promise.resolve(PLACEHOLDER_HISTORY);
  },

  /**
   * Facturas descargables.
   * TODO: reemplazar por GET /payments/invoices/{id}
   */
  getInvoices() {
    return Promise.resolve([]);
  },

  /**
   * Carga de la tarjeta / pago.
   * TODO: reemplazar por POST /payments/charge
   */
  charge() {
    return Promise.reject(new Error('La pasarela de pago aún no está conectada.'));
  },
};
