import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { mlService } from '../services/ml/ml.service';

function errorMessageFor(err) {
  const status = err?.response?.status;
  const detail = err?.response?.data?.detail || err?.response?.data?.message;

  if (status === 401 || status === 403) {
    return 'No tienes permiso para utilizar el análisis IA.';
  }
  if (status === 404) {
    return 'El servicio de análisis IA no está disponible.';
  }
  if (status === 408 || err?.code === 'ECONNABORTED') {
    return 'El análisis está tardando demasiado. Intenta nuevamente.';
  }
  if (status === 429) {
    return 'Se alcanzó el límite de solicitudes. Intenta nuevamente más tarde.';
  }
  if (status >= 500) {
    return 'El servicio de IA no está disponible temporalmente.';
  }
  if (!err?.response) {
    return 'No fue posible conectar con el servicio de IA.';
  }
  return detail || 'No se pudo completar el análisis de IA.';
}

export const useMlStore = defineStore('ml', () => {
  const analysis = ref(null);
  const analyzing = ref(false);
  const analysisError = ref('');
  const lastUpdated = ref(null);
  const insufficientData = ref(false);
  const serviceDown = ref(false);

  // Contador de request: solo el análisis más reciente puede escribir su
  // resultado (evita race conditions al cambiar de paciente).
  let requestId = 0;

  const riskScore = computed(() => analysis.value?.risk_prediction?.score ?? null);
  const riskLevel = computed(() => analysis.value?.risk_prediction?.level ?? null);

  const trends = computed(() => analysis.value?.trends ?? {});
  const patterns = computed(() => analysis.value?.patterns ?? []);
  const anomalies = computed(() => analysis.value?.anomalies ?? []);
  const predictions = computed(() => analysis.value?.predictions ?? []);

  const hasAnalysis = computed(() => analysis.value !== null);

  async function analyzePatient(patientId, readings) {
    if (!patientId || !readings?.length) {
      // Datos insuficientes: no es un error de servidor, solo se informa.
      insufficientData.value = true;
      analysis.value = null;
      analysisError.value = '';
      return;
    }

    insufficientData.value = false;
    analysisError.value = '';

    const myId = ++requestId;
    analyzing.value = true;

    try {
      const mappedReadings = readings
        .map((r) => ({
          heartRate: r.heartRate,
          oxygen: r.oxygen,
          activity: r.activity,
          timestamp: r.timestamp,
        }))
        .filter((r) => r.timestamp || r.heartRate !== undefined);

      if (!mappedReadings.length) {
        if (myId === requestId) analyzing.value = false;
        insufficientData.value = true;
        return;
      }

      const { data } = await mlService.analyze(patientId, mappedReadings);

      if (myId !== requestId) return;
      analysis.value = data;
      lastUpdated.value = new Date();
    } catch (err) {
      if (myId !== requestId) return;
      analysis.value = null;
      analysisError.value = errorMessageFor(err);
    } finally {
      if (myId === requestId) analyzing.value = false;
    }
  }

  async function checkHealth() {
    try {
      await mlService.health();
      serviceDown.value = false;
    } catch {
      serviceDown.value = true;
    }
  }

  function reset() {
    requestId += 1;
    analysis.value = null;
    analyzing.value = false;
    analysisError.value = '';
    lastUpdated.value = null;
    insufficientData.value = false;
  }

  return {
    analysis,
    analyzing,
    analysisError,
    lastUpdated,
    insufficientData,
    serviceDown,
    riskScore,
    riskLevel,
    trends,
    patterns,
    anomalies,
    predictions,
    hasAnalysis,
    analyzePatient,
    checkHealth,
    reset,
  };
});

export default useMlStore;