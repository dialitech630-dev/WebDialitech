<template>
  <Teleport to="body">
    <div class="code-modal-overlay" @click.self="$emit('close')">
      <div class="code-modal-card">
        <div class="code-modal-header">
          <h3 class="code-modal-title">{{ title }}</h3>
          <button class="code-modal-close" @click="$emit('close')">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M4 4l10 10M14 4l-10 10" stroke="#9ca3af" stroke-width="1.5" stroke-linecap="round" />
            </svg>
          </button>
        </div>

        <div class="code-modal-body">
          <p class="code-modal-desc">{{ description }}</p>

          <div v-if="loading" class="code-loading">
            <svg class="spinner" width="28" height="28" viewBox="0 0 28 28" fill="none">
              <circle cx="14" cy="14" r="11" stroke="currentColor" stroke-width="2" stroke-dasharray="40" stroke-linecap="round"/>
            </svg>
            <p>Generating code...</p>
          </div>

          <div v-else-if="error" class="code-error">
            <p>{{ error }}</p>
            <button class="retry-btn" @click="generate">Retry</button>
          </div>

          <template v-else>
            <div class="code-display">
              <span v-for="(digit, i) in codeDigits" :key="i" class="code-digit">{{ digit }}</span>
            </div>

            <div class="code-expiry">
              <template v-if="expirySeconds !== null">
                <p>Code expires in <strong>{{ formatExpiry }}</strong></p>
              </template>
              <template v-else>
                <p>Share this code with the patient to link their device.</p>
              </template>
            </div>

            <div class="code-actions">
              <button class="action-btn" :disabled="copying" @click="copyCode">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="5" y="5" width="9" height="9" rx="1.5" stroke="currentColor" stroke-width="1.3" />
                  <path d="M11 5V3.5A1.5 1.5 0 0 0 9.5 2h-6A1.5 1.5 0 0 0 2 3.5v6A1.5 1.5 0 0 0 3.5 11H5" stroke="currentColor" stroke-width="1.3" />
                </svg>
                {{ copying ? 'Copied!' : 'Copy Code' }}
              </button>
              <button class="regenerate-btn" :disabled="regenerating" @click="generate">
                <svg v-if="regenerating" class="spinner" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5" stroke-dasharray="20" stroke-linecap="round"/>
                </svg>
                <svg v-else width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M13.5 8a5.5 5.5 0 1 1-1.6-3.9M13.5 2v3.5H10" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                Regenerate
              </button>
            </div>
          </template>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from 'vue';
import { patientService } from '../../../../services/patients/patient.service';

const props = defineProps({
  visible: { type: Boolean, default: false },
  patientId: { type: [String, Number], required: true },
  kind: { type: String, default: 'mobile' },
});

const emit = defineEmits(['close', 'generated']);

const loading = ref(false);
const regenerating = ref(false);
const copying = ref(false);
const error = ref('');
const code = ref('');
const expiresAt = ref(null);
const expirySeconds = ref(null);
const now = ref(Date.now());

const isWearable = computed(() => props.kind === 'wearable');

const title = computed(() => (isWearable.value ? 'Wearable Device Code' : 'Mobile Device Code'));
const description = computed(() =>
  isWearable.value
    ? 'Generate a code so the patient can pair their wearable device. The code is valid for a limited time.'
    : 'Generate a 6-digit code so the patient can link their device to their profile. The code is valid for a limited time.',
);

const codeDigits = computed(() => {
  const digits = code.value.replace(/\D/g, '').slice(0, 6);
  const arr = digits.split('');
  while (arr.length < 6) arr.push('·');
  return arr;
});

const formatExpiry = computed(() => {
  const s = expirySeconds.value ?? 0;
  const m = Math.floor(s / 60);
  const rest = s % 60;
  return `${m}:${rest.toString().padStart(2, '0')}`;
});

let timerId = null;

function startTimer() {
  stopTimer();
  if (expiresAt.value) {
    now.value = Date.now();
    expirySeconds.value = Math.max(0, Math.floor((expiresAt.value - now.value) / 1000));
    timerId = setInterval(() => {
      now.value = Date.now();
      expirySeconds.value = Math.max(0, Math.floor((expiresAt.value - now.value) / 1000));
      if (expirySeconds.value <= 0) {
        stopTimer();
      }
    }, 1000);
  }
}

function stopTimer() {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
}

async function generate() {
  error.value = '';
  if (loading.value || regenerating.value) return;
  if (code.value) regenerating.value = true;
  else loading.value = true;
  try {
    const { data } = isWearable.value
      ? await patientService.generateWearableCode(props.patientId)
      : await patientService.generateCode(props.patientId);
    const nextCode = data?.code ?? data?.deviceCode ?? '';
    code.value = String(nextCode).trim();
    expiresAt.value = data?.expiresAt ? new Date(data.expiresAt).getTime() : null;
    if (expiresAt.value && Number.isNaN(expiresAt.value)) expiresAt.value = null;
    expirySeconds.value = data?.expiresInSeconds ?? null;
    if (expirySeconds.value === null && expiresAt.value) {
      expirySeconds.value = Math.max(0, Math.floor((expiresAt.value - Date.now()) / 1000));
    }
    if (data?.expiresInSeconds === undefined && !expiresAt.value && !isWearable.value) {
      expirySeconds.value = 120;
    }
    startTimer();
    emit('generated', data);
  } catch (err) {
    const parsed = patientService.extractError(err);
    error.value = parsed.message;
    if (window.__toast) window.__toast.error(parsed.message);
  } finally {
    loading.value = false;
    regenerating.value = false;
  }
}

async function copyCode() {
  if (!code.value || copying.value) return;
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(code.value);
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = code.value;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    copying.value = true;
    if (window.__toast) window.__toast.success('Code copied to clipboard.');
    setTimeout(() => { copying.value = false; }, 1600);
  } catch {
    if (window.__toast) window.__toast.error('Unable to copy the code.');
  }
}

watch(
  () => props.visible,
  (v) => {
    if (v) {
      if (!code.value) generate();
    } else {
      stopTimer();
    }
  },
);

onUnmounted(stopTimer);
</script>

<style scoped>
.code-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.code-modal-card {
  background: #ffffff;
  border-radius: 16px;
  width: 100%;
  max-width: 440px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.code-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px 0;
}

.code-modal-title {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.code-modal-close {
  width: 32px;
  height: 32px;
  border: none;
  background: #f3f4f6;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  transition: background 0.15s;
}

.code-modal-close:hover {
  background: #e5e7eb;
}

.code-modal-body {
  padding: 20px 24px 24px;
}

.code-modal-desc {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 20px;
  line-height: 1.5;
}

.code-loading,
.code-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: 32px 0;
  color: #6b7280;
  font-size: 14px;
}

.code-error {
  color: #dc2626;
}

.code-error p {
  margin: 0;
}

.retry-btn {
  padding: 8px 20px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #ffffff;
  color: #374151;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.code-display {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 16px;
}

.code-digit {
  width: 44px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #f8fafc;
  font-size: 24px;
  font-weight: 700;
  color: #111827;
}

.code-expiry {
  text-align: center;
  margin-bottom: 20px;
}

.code-expiry p {
  font-size: 13px;
  color: #6b7280;
  margin: 0;
}

.code-expiry strong {
  color: #dc2626;
}

.code-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.action-btn,
.regenerate-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}

.action-btn {
  background: #2563eb;
  color: #fff;
  border: none;
}

.action-btn:hover:not(:disabled) {
  background: #1d4ed8;
}

.action-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.regenerate-btn {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #e5e7eb;
}

.regenerate-btn:hover:not(:disabled) {
  background: #e5e7eb;
}

.regenerate-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner {
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Responsive */
@media (max-width: 479px) {
  .code-digit {
    width: 36px;
    height: 48px;
    font-size: 20px;
  }

  .code-actions {
    flex-direction: column;
  }

  .action-btn,
  .regenerate-btn {
    width: 100%;
  }
}
</style>
