import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { dashboardService } from '../services/dashboardService';

function toNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

export const useDashboardStore = defineStore('dashboard', () => {
  const summary = ref(null);
  const summaryLoading = ref(false);
  const summaryError = ref('');
  const lastUpdated = ref(null);
  let summaryRequest = null;

  const selectedPatientId = ref(null);
  const patientDetail = ref(null);
  const patientDetailLoading = ref(false);
  const patientDetailError = ref('');

  const readings = ref([]);
  const readingsLoading = ref(false);
  const readingsError = ref('');
  const range = ref('30d');

  const readingsCount = computed(() => readings.value.length);

  const patients = computed(() => summary.value?.patients ?? []);
  const totalPatients = computed(() => summary.value?.totalPatients ?? 0);
  const activeAlerts = computed(() => summary.value?.activeAlerts ?? 0);
  const patientsWithDevice = computed(() => summary.value?.patientsWithDevice ?? 0);

  const averageHeartRate = computed(() => {
    const values = patients.value.map((p) => toNumber(p.lastHeartRate)).filter((v) => v > 0);
    if (!values.length) return 0;
    return Math.round(values.reduce((sum, v) => sum + v, 0) / values.length);
  });

  const selectedPatient = computed(() => {
    if (!selectedPatientId.value) return null;
    const key = String(selectedPatientId.value);
    return patients.value.find((p) => String(p.patientId) === key) ?? null;
  });

  async function fetchSummary({ force = false } = {}) {
    if (!force && (summaryLoading.value || summaryRequest)) return summaryRequest;
    summaryLoading.value = true;
    summaryError.value = '';
    summaryRequest = dashboardService
      .getSummary()
      .then(({ data }) => {
        summary.value = data ?? null;
        lastUpdated.value = new Date();
        if (!selectedPatientId.value && patients.value.length) {
          selectedPatientId.value = patients.value[0].patientId;
        }
      })
      .catch(() => {
        summaryError.value = 'No se pudieron cargar los datos del panel. El servidor puede estar no disponible.';
      })
      .finally(() => {
        summaryLoading.value = false;
        summaryRequest = null;
      });
    return summaryRequest;
  }

  async function ensureSelectedData() {
    if (!selectedPatientId.value) return;
    if (!patientDetail.value && !patientDetailLoading.value) {
      await fetchPatientDetail(selectedPatientId.value, true);
    }
    if (!readings.value.length && !readingsLoading.value) {
      await fetchReadings(selectedPatientId.value, range.value, true);
    }
  }

  async function fetchPatientDetail(id = selectedPatientId.value, force = false) {
    if (!id || (!force && patientDetailLoading.value)) return;
    patientDetailLoading.value = true;
    patientDetailError.value = '';
    try {
      const { data } = await dashboardService.getPatientStatus(id);
      patientDetail.value = data ?? null;
    } catch {
      patientDetailError.value = 'No se pudo cargar el estado del paciente.';
    } finally {
      patientDetailLoading.value = false;
    }
  }

  function dateRangeFor(filter) {
    const to = new Date();
    const from = new Date();
    if (filter === 'today') from.setHours(0, 0, 0, 0);
    else if (filter === '24h') from.setDate(to.getDate() - 1);
    else if (filter === '7d') from.setDate(to.getDate() - 7);
    else if (filter === '30d') from.setDate(to.getDate() - 30);
    return { from: from.toISOString(), to: to.toISOString() };
  }

  async function fetchReadings(id = selectedPatientId.value, activeRange = range.value, force = false) {
    if (!id || (!force && readingsLoading.value)) return;
    readingsLoading.value = true;
    readingsError.value = '';
    try {
      const r = dateRangeFor(activeRange);
      const { data } = await dashboardService.getPatientReadings(id, {
        from: r.from,
        to: r.to,
        limit: 1000,
      });
      let raw = data?.readings ?? data ?? [];
      // Ordenar cronológicamente (la API puede devolver descendente)
      raw = raw.slice().sort((a, b) => {
        const ta = new Date(a?.timestamp);
        const tb = new Date(b?.timestamp);
        return ta - tb;
      });
      readings.value = raw;
    } catch {
      readingsError.value = 'No se pudieron cargar las lecturas.';
    } finally {
      readingsLoading.value = false;
    }
  }

  async function selectPatient(id) {
    if (!id || String(id) === String(selectedPatientId.value)) return;
    selectedPatientId.value = id;
    patientDetail.value = null;
    readings.value = [];
    patientDetailError.value = '';
    readingsError.value = '';
    await Promise.all([
      fetchPatientDetail(id, true),
      fetchReadings(id, range.value, true),
    ]);
  }

  function setRange(value) {
    range.value = value;
    return fetchReadings(selectedPatientId.value, value, true);
  }

  function reset() {
    summary.value = null;
    summaryError.value = '';
    lastUpdated.value = null;
    selectedPatientId.value = null;
    patientDetail.value = null;
    patientDetailError.value = '';
    readings.value = [];
    readingsError.value = '';
  }

  return {
    summary,
    summaryLoading,
    summaryError,
    lastUpdated,
    patients,
    totalPatients,
    activeAlerts,
    patientsWithDevice,
    averageHeartRate,
    selectedPatientId,
    selectedPatient,
    patientDetail,
    patientDetailLoading,
    patientDetailError,
    readings,
    readingsCount,
    readingsLoading,
    readingsError,
    range,
    fetchSummary,
    ensureSelectedData,
    fetchPatientDetail,
    fetchReadings,
    selectPatient,
    setRange,
    reset,
  };
});
