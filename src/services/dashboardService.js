import api from './api';

export const dashboardService = {
  getSummary() {
    return api.get('/dashboard');
  },

  getPatientStatus(patientId) {
    return api.get(`/dashboard/${patientId}`);
  },
};
