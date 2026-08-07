import api from './api';

export const alertService = {
  getAll() {
    return api.get('/alerts');
  },

  getByPatient(patientId) {
    return api.get(`/alerts/${patientId}`);
  },

  remove(alertId) {
    if (!alertId) {
      return Promise.reject(new Error('No se pudo resolver la alerta porque el ID de la alerta no es válido.'));
    }
    return api.delete(`/alerts/${alertId}`);
  },
};
