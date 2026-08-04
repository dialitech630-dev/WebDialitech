import api from './api';

export const alertService = {
  getAll() {
    return api.get('/alerts');
  },

  getByPatient(patientId) {
    return api.get(`/alerts/${patientId}`);
  },

  remove(alertId) {
    return api.delete(`/alerts/${alertId}`);
  },
};
