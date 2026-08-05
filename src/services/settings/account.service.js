import { authService } from '../auth/auth.service';

export const accountService = {
  get() {
    return authService.me();
  },
};
