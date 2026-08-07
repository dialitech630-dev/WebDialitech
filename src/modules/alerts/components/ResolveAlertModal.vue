<template>
  <Teleport to="body">
    <div v-if="visible" class="resolve-modal-overlay" @click.self="handleClose">
      <div class="resolve-modal-card">
        <div class="resolve-modal-header">
          <h3 class="resolve-modal-title">Resolver alerta</h3>
          <button class="resolve-modal-close" @click="handleClose">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M4 4l10 10M14 4l-10 10" stroke="#9ca3af" stroke-width="1.5" stroke-linecap="round" />
            </svg>
          </button>
        </div>

        <div class="resolve-modal-body">
          <p class="resolve-modal-text">
            ¿Estás seguro de que quieres resolver la alerta <strong>{{ displayType }}</strong>
            <template v-if="alert?.patientName">de <strong>{{ alert.patientName }}</strong></template>?
            Esto la eliminará de la lista de alertas.
          </p>
        </div>

        <div class="resolve-modal-footer">
          <button class="btn-cancel" :disabled="loading" @click="handleClose">Cancelar</button>
          <button class="btn-confirm" :disabled="loading" @click="$emit('confirm')">
            <svg v-if="loading" class="spinner" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5" stroke-dasharray="28" stroke-linecap="round"/>
            </svg>
            {{ loading ? 'Resolviendo...' : 'Resolver alerta' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  visible: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  alert: { type: Object, default: null },
  alertType: { type: String, default: 'Alerta' },
});

const emit = defineEmits(['close', 'confirm']);

const displayType = computed(() => props.alert?.type || props.alertType || 'Alerta');

function handleClose() {
  if (!props.loading) emit('close');
}
</script>

<style scoped>
.resolve-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.resolve-modal-card {
  background: #ffffff;
  border-radius: 16px;
  width: 100%;
  max-width: 440px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.resolve-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px 0;
}

.resolve-modal-title {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.resolve-modal-close {
  width: 32px;
  height: 32px;
  border: none;
  background: #f3f4f6;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  transition: background 0.15s;
}

.resolve-modal-close:hover {
  background: #e5e7eb;
}

.resolve-modal-body {
  padding: 20px 24px;
}

.resolve-modal-text {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
  line-height: 1.6;
}

.resolve-modal-text strong {
  color: #111827;
}

.resolve-modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px 20px;
  border-top: 1px solid #f3f4f6;
}

.btn-cancel {
  padding: 10px 20px;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  transition: background 0.15s;
}

.btn-cancel:hover:not(:disabled) {
  background: #e5e7eb;
}

.btn-confirm {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 24px;
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}

.btn-confirm:hover:not(:disabled) {
  background: #1d4ed8;
}

.btn-confirm:disabled,
.btn-cancel:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner {
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Responsive */
@media (max-width: 479px) {
  .resolve-modal-footer {
    flex-direction: column;
  }

  .btn-cancel,
  .btn-confirm {
    width: 100%;
    justify-content: center;
  }
}
</style>
