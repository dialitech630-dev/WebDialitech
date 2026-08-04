import api from '../api';

export const profileService = {
  get() {
    return api.get('/auth/me');
  },

  update(data) {
    return api.put('/auth/profile', data);
  },
};
