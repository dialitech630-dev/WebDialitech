import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { mlService } from '../services/ml/ml.service';

function errorMessageFor(err) {
  if (err?.isMlConfigError) {
    return 'No se pudo configurar el servicio de IA.';
  }

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

const MIN_READINGS = 12;

/**
 * Normaliza la respuesta del microservicio de ML a la estructura que consumen
 * los componentes del dashboard. Soporta tanto el formato actual del backend
 * (camelCase: riskPrediction, trendAnalysis, patternDetection, anomalyDetection)
 * como versiones anteriores con snake_case.
 */
function normalizeMlResponse(data) {
  if (!data || typeof data !== 'object') return null;

  const riskPred = data.riskPrediction ?? data.risk_prediction ?? {};
  const trendAnalysis = data.trendAnalysis ?? data.trends ?? {};
  const patternDetection = data.patternDetection ?? {};
  const anomalyDetection = data.anomalyDetection ?? {};

  // Normaliza trends: extrae la dirección de los objetos del backend
  // { direction, slope, confidence } -> "STABLE" | "ASCENDING" | "DESCENDING"
  const trends = {};
  Object.entries(trendAnalysis).forEach(([key, val]) => {
    if (typeof val === 'object' && val !== null && val.direction) {
      trends[key] = val.direction;
    } else {
      trends[key] = val;
    }
  });

  // Normaliza patterns: extrae del array anidado patternDetection.patterns
  const patterns = patternDetection.patterns ?? data.patterns ?? [];

  // Normaliza anomalies: convierte anomalyDetection (objeto) a array
  const anomalies = [];
  if (Array.isArray(data.anomalies)) {
    anomalies.push(...data.anomalies);
  } else if (anomalyDetection.anomalyDetected) {
    const indexes = anomalyDetection.affectedReadingsIndexes || [];
    anomalies.push({
      description: `Anomalía detectada en lecturas: ${indexes.length ? indexes.join(', ') : 'índices desconocidos'}`,
      zScore: anomalyDetection.anomalyScore,
    });
  }

  const predictions = data.predictions ?? [];

  return {
    patientId: data.patientId,
    modelVersion: data.modelVersion,
    risk_prediction: {
      score: riskPred.riskScore ?? riskPred.score,
      level: riskPred.riskLevel ?? riskPred.level,
      recommendation: riskPred.recommendation,
    },
    trends,
    patterns,
    anomalies,
    predictions,
  };
}

export const useMlStore = defineStore('ml', () => {
  const analysis = ref(null);
  const analyzing = ref(false);
  const analysisError = ref('');
  const lastUpdated = ref(null);
  const insufficientData = ref(false);
  const serviceDown = ref(false);
  const insufficientReason = ref('');

  // Contador de request: solo el análisis más reciente puede escribir su
  // resultado (evita race conditions al cambiar de paciente).
  let requestId = 0;

  const riskScore = computed(() => analysis.value?.risk_prediction?.score ?? null);
  const riskLevel = computed(() => analysis.value?.risk_prediction?.level ?? null);
  const riskRecommendation = computed(() => analysis.value?.risk_prediction?.recommendation ?? null);

  const trends = computed(() => analysis.value?.trends ?? {});
  const patterns = computed(() => analysis.value?.patterns ?? []);
  const anomalies = computed(() => analysis.value?.anomalies ?? []);
  const predictions = computed(() => analysis.value?.predictions ?? []);

  const hasAnalysis = computed(() => analysis.value !== null);
  const modelVersion = computed(() => analysis.value?.modelVersion ?? null);

  async function analyzePatient(patientId, readings) {
    if (!patientId || !readings?.length) {
      insufficientData.value = true;
      insufficientReason.value = 'Se necesitan al menos 12 lecturas para realizar el análisis de IA.';
      analysis.value = null;
      analysisError.value = '';
      return;
    }

    if (readings.length < MIN_READINGS) {
      insufficientData.value = true;
      insufficientReason.value = `Se necesitan al menos ${MIN_READINGS} lecturas para realizar el análisis de IA. Actualmente hay ${readings.length}.`;
      analysis.value = null;
      analysisError.value = '';
      return;
    }

    insufficientData.value = false;
    insufficientReason.value = '';
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
        insufficientReason.value = 'Se necesitan al menos 12 lecturas para realizar el análisis de IA.';
        return;
      }

      const { data } = await mlService.analyze(patientId, mappedReadings);

      if (myId !== requestId) return;
      analysis.value = normalizeMlResponse(data);
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
    insufficientReason.value = '';
  }

  return {
    analysis,
    analyzing,
    analysisError,
    lastUpdated,
    insufficientData,
    insufficientReason,
    serviceDown,
    riskScore,
    riskLevel,
    riskRecommendation,
    trends,
    patterns,
    anomalies,
    predictions,
    hasAnalysis,
    modelVersion,
    analyzePatient,
    checkHealth,
    reset,
  };
});

export default useMlStore;
