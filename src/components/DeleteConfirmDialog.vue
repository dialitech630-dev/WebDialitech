<template>
  <Teleport to="body">
    <div v-if="visible" class="dialog-overlay" @click.self="$emit('close')">
      <div class="dialog-card">
        <div class="dialog-icon">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <rect width="40" height="40" rx="12" fill="#fef2f2" />
            <path d="M20 14v8M20 26v1" stroke="#dc2626" stroke-width="2" stroke-linecap="round" />
            <path d="M14 18c0-3.3 2.7-6 6-6s6 2.7 6 6v8c0 2.2-1.8 4-4 4h-4c-2.2 0-4-1.8-4-4v-8z" stroke="#dc2626" stroke-width="1.5" />
          </svg>
        </div>
        <h2 class="dialog-title">Eliminar paciente</h2>
        <p class="dialog-message">¿Estás seguro de que deseas eliminar a este paciente? Esta acción no se puede deshacer.</p>
        <div class="dialog-actions">
          <button class="btn-cancel" @click="$emit('close')">Cancelar</button>
          <button class="btn-delete" :disabled="deleting" @click="confirm">
            <span v-if="deleting" class="spinner-sm" />
            {{ deleting ? 'Eliminando...' : 'Eliminar' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue';
import { usePatientStore } from '../stores/patientStore';

const props = defineProps({
  visible: Boolean,
  patientId: { type: String, required: true },
});

const emit = defineEmits(['close', 'deleted']);
const patientStore = usePatientStore();
const deleting = ref(false);

async function confirm() {
  deleting.value = true;
  const result = await patientStore.remove(props.patientId);
  deleting.value = false;
  if (result.success) {
    window.__toast?.success('Paciente eliminado exitosamente', '');
    emit('deleted');
    emit('close');
  }
}
</script>

<style scoped>
.dialog-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
  padding: 24px;
}

.dialog-card {
  width: 100%;
  max-width: 400px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.2);
  padding: 32px;
  text-align: center;
}

.dialog-icon {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

.dialog-title {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 8px;
}

.dialog-message {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 24px;
  line-height: 1.5;
}

.dialog-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.btn-cancel {
  padding: 10px 24px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #ffffff;
  color: #374151;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-cancel:hover {
  background: #f9fafb;
  border-color: #d1d5db;
}

.btn-delete {
  padding: 10px 24px;
  border: none;
  border-radius: 10px;
  background: #dc2626;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn-delete:hover:not(:disabled) {
  background: #b91c1c;
}

.btn-delete:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner-sm {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
