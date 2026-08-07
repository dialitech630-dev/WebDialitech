<template>
  <SettingsSection title="Seguridad" description="Administra tu seguridad y autenticación">
    <div class="security-list">
      <div class="security-row">
        <div class="security-info">
          <span class="security-label">Cambiar contraseña</span>
          <span class="security-desc">Actualiza tu contraseña actual</span>
        </div>
        <button class="action-btn" @click="showForm = !showForm">
          {{ showForm ? 'Cerrar' : 'Cambiar' }}
        </button>
      </div>

      <form v-if="showForm" class="password-form" @submit.prevent="submit">
        <div class="field">
          <label class="field-label">Contraseña actual</label>
          <input
            v-model="form.currentPassword"
            type="password"
            class="field-input"
            required
            placeholder="••••••••"
          />
        </div>
        <div class="field">
          <label class="field-label">Nueva contraseña</label>
          <input
            v-model="form.newPassword"
            type="password"
            class="field-input"
            required
            :minlength="minLength"
            placeholder="••••••••"
          />
        </div>
        <div class="field">
          <label class="field-label">Confirmar nueva contraseña</label>
          <input
            v-model="form.confirmPassword"
            type="password"
            class="field-input"
            required
            :minlength="minLength"
            placeholder="••••••••"
          />
        </div>

        <p v-if="passwordError" class="field-error">{{ passwordError }}</p>
        <p v-if="formError" class="field-error">{{ formError }}</p>

        <button type="submit" class="submit-btn" :disabled="saving || !isValid">
          <svg v-if="saving" class="spinner" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5" stroke-dasharray="28" stroke-linecap="round"/>
          </svg>
          {{ saving ? 'Actualizando...' : 'Actualizar contraseña' }}
        </button>
      </form>

      <div class="security-row">
        <div class="security-info">
          <span class="security-label">Autenticación de dos factores</span>
          <span class="security-desc">Agrega una capa extra de seguridad</span>
        </div>
        <span class="unavailable-badge">Próximamente</span>
      </div>
    </div>
  </SettingsSection>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import SettingsSection from './SettingsSection.vue';
import { authService } from '../../../services/auth/auth.service';
import { isStrongPassword } from '../../../utils/validators';
import { PASSWORD_POLICY } from '../../../config/security';

const minLength = PASSWORD_POLICY.MIN_LENGTH;
const showForm = ref(false);
const saving = ref(false);
const formError = ref('');

const form = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
});

const passwordError = computed(() => {
  if (form.newPassword && !isStrongPassword(form.newPassword)) return `La contraseña debe tener entre ${PASSWORD_POLICY.MIN_LENGTH} y ${PASSWORD_POLICY.MAX_LENGTH} caracteres sin espacios`;
  if (form.confirmPassword && form.newPassword !== form.confirmPassword) return 'Las contraseñas no coinciden';
  return '';
});

const isValid = computed(() => {
  return form.currentPassword
    && isStrongPassword(form.newPassword)
    && form.newPassword === form.confirmPassword;
});

async function submit() {
  if (!isValid.value) return;
  saving.value = true;
  formError.value = '';
  try {
    await authService.changePassword({
      currentPassword: form.currentPassword,
      newPassword: form.newPassword,
    });
    form.currentPassword = '';
    form.newPassword = '';
    form.confirmPassword = '';
    showForm.value = false;
    if (window.__toast) window.__toast.success('Contraseña actualizada exitosamente.');
  } catch (err) {
    const msg = err.response?.data?.message || err.response?.data?.title || err.response?.data?.error?.message || 'No se pudo actualizar la contraseña.';
    formError.value = msg;
    if (window.__toast) window.__toast.error(msg);
  } finally {
    saving.value = false;
  }
}
</script>

<style scoped>
.security-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.security-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #f3f4f6;
}

.security-row:last-child {
  border-bottom: none;
}

.security-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.security-label {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}

.security-desc {
  font-size: 12px;
  color: #9ca3af;
}

.action-btn {
  padding: 6px 16px;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
}

.action-btn:hover {
  background: #e5e7eb;
}

.unavailable-badge {
  font-size: 12px;
  font-weight: 600;
  color: #9ca3af;
  background: #f3f4f6;
  padding: 4px 12px;
  border-radius: 8px;
}

.password-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 16px 0;
  border-bottom: 1px solid #f3f4f6;
  max-width: 400px;
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
  padding: 10px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  color: #111827;
  background: #fff;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.field-input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.field-error {
  color: #ef4444;
  font-size: 12px;
  margin: 0;
}

.submit-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 20px;
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
  width: fit-content;
}

.submit-btn:hover:not(:disabled) {
  background: #1d4ed8;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner {
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
