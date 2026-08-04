import api from '../api';

const STORAGE_KEY = 'appearance_preferences';

export const appearanceService = {
  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  save(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  },

  reset() {
    localStorage.removeItem(STORAGE_KEY);
  },

  syncToApi(data) {
    return api.put('/settings/appearance', data);
  },
};
