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
        <h2 class="left-title">Secure Password<br />Recovery</h2>
        <p class="left-desc">Enter your email or phone number. If the account exists, you can set a new password right away — no code required.</p>
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

        <h1 class="forgot-title">{{ step === 'reset' ? 'Set New Password' : 'Forgot Password' }}</h1>
        <p v-if="step === 'identify'" class="forgot-subtitle">Enter the email address or phone number associated with your account.</p>
        <p v-else class="forgot-subtitle">Create a new password for <strong class="identifier-inline">{{ identifier }}</strong>.</p>

        <p v-if="successMsg" class="success-msg">{{ successMsg }}</p>

        <ForgotPasswordForm
          v-if="step === 'identify'"
          ref="identifierFormRef"
          :loading="loading"
          :error="error"
          @submit="handleIdentify"
        />

        <template v-else>
          <RecoveryPasswordForm
            ref="passwordFormRef"
            :loading="loading"
            :error="error"
            @submit="handleReset"
          />
        </template>

        <div class="forgot-footer">
          <button v-if="step === 'reset'" type="button" class="link-btn" :disabled="loading" @click="goBack">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8L10 13" stroke="#6b7280" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            Use a different account
          </button>
          <router-link to="/login" class="back-link">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8L10 13" stroke="#6b7280" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            Back to Login
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { recoveryService } from '../../../services/auth/recovery.service';
import ForgotPasswordForm from '../components/ForgotPasswordForm.vue';
import RecoveryPasswordForm from '../components/RecoveryPasswordForm.vue';

const router = useRouter();
const step = ref('identify');
const identifier = ref('');
const loading = ref(false);
const error = ref('');
const successMsg = ref('');

const identifierFormRef = ref(null);
const passwordFormRef = ref(null);

function showError(message) {
  error.value = message;
  if (message && window.__toast) window.__toast.error(message);
}

async function handleIdentify() {
  const payload = identifierFormRef.value?.getPayload();
  if (!payload || loading.value) return;

  loading.value = true;
  error.value = '';
  successMsg.value = '';

  try {
    await recoveryService.verifyIdentifier(payload);
    identifier.value = payload.identifier;
    if (window.__toast) window.__toast.success('Account found. Choose your new password.');
    step.value = 'reset';
  } catch (err) {
    showError(recoveryService.extractError(err).message);
  } finally {
    loading.value = false;
  }
}

async function handleReset() {
  const payload = passwordFormRef.value?.getPayload();
  if (!payload || loading.value) return;

  loading.value = true;
  error.value = '';
  successMsg.value = '';

  try {
    await recoveryService.resetPassword({
      identifier: identifier.value,
      newPassword: payload.newPassword,
    });
    successMsg.value = 'Password updated successfully. Redirecting to login...';
    if (window.__toast) window.__toast.success('Password updated successfully.');
    setTimeout(() => router.push('/login'), 1800);
  } catch (err) {
    showError(recoveryService.extractError(err).message);
  } finally {
    loading.value = false;
  }
}

function goBack() {
  error.value = '';
  successMsg.value = '';
  step.value = 'identify';
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

.identifier-inline {
  color: #374151;
  font-weight: 600;
  word-break: break-all;
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

.forgot-footer {
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.link-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  padding: 0;
  font-size: 13px;
  color: #6b7280;
  cursor: pointer;
  transition: color 0.15s;
}

.link-btn:hover:not(:disabled) {
  color: #374151;
}

.link-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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
