import { defineStore } from 'pinia';
import { ref } from 'vue';
import { SESSION_CONFIG } from '../config/security';

export const useSessionStore = defineStore('session', () => {
  const expired = ref(false);
  const inactivityWarning = ref(false);
  const warningCountdown = ref(Math.round(SESSION_CONFIG.WARNING_BEFORE_MS / 1000));

  function triggerExpired() {
    expired.value = true;
    inactivityWarning.value = false;
  }

  function dismissExpired() {
    expired.value = false;
  }

  function triggerInactivity() {
    inactivityWarning.value = true;
    warningCountdown.value = Math.round(SESSION_CONFIG.WARNING_BEFORE_MS / 1000);
  }

  function dismissInactivity() {
    inactivityWarning.value = false;
  }

  function setWarningCountdown(seconds) {
    warningCountdown.value = seconds;
  }

  return {
    expired,
    inactivityWarning,
    warningCountdown,
    triggerExpired,
    dismissExpired,
    triggerInactivity,
    dismissInactivity,
    setWarningCountdown,
  };
});
