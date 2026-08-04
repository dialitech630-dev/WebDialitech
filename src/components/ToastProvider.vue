<template>
  <div class="toast-container">
    <TransitionGroup name="toast">
      <div
        v-for="t in toasts"
        :key="t.id"
        class="toast"
        :class="t.type"
      >
        <div class="toast-icon">
          <svg v-if="t.type === 'success'" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="10" fill="#059669" />
            <path d="M6 10l2.5 2.5L14 7" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <svg v-else-if="t.type === 'error'" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="10" fill="#dc2626" />
            <path d="M7 7l6 6M13 7l-6 6" stroke="#fff" stroke-width="1.5" stroke-linecap="round" />
          </svg>
          <svg v-else width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="10" fill="#2563eb" />
            <path d="M10 6v4M10 13v1" stroke="#fff" stroke-width="1.5" stroke-linecap="round" />
          </svg>
        </div>
        <div class="toast-body">
          <p class="toast-title">{{ t.title }}</p>
          <p v-if="t.message" class="toast-message">{{ t.message }}</p>
          <button v-if="t.action" class="toast-action" @click="onAction(t)">
            {{ t.action.label }}
          </button>
        </div>
        <button class="toast-close" @click="remove(t.id)">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
          </svg>
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const toasts = ref([]);
let nextId = 0;

function add(type, title, message, options = {}) {
  const { duration = 5000, action } = options;
  const id = ++nextId;
  toasts.value.push({ id, type, title, message, action });
  if (duration > 0) {
    setTimeout(() => remove(id), duration);
  }
}

function onAction(t) {
  if (t.action?.onClick) {
    t.action.onClick();
  }
  remove(t.id);
}

function remove(id) {
  toasts.value = toasts.value.filter((t) => t.id !== id);
}

defineExpose({ add, remove });
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 400px;
}

.toast {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid #f3f4f6;
  pointer-events: auto;
}

.toast-icon {
  flex-shrink: 0;
  margin-top: 2px;
}

.toast-body {
  flex: 1;
  min-width: 0;
}

.toast-title {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.toast-message {
  font-size: 13px;
  color: #6b7280;
  margin: 2px 0 0;
}

.toast-action {
  margin-top: 10px;
  padding: 6px 14px;
  border: none;
  border-radius: 8px;
  background: #2563eb;
  color: #ffffff;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}

.toast-action:hover {
  background: #1d4ed8;
}

.toast-close {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  border: none;
  background: #f3f4f6;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  transition: all 0.15s;
}

.toast-close:hover {
  background: #e5e7eb;
  color: #6b7280;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
