<template>
  <Teleport to="body">
    <div class="delete-overlay" @click.self="handleClose">
      <div class="delete-card">
        <div class="delete-icon">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M4 8h20" stroke="#dc2626" stroke-width="2" stroke-linecap="round" />
            <path d="M10 8V5a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v3M7 8l1 16a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1l1-16" stroke="#dc2626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M11 13v6M17 13v6" stroke="#dc2626" stroke-width="2" stroke-linecap="round" />
          </svg>
        </div>
        <h3 class="delete-title">Delete Account</h3>
        <p class="delete-desc">
          This action is permanent and cannot be undone. Your account and all associated
          <strong>patients, alerts, devices and data</strong> will be deleted. You will be signed out immediately.
        </p>

        <p v-if="error" class="delete-error">{{ error }}</p>

        <div class="delete-actions">
          <button class="btn-cancel" :disabled="deleting" @click="handleClose">Cancel</button>
          <button class="btn-delete" :disabled="deleting" @click="$emit('confirm')">
            <svg v-if="deleting" class="spinner" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5" stroke-dasharray="28" stroke-linecap="round"/>
            </svg>
            {{ deleting ? 'Deleting...' : 'Delete Account' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  visible: { type: Boolean, default: false },
  deleting: { type: Boolean, default: false },
  error: { type: String, default: '' },
});

const emit = defineEmits(['close', 'confirm']);

function handleClose() {
  if (!props.deleting) emit('close');
}
</script>

<style scoped>
.delete-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.delete-card {
  background: #ffffff;
  border-radius: 16px;
  width: 100%;
  max-width: 440px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  padding: 32px 28px;
  text-align: center;
}

.delete-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #fef2f2;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}

.delete-title {
  font-size: 19px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 10px;
}

.delete-desc {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.6;
  margin: 0 0 16px;
}

.delete-desc strong {
  color: #b91c1c;
}

.delete-error {
  font-size: 13px;
  color: #dc2626;
  margin: 0 0 16px;
  padding: 10px 14px;
  background: #fef2f2;
  border-radius: 8px;
}

.delete-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.btn-cancel {
  padding: 10px 24px;
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

.btn-delete {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 24px;
  background: #dc2626;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}

.btn-delete:hover:not(:disabled) {
  background: #b91c1c;
}

.btn-delete:disabled,
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
  .delete-actions {
    flex-direction: column;
  }

  .btn-cancel,
  .btn-delete {
    width: 100%;
    justify-content: center;
  }
}
</style>
