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
    return { message: data.title || 'La solicitud falló', fields: {} };
  }
  if (err.message === 'Network Error') {
    return { message: 'Algo salió mal. Inténtalo de nuevo más tarde.', fields: {} };
  }
  return { message: err.message || 'Algo salió mal. Inténtalo de nuevo más tarde.', fields: {} };
}

export const patientService = {
  getAll() {
    return api.get('/patients');
  },

  getById(id) {
    return api.get(`/patients/${id}`);
  },

  create(data) {
    return api.post('/patients', data);
  },

  delete(id) {
    return api.delete(`/patients/${id}`);
  },

  generateCode(id) {
    return api.post(`/patients/${id}/generate-code`);
  },

  generateWearableCode(id) {
    return api.post(`/patients/${id}/generate-wearable-code`);
  },

  extractError,
};
