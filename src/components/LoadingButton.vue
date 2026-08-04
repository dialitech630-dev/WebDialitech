<template>
  <button
    class="loading-btn"
    :class="[variant, { loading }]"
    :disabled="disabled || loading"
    @click="$emit('click')"
  >
    <span v-if="loading" class="spinner" />
    <span v-if="loading" class="loading-text">{{ loadingText }}</span>
    <slot v-else />
  </button>
</template>

<script setup>
defineProps({
  loading: Boolean,
  disabled: Boolean,
  variant: { type: String, default: 'primary' },
  loadingText: { type: String, default: 'Loading...' },
});

defineEmits(['click']);
</script>

<style scoped>
.loading-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  margin-top: 24px;
}

.loading-btn.primary {
  background: #2563eb;
  color: #ffffff;
}

.loading-btn.primary:hover:not(:disabled) {
  background: #1d4ed8;
}

.loading-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading-btn.loading {
  background: #93c5fd;
  cursor: not-allowed;
}

.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
