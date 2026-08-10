import axios from 'axios';

/**
 * Servicio HTTP del microservicio de Machine Learning (DiaMonitor).
 *
 * Se usa una instancia axios DEDICADA (y no la de src/services/api.js) porque
 * el servicio ML:
 *   - vive en un origen distinto,
 *   - se autentica con X-API-Key (no con el JWT de la app),
 *   - no debe disparar los interceptores de la app (session-expired, retries,
 *     toasts de servidor core), que solo aplican al backend principal.
 * Por eso NO se reutilizan los interceptores centrales.
 *
 * El KEY: en modo development la petición va por el proxy de Vite
 * (/ml -> railway), y en producción por el redirect de Netlify (/ml/*) o bien
 * contra VITE_ML_API_URL directamente.
 *
 * NOTA DE SEGURIDAD: VITE_ML_API_KEY es una variable VITE_* y, por tanto, se
 * incluye en el bundle del frontend → NO es un secreto real en producción.
 * La clave queda expuesta al cliente. La forma segura sería enrutar
 * Frontend -> backend/proxy propio -> ML Service inyectando la clave en el
 * servidor; como hoy no existe ese proxy, se envía desde el cliente a
 * sabiendas (ver README / .env.example).
 */

const mlBaseURL = import.meta.env.DEV
  ? '/ml'
  : `${import.meta.env.VITE_ML_API_URL}`;

const mlApi = axios.create({
  baseURL: mlBaseURL,
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': import.meta.env.VITE_ML_API_KEY || '',
  },
  timeout: 30000,
});

export const mlService = {
  analyze(patientId, readings, windowSize = 12) {
    return mlApi.post('/api/v1/analyze', {
      patientId,
      windowSize,
      readings,
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