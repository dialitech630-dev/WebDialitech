import { defineStore } from 'pinia';
import { ref } from 'vue';
import { patientService } from '../services/patients/patient.service';

export const usePatientStore = defineStore('patients', () => {
  const patients = ref([]);
  const currentPatient = ref(null);
  const loading = ref(false);
  const loadingDetail = ref(false);
  const error = ref('');
  const fieldErrors = ref({});

  async function fetchAll() {
    loading.value = true;
    error.value = '';
    try {
      const { data } = await patientService.getAll();
      patients.value = (data || []).map(normalizePatient);
    } catch (err) {
      const parsed = patientService.extractError(err);
      error.value = parsed.message;
    } finally {
      loading.value = false;
    }
  }

  async function fetchById(id) {
    loadingDetail.value = true;
    error.value = '';
    try {
      const { data } = await patientService.getById(id);
      currentPatient.value = normalizePatient(data);
    } catch (err) {
      const parsed = patientService.extractError(err);
      error.value = parsed.message;
    } finally {
      loadingDetail.value = false;
    }
  }

  async function create(data) {
    error.value = '';
    fieldErrors.value = {};
    try {
      const { data: newPatient } = await patientService.create(data);
      patients.value.push(normalizePatient(newPatient));
      return { success: true };
    } catch (err) {
      const parsed = patientService.extractError(err);
      error.value = parsed.message;
      fieldErrors.value = parsed.fields;
      return { success: false, error: parsed.message, fields: parsed.fields };
    }
  }

  async function remove(id) {
    error.value = '';
    try {
      await patientService.delete(id);
      patients.value = patients.value.filter((p) => p.id !== id);
      return { success: true };
    } catch (err) {
      const parsed = patientService.extractError(err);
      error.value = parsed.message;
      return { success: false, error: parsed.message };
    }
  }

  function clearErrors() {
    error.value = '';
    fieldErrors.value = {};
  }

  function clear() {
    patients.value = [];
    currentPatient.value = null;
    error.value = '';
    fieldErrors.value = {};
    loading.value = false;
    loadingDetail.value = false;
  }

  return {
    patients, currentPatient, loading, loadingDetail, error, fieldErrors,
    fetchAll, fetchById, create, remove, clearErrors, clear,
  };
});

function normalizePatient(p) {
  return {
    id: p.id,
    name: p.name || 'Unknown',
    age: p.age || 0,
    gender: p.gender || '',
    status: p.lastHeartRate ? 'Active' : 'Normal',
    doctor: '',
    lastSession: p.lastReadingAt ? p.lastReadingAt.split('T')[0] : 'N/A',
    nextSession: 'N/A',
    notes: p.notes || '',
    diagnosis: '',
    bloodType: '',
    phone: '',
    email: '',
    address: '',
    treatment: '',
    deviceSerialNumber: p.deviceSerialNumber,
    lastHeartRate: p.lastHeartRate,
    lastOxygen: p.lastOxygen,
    lastActivity: p.lastActivity,
    lastReadingAt: p.lastReadingAt,
    createdAt: p.createdAt,
    emergencyContact: { name: '', relationship: '', phone: '' },
    medications: [],
    vitalSigns: [],
    history: [],
    alerts: [],
  };
}
