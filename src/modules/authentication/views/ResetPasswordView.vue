<template>
  <div class="forgot-page">
    <div class="forgot-left">
      <div class="left-content">
        <div class="left-brand">
          <svg width="36" height="36" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="#2563eb" />
            <path d="M8 16C8 11.5817 11.5817 8 16 8V24C11.5817 24 8 20.4183 8 16Z" fill="#fff" fill-opacity="0.9" />
            <path d="M16 8C20.4183 8 24 11.5817 24 16S20.4183 24 16 24" stroke="#fff" stroke-width="1.5" stroke-linecap="round" />
            <circle cx="16" cy="16" r="3" fill="#fff" />
          </svg>
          <span class="left-brand-name">DiaMonitor</span>
        </div>
        <div class="left-illustration">
          <svg width="320" height="280" viewBox="0 0 320 280" fill="none">
            <rect x="40" y="30" width="240" height="180" rx="16" fill="#eff6ff" />
            <rect x="60" y="50" width="200" height="12" rx="6" fill="#dbeafe" />
            <rect x="60" y="74" width="140" height="10" rx="5" fill="#e5e7eb" />
            <rect x="60" y="94" width="160" height="10" rx="5" fill="#e5e7eb" />
            <circle cx="80" cy="130" r="18" fill="#dbeafe" />
            <rect x="106" y="118" width="100" height="10" rx="5" fill="#e5e7eb" />
            <rect x="106" y="136" width="70" height="8" rx="4" fill="#f3f4f6" />
            <circle cx="80" cy="180" r="18" fill="#dbeafe" />
            <rect x="106" y="168" width="100" height="10" rx="5" fill="#e5e7eb" />
            <rect x="106" y="186" width="70" height="8" rx="4" fill="#f3f4f6" />
            <path d="M80 210L120 240H40L80 210Z" fill="#dbeafe" />
            <rect x="200" y="120" width="60" height="60" rx="12" fill="#2563eb" fill-opacity="0.1" />
            <path d="M220 140L228 148L236 140" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M228 148V160" stroke="#2563eb" stroke-width="2" stroke-linecap="round" />
            <rect x="50" y="220" width="20" height="20" rx="4" fill="#2563eb" fill-opacity="0.08" />
            <rect x="82" y="220" width="20" height="20" rx="4" fill="#2563eb" fill-opacity="0.08" />
            <rect x="114" y="220" width="20" height="20" rx="4" fill="#2563eb" fill-opacity="0.08" />
          </svg>
        </div>
        <h2 class="left-title">Reset Your<br />Password</h2>
        <p class="left-desc">Enter the recovery code and create a new password for your account.</p>
      </div>
    </div>

    <div class="forgot-right">
      <div class="forgot-card">
        <div class="forgot-brand">
          <svg width="40" height="40" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="#2563eb" />
            <path d="M8 16C8 11.5817 11.5817 8 16 8V24C11.5817 24 8 20.4183 8 16Z" fill="#fff" fill-opacity="0.9" />
            <path d="M16 8C20.4183 8 24 11.5817 24 16S20.4183 24 16 24" stroke="#fff" stroke-width="1.5" stroke-linecap="round" />
            <circle cx="16" cy="16" r="3" fill="#fff" />
          </svg>
          <span class="forgot-brand-name">DiaMonitor</span>
        </div>

        <h1 class="forgot-title">Reset Password</h1>
        <p class="forgot-subtitle">We sent a 6-digit code to your email. Enter it with your new password below.</p>

        <p v-if="error" class="error-msg">{{ error }}</p>
        <p v-if="successMsg" class="success-msg">{{ successMsg }}</p>

        <form class="reset-form" @submit.prevent="handleReset">
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
          <div class="field">
            <label class="field-label">Recovery Code</label>
            <input
              v-model="code"
              type="text"
              class="field-input"
              placeholder="000000"
              maxlength="6"
              required
            />
          </div>
          <div class="field">
            <label class="field-label">New Password</label>
            <input
              v-model="newPassword"
              type="password"
              class="field-input"
              placeholder="••••••••"
              required
              minlength="8"
            />
          </div>
          <div class="field">
            <label class="field-label">Confirm Password</label>
            <input
              v-model="confirmPassword"
              type="password"
              class="field-input"
              placeholder="••••••••"
              required
              minlength="8"
            />
          </div>

          <p v-if="passwordError" class="field-error">{{ passwordError }}</p>

          <button type="submit" class="submit-btn" :disabled="loading || !isValid">
            {{ loading ? 'Resetting...' : 'Reset Password' }}
          </button>
        </form>

        <div class="forgot-footer">
          <router-link to="/forgot-password" class="back-link">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8L10 13" stroke="#6b7280" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            Back to Forgot Password
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '../../../services/auth/auth.service';

const router = useRouter();
const email = ref('');
const code = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const loading = ref(false);
const error = ref('');
const successMsg = ref('');

const passwordError = computed(() => {
  if (!confirmPassword.value) return '';
  if (newPassword.value !== confirmPassword.value) return 'Passwords do not match';
  if (newPassword.value.length < 8) return 'Password must be at least 8 characters';
  return '';
});

const isValid = computed(() => {
  return email.value
    && code.value.length === 6
    && newPassword.value.length >= 8
    && newPassword.value === confirmPassword.value;
});

async function handleReset() {
  if (!isValid.value) return;

  loading.value = true;
  error.value = '';
  successMsg.value = '';

  try {
    await authService.resetPassword({
      email: email.value.trim(),
      code: code.value,
      newPassword: newPassword.value,
    });
    successMsg.value = 'Password reset successfully. Redirecting to login...';
    setTimeout(() => router.push('/login'), 2000);
  } catch (err) {
    error.value = err.response?.data?.message || err.response?.data?.error?.message || err.message || 'Failed to reset password. Please try again.';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.forgot-page {
  min-height: 100vh;
  display: flex;
  background: #f8f9fa;
}

.forgot-left {
  width: 45%;
  min-width: 440px;
  background: linear-gradient(135deg, #f0f5ff 0%, #e8f0fe 50%, #f8f9fa 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 40px;
  position: relative;
  overflow: hidden;
}

.forgot-left::before {
  content: '';
  position: absolute;
  top: -120px;
  right: -120px;
  width: 360px;
  height: 360px;
  border-radius: 50%;
  background: rgba(37, 99, 235, 0.04);
}

.forgot-left::after {
  content: '';
  position: absolute;
  bottom: -80px;
  left: -80px;
  width: 260px;
  height: 260px;
  border-radius: 50%;
  background: rgba(37, 99, 235, 0.03);
}

.left-content {
  max-width: 380px;
  position: relative;
  z-index: 1;
}

.left-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 48px;
}

.left-brand-name {
  font-size: 20px;
  font-weight: 700;
  color: #111827;
}

.left-illustration {
  margin-bottom: 36px;
}

.left-title {
  font-size: 28px;
  font-weight: 700;
  color: #111827;
  line-height: 1.3;
  margin: 0 0 14px 0;
  letter-spacing: -0.3px;
}

.left-desc {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.7;
  margin: 0;
}

.forgot-right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.forgot-card {
  width: 100%;
  max-width: 420px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04);
  border: 1px solid #f3f4f6;
  padding: 40px 36px;
  text-align: center;
}

.forgot-brand {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 28px;
}

.forgot-brand-name {
  font-size: 22px;
  font-weight: 700;
  color: #111827;
}

.forgot-title {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 6px 0;
}

.forgot-subtitle {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 28px 0;
  line-height: 1.5;
}

.error-msg {
  color: #ef4444;
  font-size: 13px;
  margin: 0 0 16px;
  padding: 10px 14px;
  background: #fef2f2;
  border-radius: 8px;
}

.success-msg {
  color: #059669;
  font-size: 13px;
  margin: 0 0 16px;
  padding: 10px 14px;
  background: #ecfdf5;
  border-radius: 8px;
}

.reset-form {
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

.field-error {
  color: #ef4444;
  font-size: 12px;
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

.forgot-footer {
  margin-top: 24px;
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

/* Responsive */
@media (max-width: 1023px) {
  .forgot-left {
    display: none;
  }

  .forgot-right {
    padding: 24px 16px;
  }

  .forgot-card {
    padding: 28px 20px;
  }
}
</style>
