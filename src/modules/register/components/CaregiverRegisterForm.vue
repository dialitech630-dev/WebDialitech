<template>
  <div class="register-form">
    <h2 class="form-title">{{ t('auth.registerAsCaregiver') }}</h2>

    <RegisterAvatarUploader v-model:image-url="imageUrl" />

    <div class="fields-grid">
      <div class="field">
        <label class="field-label">{{ t('settings.firstName') }}</label>
        <input v-model.trim="form.name" class="field-input" :class="{ 'input-error': errors.name }" :placeholder="t('form.firstNamePlaceholder')" maxlength="60" autocomplete="given-name" />
        <p v-if="errors.name" class="field-error">{{ errors.name }}</p>
      </div>
      <div class="field">
        <label class="field-label">{{ t('settings.lastName') }}</label>
        <input v-model.trim="form.lastname" class="field-input" :class="{ 'input-error': errors.lastname }" :placeholder="t('form.lastNamePlaceholder')" maxlength="60" autocomplete="family-name" />
        <p v-if="errors.lastname" class="field-error">{{ errors.lastname }}</p>
      </div>
      <div class="field">
        <label class="field-label">{{ t('auth.email') }}</label>
        <input v-model.trim="form.email" type="email" class="field-input" :class="{ 'input-error': errors.email }" :placeholder="t('auth.emailPlaceholder')" maxlength="254" autocomplete="email" />
        <p v-if="errors.email" class="field-error">{{ errors.email }}</p>
      </div>
      <div class="field">
        <label class="field-label">{{ t('settings.phone') }}</label>
        <input v-model.trim="form.phone" type="tel" class="field-input" :class="{ 'input-error': errors.phone }" :placeholder="t('form.phonePlaceholder')" maxlength="20" autocomplete="tel" />
        <p v-if="errors.phone" class="field-error">{{ errors.phone }}</p>
      </div>
      <div class="field">
        <label class="field-label">{{ t('auth.password') }}</label>
        <input v-model="form.password" type="password" class="field-input" :class="{ 'input-error': errors.password }" placeholder="••••••••" maxlength="128" autocomplete="new-password" />
        <p v-if="errors.password" class="field-error">{{ errors.password }}</p>
      </div>
      <div class="field">
        <label class="field-label">{{ t('auth.confirmPassword') }}</label>
        <input v-model="form.confirmPassword" type="password" class="field-input" :class="{ 'input-error': errors.confirmPassword }" placeholder="••••••••" maxlength="128" autocomplete="new-password" />
        <p v-if="errors.confirmPassword" class="field-error">{{ errors.confirmPassword }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '../../../stores/authStore';
import RegisterAvatarUploader from './RegisterAvatarUploader.vue';
import { validateRegisterForm, sanitizeString, sanitizeEmail, sanitizePhone } from '../../../utils/validators';

const { t } = useI18n();
const authStore = useAuthStore();
const fieldErrors = computed(() => authStore.fieldErrors || {});

const form = reactive({
  name: '',
  lastname: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
});

const errors = reactive({
  name: '',
  lastname: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
});

const imageUrl = ref('');

function getPayload() {
  const payload = {
    name: sanitizeString(form.name),
    lastname: sanitizeString(form.lastname),
    email: sanitizeEmail(form.email),
    phone: sanitizePhone(form.phone),
    password: form.password,
    confirmPassword: form.confirmPassword,
  };

  const validationErrors = validateRegisterForm(payload);
  errors.name = validationErrors.name || '';
  errors.lastname = validationErrors.lastname || '';
  errors.email = validationErrors.email || '';
  errors.phone = validationErrors.phone || '';
  errors.password = validationErrors.password || '';
  errors.confirmPassword = validationErrors.confirmPassword || '';

  if (Object.values(validationErrors).some(Boolean)) {
    return null;
  }

  return {
    name: payload.name,
    lastname: payload.lastname,
    email: payload.email,
    phone: payload.phone,
    password: payload.password,
    imageUrl: imageUrl.value,
    plan: 'Standard',
  };
}

defineExpose({ form, getPayload });
</script>

<style scoped>
.register-form {
  text-align: left;
}

.form-title {
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 4px 0;
  text-align: center;
}

.fields-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.field-label {
  font-size: 12px;
  font-weight: 600;
  color: #374151;
}

.field-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  font-size: 14px;
  color: #374151;
  background: #f9fafb;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
  box-sizing: border-box;
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

.field-input.input-error:focus {
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
  border-color: #dc2626;
}

.field-error {
  font-size: 12px;
  color: #dc2626;
  margin: 0;
}

.field-input::placeholder {
  color: #d1d5db;
}

/* Responsive */
@media (max-width: 767px) {
  .fields-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}
</style>
