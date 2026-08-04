import api from '../api';

export const accountService = {
  get() {
    return api.get('/auth/me');
  },
};
