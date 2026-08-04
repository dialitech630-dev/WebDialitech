<template>
  <router-view />
  <ToastProvider ref="toastRef" />
  <SessionExpiredModal />
  <SessionTimeoutModal />
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import ToastProvider from './components/ToastProvider.vue';
import SessionExpiredModal from './components/SessionExpiredModal.vue';
import SessionTimeoutModal from './components/SessionTimeoutModal.vue';
import { useAppearanceStore } from './stores/appearanceStore';
import { useAuthStore } from './stores/authStore';
import { useSessionStore } from './stores/sessionStore';
import { authEvents } from './services/authEvents';
import { sessionService } from './services/session.service';

const toastRef = ref(null);
const router = useRouter();
const auth = useAuthStore();
const session = useSessionStore();

window.__toast = {
  success(title, message) {
    toastRef.value?.add('success', title, message);
  },
  error(title, message, options) {
    toastRef.value?.add('error', title, message, options);
  },
  info(title, message) {
    toastRef.value?.add('info', title, message);
  },
};

let warningInterval = null;

function onSessionExpired() {
  const wasLoaded = auth.userLoaded;
  auth.logout();
  // Durante la validación inicial (guard/refreshSession) el router ya redirige a /login.
  if (!wasLoaded) {
    session.dismissExpired();
    return;
  }
  if (router.currentRoute.value.name === 'login' || router.currentRoute.value.name === 'register') {
    session.dismissExpired();
    return;
  }
  session.triggerExpired();
}

function onForbidden() {
  if (window.__toast) {
    window.__toast.error('Forbidden', 'You do not have permission to perform this action.');
  }
}

function startInactivityWatcher() {
  if (auth.isAuthenticated) {
    sessionService.onWarning(() => {
      session.triggerInactivity();
      if (warningInterval) clearInterval(warningInterval);
      warningInterval = setInterval(() => {
        const next = Math.max(session.warningCountdown - 1, 0);
        session.setWarningCountdown(next);
        if (next <= 0) {
          clearInterval(warningInterval);
          warningInterval = null;
        }
      }, 1000);
    });
    sessionService.onExpired(() => {
      if (warningInterval) clearInterval(warningInterval);
      warningInterval = null;
      onSessionExpired();
    });
    sessionService.start();
  }
}

function stopInactivityWatcher() {
  sessionService.stop();
  if (warningInterval) clearInterval(warningInterval);
  warningInterval = null;
  session.dismissInactivity();
}

onMounted(() => {
  const store = useAppearanceStore();
  store.applyAll();

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (store.theme === 'system') {
      store.applyTheme('system');
    }
  });

  authEvents.on('session-expired', onSessionExpired);
  authEvents.on('forbidden', onForbidden);

  watch(
    () => auth.isAuthenticated,
    (isAuthed) => {
      if (isAuthed) startInactivityWatcher();
      else stopInactivityWatcher();
    },
    { immediate: true },
  );

  router.afterEach(() => {
    if (auth.isAuthenticated) {
      sessionService.reset();
    }
  });
});

onUnmounted(() => {
  authEvents.off('session-expired', onSessionExpired);
  authEvents.off('forbidden', onForbidden);
  stopInactivityWatcher();
});
</script>
