<template>
  <form class="recovery-form" novalidate @submit.prevent="$emit('submit')">
    <div class="field">
      <label class="field-label">{{ t('auth.email') }}</label>
      <input
        v-model="email"
        type="email"
        class="field-input"
        :class="{ 'input-error': fieldErrors.email }"
        :placeholder="t('auth.emailPlaceholder')"
        maxlength="254"
        autocomplete="email"
        @input="clearFieldError('email')"
      />
      <p v-if="fieldErrors.email" class="error-msg">{{ fieldErrors.email }}</p>
    </div>

    <div class="field">
      <label class="field-label">{{ t('auth.newPassword') }}</label>
      <input
        v-model="newPassword"
        type="password"
        class="field-input"
        :class="{ 'input-error': fieldErrors.newPassword }"
        placeholder="••••••••"
        maxlength="128"
        autocomplete="new-password"
        @input="clearFieldError('newPassword')"
      />
      <p v-if="fieldErrors.newPassword" class="error-msg">{{ fieldErrors.newPassword }}</p>
    </div>

    <div class="field">
      <label class="field-label">{{ t('auth.confirmNewPassword') }}</label>
      <input
        v-model="confirmPassword"
        type="password"
        class="field-input"
        :class="{ 'input-error': fieldErrors.confirmPassword }"
        placeholder="••••••••"
        maxlength="128"
        autocomplete="new-password"
        @input="clearFieldError('confirmPassword')"
      />
      <p v-if="fieldErrors.confirmPassword" class="error-msg">{{ fieldErrors.confirmPassword }}</p>
    </div>

    <p class="hint">{{ t('form.passwordLengthHint', { length: minLength }) }}</p>

    <p v-if="error" class="error-msg">{{ error }}</p>

    <LoadingButton type="submit" :loading="loading" :loading-text="t('settings.changing')">
      {{ t('settings.changePassword') }}
    </LoadingButton>
  </form>
</template>

<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import LoadingButton from '../../../components/LoadingButton.vue';
import { PASSWORD_POLICY, FIELD_LIMITS } from '../../../config/security';
import { isEmail, sanitizeEmail, isStrongPassword, matches, required } from '../../../utils/validators';

defineProps({
  loading: { type: Boolean, default: false },
  error: { type: String, default: '' },
});

const emit = defineEmits(['submit']);

const { t } = useI18n();

const minLength = PASSWORD_POLICY.MIN_LENGTH;
const maxLength = PASSWORD_POLICY.MAX_LENGTH;

const email = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const fieldErrors = ref({ email: '', newPassword: '', confirmPassword: '' });

function clearFieldError(field) {
  if (fieldErrors.value[field]) fieldErrors.value[field] = '';
}

function getPayload() {
  const errors = {};

  const cleanEmail = sanitizeEmail(email.value);
  if (!required(cleanEmail)) {
    errors.email = t('form.emailRequired');
  } else if (!isEmail(cleanEmail)) {
    errors.email = t('form.validEmail');
  }

  if (!required(newPassword.value)) {
    errors.newPassword = t('form.passwordRequired');
  } else if (!isStrongPassword(newPassword.value)) {
    errors.newPassword = t('form.passwordPolicy', { min: minLength, max: maxLength });
  }

  if (!required(confirmPassword.value)) {
    errors.confirmPassword = t('form.confirmPasswordRequired');
  } else if (!matches(newPassword.value, confirmPassword.value)) {
    errors.confirmPassword = t('form.passwordsDoNotMatch');
  }

  fieldErrors.value = errors;

  if (errors.email || errors.newPassword || errors.confirmPassword) return null;

  return { email: cleanEmail, newPassword: newPassword.value };
}

defineExpose({ email, newPassword, confirmPassword, getPayload, clearFieldError });
</script>

<style scoped>
.recovery-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
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

.hint {
  font-size: 12px;
  color: #9ca3af;
  margin: -4px 0 0;
}
</style>
