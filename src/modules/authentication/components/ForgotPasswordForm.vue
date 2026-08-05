<template>
  <form class="forgot-form" novalidate @submit.prevent="$emit('submit')">
    <div class="field">
      <label class="field-label">Email or Phone</label>
      <input
        v-model="identifier"
        type="text"
        class="field-input"
        :class="{ 'input-error': fieldError }"
        placeholder="you@example.com or +1 (555) 000-0000"
        maxlength="254"
        autocomplete="username"
        @input="clearFieldError"
      />
      <p v-if="fieldError" class="error-msg">{{ fieldError }}</p>
    </div>

    <p v-if="error" class="error-msg">{{ error }}</p>

    <LoadingButton type="submit" :loading="loading" loading-text="Checking...">
      Continue
    </LoadingButton>
  </form>
</template>

<script setup>
import { ref } from 'vue';
import LoadingButton from '../../../components/LoadingButton.vue';
import { isEmailOrPhone, sanitizeIdentifier } from '../../../utils/validators';

defineProps({
  loading: { type: Boolean, default: false },
  error: { type: String, default: '' },
});

const emit = defineEmits(['submit']);

const identifier = ref('');
const fieldError = ref('');

function clearFieldError() {
  if (fieldError.value) fieldError.value = '';
}

function getPayload() {
  const clean = sanitizeIdentifier(identifier.value);
  if (!clean) {
    fieldError.value = 'Enter your email or phone number.';
    return null;
  }
  if (!isEmailOrPhone(clean)) {
    fieldError.value = 'Enter a valid email address or phone number.';
    return null;
  }
  return { email: clean };
}

defineExpose({ identifier, getPayload, clearFieldError });
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

.field-input.input-error {
  border-color: #dc2626;
  background: #fef2f2;
}

.error-msg {
  color: #ef4444;
  font-size: 13px;
  margin: 0;
}
</style>
