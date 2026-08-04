<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="session.expired" class="modal-overlay">
        <div class="modal-card">
          <div class="modal-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="#2563eb" stroke-width="1.6" />
              <path d="M12 7v5l3 3" stroke="#2563eb" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>
          <h2 class="modal-title">Session Expired</h2>
          <p class="modal-desc">Your session has expired. Please sign in again to continue.</p>
          <button class="login-btn" @click="goToLogin">Go to Login</button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';
import { useSessionStore } from '../stores/sessionStore';

const router = useRouter();
const auth = useAuthStore();
const session = useSessionStore();

function goToLogin() {
  auth.logout();
  session.dismissExpired();
  router.push({ name: 'login', query: { expired: '1' } });
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1100;
  padding: 24px;
}

.modal-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 40px 36px;
  max-width: 400px;
  width: 100%;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

.modal-icon {
  width: 72px;
  height: 72px;
  margin: 0 auto 16px;
  border-radius: 20px;
  background: #eff6ff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-title {
  font-size: 24px;
  font-weight: 800;
  color: #111827;
  margin: 0 0 10px;
}

.modal-desc {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.6;
  margin: 0 0 24px;
}

.login-btn {
  padding: 12px 40px;
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}

.login-btn:hover {
  background: #1d4ed8;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
