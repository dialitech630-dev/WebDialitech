<template>
  <SettingsSection title="Perfil" description="Administra tu información personal y tu foto">
    <div v-if="loading" class="profile-skeleton">
      <div class="skeleton skeleton-avatar"></div>
      <div class="profile-fields">
        <div v-for="n in 3" :key="n" class="skeleton skeleton-field"></div>
      </div>
    </div>
    <div v-else-if="error" class="error-banner">
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="8" stroke="#ef4444" stroke-width="1.5"/>
        <path d="M9 5.5V9.5" stroke="#ef4444" stroke-width="1.5" stroke-linecap="round"/>
        <circle cx="9" cy="12" r="0.75" fill="#ef4444"/>
      </svg>
      <span>{{ error }}</span>
      <button class="retry-btn" @click="fetch">Reintentar</button>
    </div>
    <div v-else class="profile-layout">
      <div class="avatar-section">
        <div class="avatar-preview">
          <img v-if="form.imageUrl" :src="form.imageUrl" alt="Avatar de usuario" class="avatar-img" />
          <div v-else class="avatar-placeholder">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="4.5" stroke="#9ca3af" stroke-width="1.5" />
              <path d="M4 21C4 17.134 7.582 14 12 14C16.418 14 20 17.134 20 21" stroke="#9ca3af" stroke-width="1.5" stroke-linecap="round" />
            </svg>
          </div>
        </div>
        <button class="upload-btn" @click="$refs.avatarInput.click()">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 2V10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
            <path d="M4 6L8 2L12 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M2 12V13.5C2 14.328 2.672 15 3.5 15H12.5C13.328 15 14 14.328 14 13.5V12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
          </svg>
          Subir foto
        </button>
        <input ref="avatarInput" type="file" accept="image/*" class="file-input" @change="onAvatarSelected" />
      </div>
      <div class="profile-fields">
        <div class="field-row">
          <label class="field-label">Nombre</label>
          <div class="field-wrap">
            <input class="field-input" v-model="form.name" :disabled="saving" maxlength="60" />
            <p v-if="fieldErrors.name" class="field-error">{{ fieldErrors.name }}</p>
          </div>
        </div>
        <div class="field-row">
          <label class="field-label">Apellido</label>
          <div class="field-wrap">
            <input class="field-input" v-model="form.lastname" :disabled="saving" maxlength="60" />
            <p v-if="fieldErrors.lastname" class="field-error">{{ fieldErrors.lastname }}</p>
          </div>
        </div>
        <div class="field-row">
          <label class="field-label">Correo electrónico</label>
          <div class="field-wrap">
            <input class="field-input" :value="form.email" readonly />
          </div>
        </div>
        <div class="field-row">
          <label class="field-label">Teléfono</label>
          <div class="field-wrap">
            <input class="field-input" v-model="form.phone" :disabled="saving" maxlength="20" />
            <p v-if="fieldErrors.phone" class="field-error">{{ fieldErrors.phone }}</p>
          </div>
        </div>
        <button class="save-profile-btn" :disabled="saving" @click="save">
          <svg v-if="saving" class="spinner" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5" stroke-dasharray="28" stroke-linecap="round"/>
          </svg>
          {{ saving ? 'Guardando...' : 'Guardar cambios' }}
        </button>
      </div>
    </div>
  </SettingsSection>
</template>

<script setup>
import { ref } from 'vue';
import { useProfile } from '../../../composables/useProfile';
import SettingsSection from './SettingsSection.vue';

const { form, fieldErrors, loading, saving, error, fetch, save } = useProfile();
const avatarInput = ref(null);

const MAX_AVATAR_SIZE = 1024 * 1024;

function onAvatarSelected(e) {
  const file = e.target.files?.[0];
  if (!file) return;
  if (!file.type.startsWith('image/')) {
    if (window.__toast) window.__toast.error('Selecciona un archivo de imagen válido.');
    e.target.value = '';
    return;
  }
  if (file.size > MAX_AVATAR_SIZE) {
    if (window.__toast) window.__toast.error('La imagen es demasiado grande. El tamaño máximo es 1 MB.');
    e.target.value = '';
    return;
  }
  const reader = new FileReader();
  reader.onload = (ev) => {
    form.imageUrl = ev.target.result;
  };
  reader.readAsDataURL(file);
}
</script>

<style scoped>
.profile-layout {
  display: flex;
  gap: 32px;
  align-items: flex-start;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.avatar-preview {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid #e5e7eb;
  flex-shrink: 0;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  color: #9ca3af;
}

.upload-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 18px;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  transition: all 0.15s;
}

.upload-btn:hover {
  background: #e5e7eb;
  border-color: #d1d5db;
}

.file-input {
  display: none;
}

.profile-fields {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 400px;
}

.field-row {
  display: flex;
  align-items: center;
  gap: 16px;
}

.field-label {
  font-size: 13px;
  font-weight: 500;
  color: #6b7280;
  min-width: 110px;
  flex-shrink: 0;
}

.field-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  color: #111827;
  background: #fff;
  outline: none;
  transition: border-color 0.15s;
}

.field-input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
}

.field-input:read-only {
  background: #f9fafb;
  cursor: default;
}

.field-wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.field-wrap .field-input {
  width: 100%;
  box-sizing: border-box;
}

.field-error {
  font-size: 12px;
  color: #dc2626;
  margin: 0;
}

.save-profile-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 24px;
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
  width: fit-content;
  margin-top: 4px;
}

.save-profile-btn:hover:not(:disabled) {
  background: #1d4ed8;
}

.save-profile-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner {
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.profile-skeleton {
  display: flex;
  gap: 32px;
  align-items: flex-start;
}

.skeleton-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-field {
  height: 36px;
  border-radius: 8px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.profile-fields .skeleton-field + .skeleton-field {
  margin-top: 16px;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.error-banner {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: #fef2f2;
  border-radius: 10px;
  color: #dc2626;
  font-size: 14px;
}

.retry-btn {
  margin-left: auto;
  padding: 4px 12px;
  background: #dc2626;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}

.retry-btn:hover {
  background: #b91c1c;
}

/* Responsive */
@media (max-width: 767px) {
  .field-row {
    flex-direction: column;
    align-items: stretch;
    gap: 6px;
  }

  .field-label {
    min-width: 0;
  }

  .profile-fields {
    max-width: none;
    width: 100%;
  }

  .save-profile-btn {
    width: 100%;
  }
}
</style>
