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
  if (status === 422) {
    // No ocultar el error real de validación de FastAPI/Pydantic.
    if (Array.isArray(detail) && detail.length) {
      const first = detail[0];
      const loc = Array.isArray(first?.loc)
        ? first.loc.filter((p) => p !== 'body').join('.')
        : '';
      const msg = first?.msg || '';
      return loc
        ? `La solicitud de IA fue rechazada: campo "${loc}" — ${msg}.`
        : `La solicitud de IA fue rechazada: ${msg}.`;
    }
    if (typeof detail === 'string' && detail) return detail;
    return 'La solicitud de análisis de IA no cumple el formato esperado.';
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

// Ventana de análisis que se envía al ML Service. El Dashboard conserva todas
// las lecturas históricas; solo el análisis IA usa esta ventana (las últimas
// lecturas cronológicamente), que es lo que el modelo interpreta con windowSize.
const ANALYSIS_WINDOW = 12;

// Aliases aceptados por lectura. El dashboard puede devolver nombres en
// camelCase o snake_case; el ML Service solo acepta camelCase.
const READING_FIELDS = {
  heartRate: ['heartRate', 'heart_rate', 'hr'],
  oxygen: ['oxygen', 'spo2', 'spo_2', 'o2'],
  activity: ['activity'],
  timestamp: ['timestamp', 'recordedAt', 'recorded_at', 'date'],
};

function pickField(reading, keys) {
  if (!reading || typeof reading !== 'object') return undefined;
  for (const key of keys) {
    const value = reading[key];
    if (value !== undefined && value !== null && value !== '') return value;
  }
  return undefined;
}

function toFiniteNumber(value) {
  if (value === undefined || value === null || value === '') return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function toIsoTimestamp(value) {
  if (value === undefined || value === null || value === '') return null;
  const d = value instanceof Date ? value : new Date(value);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

/**
 * Mapper explícito lectura -> payload del ML Service.
 * Valida y normaliza cada campo; devuelve null si la lectura es inválida.
 * Nunca inventa valores: no sustituye heartRate/oxygen/activity ausentes.
 */
function toMlReading(reading) {
  const heartRate = toFiniteNumber(pickField(reading, READING_FIELDS.heartRate));
  const oxygen = toFiniteNumber(pickField(reading, READING_FIELDS.oxygen));
  const activity = toFiniteNumber(pickField(reading, READING_FIELDS.activity));
  const timestamp = toIsoTimestamp(pickField(reading, READING_FIELDS.timestamp));

  if (heartRate === null || oxygen === null || activity === null || timestamp === null) {
    return null;
  }
  return { heartRate, oxygen, activity, timestamp };
}

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
      // Mapper + validación: descarta lecturas inválidas (campos ausentes,
      // no numéricos o timestamps inválidos). NO se inventan valores.
      const validReadings = [];
      let missingActivity = 0;
      let invalidCount = 0;
      for (const r of readings) {
        const mapped = toMlReading(r);
        if (mapped) {
          validReadings.push(mapped);
        } else {
          invalidCount += 1;
          if (pickField(r, READING_FIELDS.activity) === undefined) missingActivity += 1;
        }
      }

      if (validReadings.length < MIN_READINGS) {
        if (myId === requestId) analyzing.value = false;
        insufficientData.value = true;
        if (missingActivity > 0) {
          insufficientReason.value = `No hay suficientes lecturas completas para el análisis de IA. ${missingActivity} lectura(s) no incluyen el dato de actividad requerido por el modelo.`;
        } else if (invalidCount > 0) {
          insufficientReason.value = `No hay suficientes lecturas válidas para el análisis de IA. Se descartaron ${invalidCount} lectura(s) con datos incompletos.`;
        } else {
          insufficientReason.value = `Se necesitan al menos ${MIN_READINGS} lecturas para realizar el análisis de IA. Actualmente hay ${readings.length}.`;
        }
        analysis.value = null;
        analysisError.value = '';
        return;
      }

      // Ventana de análisis: las últimas `ANALYSIS_WINDOW` lecturas válidas
      // ordenadas cronológicamente (estado actual). Las 783 del dashboard
      // permanecen intactas para gráficas y línea del tiempo.
      const sortedReadings = validReadings
        .slice()
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      const windowReadings = sortedReadings.slice(-ANALYSIS_WINDOW);

      if (import.meta.env.DEV) {
        const safePayload = {
          patientId,
          windowSize: ANALYSIS_WINDOW,
          readingsCount: windowReadings.length,
          totalValidReadings: validReadings.length,
          firstReading: windowReadings[0] ?? null,
          lastReading: windowReadings[windowReadings.length - 1] ?? null,
        };
        console.info('[ml] analyze request (debug seguro, sin secretos):', safePayload);
      }

      const { data } = await mlService.analyze(patientId, windowReadings);

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
