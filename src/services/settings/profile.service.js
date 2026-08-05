import api from '../api';
import { authService } from '../auth/auth.service';

export const profileService = {
  get() {
    return authService.me();
  },

  update(data) {
    return api.put('/auth/profile', data);
  },
};
