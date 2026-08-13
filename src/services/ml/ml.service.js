import axios from 'axios';

/**
 * Servicio HTTP del microservicio de Machine Learning (DiaMonitor).
 *
 * Se usa una instancia axios DEDICADA (y no la de src/services/api.js) porque
 * el servicio ML:
 *   - vive en un origen distinto,
 *   - se autentica con X-API-Key (inyectada server-side por Netlify Function),
 *   - no debe disparar los interceptores de la app (session-expired, retries,
 *     toasts de servidor core), que solo aplican al backend principal.
 * Por eso NO se reutilizan los interceptores centrales.
 *
 * ARQUITECTURA DE SEGURIDAD:
 *   - El cliente llama a /ml/* (same-origin via Netlify redirect)
 *   - Netlify Function (ml-proxy) recibe la petición, inyecta X-API-Key desde
 *     variable de entorno del servidor (ML_API_KEY), y reenvía al servicio ML
 *   - La API key NUNCA llega al bundle del navegador ni al cliente
 *   - En desarrollo: Vite proxy /ml -> Netlify Function local (netlify dev)
 *   - En producción: Netlify redirect /ml/* -> /.netlify/functions/ml-proxy/*
 */

// En desarrollo usamos el proxy de Vite configurado en vite.config.js
// En producción usamos el redirect de Netlify /api/ml/* -> /.netlify/functions/ml-proxy/*
const ML_BASE_URL = '/ml';

const mlApi = axios.create({
  baseURL: ML_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    // X-API-Key se inyecta server-side en la Netlify Function ml-proxy
    // NO se envía desde el cliente (seguridad: la key no expuesta en bundle)
  },
  timeout: 30000,
});

// Barrera de seguridad: valida que la baseURL sea usable
mlApi.interceptors.request.use((config) => {
  const target = config.baseURL || ML_BASE_URL;
  if (!target || target === 'undefined' || target === 'null') {
    const err = new Error('No se pudo configurar el servicio de IA.');
    err.isMlConfigError = true;
    return Promise.reject(err);
  }
  return config;
});

// Manejo de errores específico para el proxy ML
mlApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;

      if (status === 401 || status === 403) {
        const err = new Error('No tienes permiso para utilizar el análisis IA.');
        err.isMlConfigError = true;
        return Promise.reject(err);
      }

      if (status === 404) {
        const err = new Error('El servicio de análisis IA no está disponible.');
        err.isMlConfigError = true;
        return Promise.reject(err);
      }

      if (status === 429) {
        const err = new Error('Se alcanzó el límite de solicitudes. Intenta nuevamente más tarde.');
        err.isMlConfigError = true;
        return Promise.reject(err);
      }

      if (status >= 500) {
        const err = new Error('El servicio de IA no está disponible temporalmente.');
        err.isMlConfigError = true;
        return Promise.reject(err);
      }
    }

    if (!error.response) {
      const err = new Error('No fue posible conectar con el servicio de IA.');
      err.isMlConfigError = true;
      return Promise.reject(err);
    }

    return Promise.reject(error);
  }
);

export const mlService = {
  analyze(patientId, readings, windowSize = 12) {
    // Transform readings to snake_case as expected by ML service
    const payloadReadings = readings.map(r => ({
      heart_rate: r.heartRate,
      spo2: r.oxygen,
      activity: r.activity,
      timestamp: r.timestamp,
    }));
    return mlApi.post('/api/v1/analyze', {
      patient_id: patientId,
      window_size: windowSize,
      readings: payloadReadings,
    });
  },

  health() {
    return mlApi.get('/health');
  },

  modelInfo() {
    return mlApi.get('/api/v1/model-info');
  },
};

export default mlService;