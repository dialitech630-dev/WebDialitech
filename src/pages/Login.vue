<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-brand">
        <svg width="40" height="40" viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="8" fill="#2563eb" />
          <path d="M8 16C8 11.5817 11.5817 8 16 8V24C11.5817 24 8 20.4183 8 16Z" fill="#fff" fill-opacity="0.9" />
          <path d="M16 8C20.4183 8 24 11.5817 24 16S20.4183 24 16 24" stroke="#fff" stroke-width="1.5" stroke-linecap="round" />
          <circle cx="16" cy="16" r="3" fill="#fff" />
        </svg>
        <span class="login-brand-name">DiaMonitor</span>
      </div>
      <h1 class="login-title">{{ t('auth.welcomeBack') }}</h1>
      <p class="login-subtitle">{{ t('auth.loginSubtitle') }}</p>

      <div v-if="showSuccess" class="success-banner">
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="10" fill="#059669" />
          <path d="M6 10l2.5 2.5L14 7" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <div>
          <p class="success-title">{{ t('auth.loginSuccess') }}</p>
          <p class="success-subtitle">{{ t('auth.welcomeBackShort') }}</p>
        </div>
      </div>

      <div v-if="expiredNotice" class="expired-banner">
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="10" fill="#2563eb" />
          <path d="M10 6v4M10 13v1" stroke="#fff" stroke-width="1.5" stroke-linecap="round" />
        </svg>
        <span>{{ t('auth.sessionExpired') }}</span>
      </div>

      <div v-if="authStore.error && !showSuccess" class="error-banner">
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="10" fill="#dc2626" />
          <path d="M7 7l6 6M13 7l-6 6" stroke="#fff" stroke-width="1.5" stroke-linecap="round" />
        </svg>
        <span>{{ authStore.error }}</span>
      </div>

      <form class="login-form" @submit.prevent="handleLogin" novalidate>
        <div class="field">
          <label class="field-label">{{ t('auth.email') }}</label>
          <input
            v-model.trim="email"
            type="email"
            class="field-input"
            :class="{ 'input-error': fieldErrors.email || authStore.fieldErrors?.email }"
            :placeholder="t('auth.emailPlaceholder')"
            maxlength="254"
            autocomplete="email"
          />
          <p v-if="fieldErrors.email" class="field-error">{{ fieldErrors.email }}</p>
          <p v-else-if="authStore.fieldErrors?.email" class="field-error">{{ authStore.fieldErrors.email }}</p>
        </div>
        <div class="field">
          <label class="field-label">{{ t('auth.password') }}</label>
          <input
            v-model="password"
            type="password"
            class="field-input"
            :class="{ 'input-error': fieldErrors.password || authStore.fieldErrors?.password }"
            placeholder="••••••••"
            maxlength="128"
            autocomplete="current-password"
          />
          <p v-if="fieldErrors.password" class="field-error">{{ fieldErrors.password }}</p>
          <p v-else-if="authStore.fieldErrors?.password" class="field-error">{{ authStore.fieldErrors.password }}</p>
        </div>
        <router-link to="/forgot-password" class="forgot-link">{{ t('auth.forgotPassword') }}</router-link>
        <LoadingButton
          type="submit"
          :loading="authStore.loading"
          :loading-text="t('auth.signingIn')"
        >
          {{ t('auth.signIn') }}
        </LoadingButton>
      </form>
      <p class="login-footer">
        {{ t('auth.noAccount') }}
        <router-link to="/register" class="login-link">{{ t('auth.register') }}</router-link>
      </p>
      <router-link to="/" class="back-link">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M10 3L5 8L10 13" stroke="#6b7280" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        {{ t('auth.backToHome') }}
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '../stores/authStore';
import LoadingButton from '../components/LoadingButton.vue';
import { validateLoginForm, sanitizeEmail } from '../utils/validators';

const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const email = ref('');
const password = ref('');
const showSuccess = ref(false);
const expiredNotice = ref(route.query.expired === '1');
const fieldErrors = reactive({ email: '', password: '' });

async function handleLogin() {
  authStore.clearErrors();
  showSuccess.value = false;

  const payload = {
    email: sanitizeEmail(email.value),
    password: password.value,
  };

  const errors = validateLoginForm(payload);
  fieldErrors.email = errors.email || '';
  fieldErrors.password = errors.password || '';
  if (fieldErrors.email || fieldErrors.password) return;

  const result = await authStore.login(payload.email, payload.password);
  if (result.success) {
    showSuccess.value = true;
    const redirect = route.query.redirect && String(route.query.redirect).startsWith('/')
      ? String(route.query.redirect)
      : '/dashboard';
    setTimeout(() => router.push(redirect), 1500);
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  padding: 24px;
}

.login-card {
  width: 100%;
  max-width: 400px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04);
  border: 1px solid #f3f4f6;
  padding: 40px 36px;
  text-align: center;
}

@media (max-width: 479px) {
  .login-page {
    padding: 16px;
  }

  .login-card {
    padding: 28px 20px;
  }
}

.login-brand {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 28px;
}

.login-brand-name {
  font-size: 22px;
  font-weight: 700;
  color: #111827;
}

.login-title {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 6px 0;
}

.login-subtitle {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 28px 0;
}

.expired-banner {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 10px;
  margin-bottom: 16px;
  font-size: 13px;
  color: #1e40af;
  text-align: left;
}

.success-banner {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 10px;
  margin-bottom: 16px;
  text-align: left;
}

.success-title {
  font-size: 14px;
  font-weight: 600;
  color: #166534;
  margin: 0;
}

.success-subtitle {
  font-size: 13px;
  color: #15803d;
  margin: 2px 0 0;
}

.error-banner {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 10px;
  margin-bottom: 16px;
  font-size: 13px;
  color: #991b1b;
  text-align: left;
}

.login-form {
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

.field-input.input-error:focus {
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
  border-color: #dc2626;
}

.field-error {
  font-size: 12px;
  color: #dc2626;
  margin: 0;
}

.forgot-link {
  align-self: flex-end;
  font-size: 13px;
  font-weight: 500;
  color: #2563eb;
  text-decoration: none;
  transition: color 0.15s;
  margin-top: -8px;
}

.forgot-link:hover {
  text-decoration: underline;
  color: #1d4ed8;
}

.login-footer {
  font-size: 14px;
  color: #6b7280;
  margin: 24px 0 16px 0;
}

.login-link {
  color: #2563eb;
  font-weight: 600;
  text-decoration: none;
}

.login-link:hover {
  text-decoration: underline;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #9ca3af;
  text-decoration: none;
  transition: color 0.15s;
}

.back-link:hover {
  color: #6b7280;
}
</style>
