<template>
  <div class="actions">
    <button
      class="action-btn"
      :disabled="resolved"
      :title="resolved ? 'Already resolved' : 'Mark as resolved'"
      @click="$emit('resolve')"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6.5" stroke="#6b7280" stroke-width="1.3" />
        <path d="M5.5 8L7.5 10L10.5 6" stroke="#6b7280" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>
    <button class="action-btn danger" title="Dismiss alert" @click="$emit('dismiss')">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6.5" stroke="#6b7280" stroke-width="1.3" />
        <path d="M5.5 5.5L10.5 10.5M10.5 5.5L5.5 10.5" stroke="#6b7280" stroke-width="1.3" stroke-linecap="round" />
      </svg>
    </button>
  </div>
</template>

<script setup>
defineProps({
  resolved: { type: Boolean, default: false },
});

defineEmits(['resolve', 'dismiss']);
</script>

<style scoped>
.actions {
  display: flex;
  align-items: center;
  gap: 2px;
}

.action-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s;
}

.action-btn:hover:not(:disabled) {
  background: #f3f4f6;
}

.action-btn:hover:not(:disabled) svg path,
.action-btn:hover:not(:disabled) svg circle {
  stroke: #2563eb;
}

.action-btn.danger:hover:not(:disabled) svg path {
  stroke: #dc2626;
}

.action-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
