<template>
  <form class="forgot-form" @submit.prevent="$emit('submit')">
    <div class="field">
      <label class="field-label">Email Address</label>
      <input
        v-model="email"
        type="email"
        class="field-input"
        placeholder="you@example.com"
        required
        autocomplete="email"
      />
    </div>

    <p v-if="error" class="error-msg">{{ error }}</p>

    <button
      type="submit"
      class="submit-btn"
      :disabled="!email || loading"
    >
      {{ loading ? 'Sending...' : 'Send Recovery Code' }}
    </button>
  </form>
</template>

<script setup>
import { ref } from 'vue';
import { sanitizeEmail, isEmail } from '../../../utils/validators';

defineProps({
  loading: { type: Boolean, default: false },
  error: { type: String, default: '' },
});

const emit = defineEmits(['submit']);

const email = ref('');

function getPayload() {
  if (!email.value) return null;
  const clean = sanitizeEmail(email.value);
  if (!isEmail(clean)) return null;
  return { email: clean };
}

defineExpose({ email, getPayload });
</script>

<style scoped>
.forgot-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  text-align: left;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-label {
  font-size: 13px;
  font-weight: 500;
  color: #374151;
}

.field-input {
  padding: 10px 14px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  font-size: 14px;
  color: #374151;
  background: #f9fafb;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.field-input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  background: #ffffff;
}

.error-msg {
  color: #ef4444;
  font-size: 13px;
  margin: 0;
}

.submit-btn {
  padding: 12px;
  background: #2563eb;
  color: #ffffff;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
  margin-top: 4px;
}

.submit-btn:hover:not(:disabled) {
  background: #1d4ed8;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
