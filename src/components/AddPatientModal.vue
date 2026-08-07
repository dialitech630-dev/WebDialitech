<template>
  <Teleport to="body">
    <div v-if="visible" class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-card">
        <div class="modal-header">
          <h2 class="modal-title">Agregar paciente</h2>
          <button class="modal-close" @click="$emit('close')">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M4 4l10 10M14 4l-10 10" stroke="#6b7280" stroke-width="1.5" stroke-linecap="round" />
            </svg>
          </button>
        </div>

        <div v-if="error" class="error-banner">
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="10" fill="#dc2626" />
            <path d="M7 7l6 6M13 7l-6 6" stroke="#fff" stroke-width="1.5" stroke-linecap="round" />
          </svg>
          <span>{{ error }}</span>
        </div>

        <form class="modal-body" @submit.prevent="submit">
          <div class="field">
            <label class="field-label">Nombre completo</label>
            <input v-model="form.name" class="field-input" :class="{ 'input-error': fieldErrors?.name }" placeholder="Nombre del paciente" required />
            <p v-if="fieldErrors?.name" class="field-error">{{ fieldErrors.name }}</p>
          </div>
          <div class="field-row">
            <div class="field">
              <label class="field-label">Edad</label>
              <input v-model.number="form.age" type="number" class="field-input" :class="{ 'input-error': fieldErrors?.age }" placeholder="Edad" min="0" max="150" required />
              <p v-if="fieldErrors?.age" class="field-error">{{ fieldErrors.age }}</p>
            </div>
            <div class="field">
              <label class="field-label">Género</label>
              <select v-model="form.gender" class="field-input" required>
                <option value="" disabled>Seleccionar</option>
                <option>Masculino</option>
                <option>Femenino</option>
                <option>No binario</option>
                <option>Prefiero no decirlo</option>
              </select>
            </div>
          </div>
          <div class="field">
            <label class="field-label">Notas</label>
            <textarea v-model="form.notes" class="field-input field-textarea" placeholder="Notas opcionales sobre el paciente" rows="3" />
          </div>
        </form>

        <div class="modal-footer">
          <button class="btn-secondary" @click="$emit('close')">Cancelar</button>
          <LoadingButton :loading="submitting" loading-text="Guardando..." @click="submit">
            Guardar paciente
          </LoadingButton>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { reactive, ref, computed } from 'vue';
import { usePatientStore } from '../stores/patientStore';
import LoadingButton from './LoadingButton.vue';
import { sanitizeString, sanitizeText } from '../utils/validators';

const props = defineProps({
  visible: Boolean,
});

const emit = defineEmits(['close', 'created']);

const patientStore = usePatientStore();
const submitting = ref(false);

const error = computed(() => patientStore.error);
const fieldErrors = computed(() => patientStore.fieldErrors);

const form = reactive({
  name: '',
  age: null,
  gender: '',
  notes: '',
});

async function submit() {
  if (submitting.value) return;

  const name = sanitizeString(form.name);
  const age = Number(form.age);
  if (!name) {
    if (window.__toast) window.__toast.error('El nombre del paciente es obligatorio.');
    return;
  }
  if (!form.gender) {
    if (window.__toast) window.__toast.error('Selecciona un género.');
    return;
  }
  if (!Number.isFinite(age) || age < 0 || age > 150) {
    if (window.__toast) window.__toast.error('Ingresa una edad válida entre 0 y 150.');
    return;
  }

  submitting.value = true;
  patientStore.clearErrors();
  try {
    const result = await patientStore.create({
      name,
      age,
      gender: form.gender,
      notes: sanitizeText(form.notes),
    });
    if (result.success) {
      window.__toast?.success('Paciente creado exitosamente', '');
      emit('created');
      emit('close');
      form.name = '';
      form.age = null;
      form.gender = '';
      form.notes = '';
    }
  } finally {
    submitting.value = false;
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 24px;
}

.modal-card {
  width: 100%;
  max-width: 480px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 28px 0;
}

.modal-title {
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.modal-close {
  width: 36px;
  height: 36px;
  border: none;
  background: #f3f4f6;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
}

.modal-close:hover {
  background: #e5e7eb;
}

.error-banner {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 16px 28px 0;
  padding: 12px 16px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 10px;
  font-size: 13px;
  color: #991b1b;
}

.modal-body {
  padding: 20px 28px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}

.field-row {
  display: flex;
  gap: 16px;
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

.field-textarea {
  resize: vertical;
  min-height: 72px;
  font-family: inherit;
}

.field-error {
  font-size: 12px;
  color: #dc2626;
  margin: 0;
}

.modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 28px 24px;
}

.btn-secondary {
  padding: 10px 20px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #ffffff;
  color: #374151;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-secondary:hover {
  background: #f9fafb;
  border-color: #d1d5db;
}

/* Responsive */
@media (max-width: 767px) {
  .field-row {
    flex-direction: column;
    gap: 16px;
  }

  .modal-header {
    padding: 20px 20px 0;
  }

  .modal-body {
    padding: 16px 20px;
  }

  .modal-footer {
    padding: 12px 20px 20px;
  }
}
</style>
