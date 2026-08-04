<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="session.inactivityWarning" class="modal-overlay">
        <div class="modal-card">
          <div class="modal-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="#d97706" stroke-width="1.6" />
              <path d="M12 6.5V12l3.5 2" stroke="#d97706" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>
          <h2 class="modal-title">Are you still there?</h2>
          <p class="modal-desc">
            For security reasons, your session will expire due to inactivity in
            <strong>{{ session.warningCountdown }} seconds</strong>.
          </p>
          <button class="continue-btn" @click="continueSession">Continue Session</button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { useSessionStore } from '../stores/sessionStore';
import { sessionService } from '../services/session.service';

const session = useSessionStore();

function continueSession() {
  session.dismissInactivity();
  sessionService.reset();
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
  background: #fffbeb;
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

.modal-desc strong {
  color: #d97706;
}

.continue-btn {
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

.continue-btn:hover {
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
