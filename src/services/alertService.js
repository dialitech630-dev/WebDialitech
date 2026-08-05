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
      return Promise.reject(new Error('Unable to resolve alert because the alert ID is invalid.'));
    }
    return api.delete(`/alerts/${alertId}`);
  },
};
