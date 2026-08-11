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

const DEFAULT_ML_BASE_URL = 'https://dialitechmlservice-production.up.railway.app';

// Normaliza la URL base: elimina la "/" final y un sufijo "/api" que
// duplicaría el endpoint (…/api + /api/v1/analyze = …/api/api/v1/analyze).
function normalizeBaseURL(raw) {
  if (!raw) return '';
  let url = String(raw).trim().replace(/\/+$/, '');
  if (url.endsWith('/api')) url = url.slice(0, -4);
  return url;
}

// Solo se aceptan rutas relativas tipo "/ml" (dev) o URLs absolutas http(s).
// "undefined"/"null" jamás deben convertirse en una baseURL válida.
function isUsableBaseURL(url) {
  if (!url) return false;
  if (url === 'undefined' || url === 'null') return false;
  return /^\/[^/]/.test(url) || /^https?:\/\//i.test(url);
}

const configuredBaseURL = normalizeBaseURL(import.meta.env.VITE_ML_API_URL);

// Dev: siempre por el proxy de Vite (/ml -> Railway). En producción se usa la
// URL absoluta y, si VITE_ML_API_URL no se definió en el build, se cae a la
// URL conocida del servicio ML. Así nunca se genera "undefined/api/v1/analyze".
let mlBaseURL = import.meta.env.DEV
  ? '/ml'
  : configuredBaseURL || DEFAULT_ML_BASE_URL;

if (import.meta.env.DEV && !configuredBaseURL) {
  console.warn('[ml.service] VITE_ML_API_URL no está configurada.');
}

if (!isUsableBaseURL(mlBaseURL)) {
  mlBaseURL = '/ml';
}

const mlApi = axios.create({
  baseURL: mlBaseURL,
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': import.meta.env.VITE_ML_API_KEY || '',
  },
  timeout: 30000,
});

// Barrera de seguridad: rechaza de forma controlada cualquier petición que
// terminaría en una URL inválida (p. ej. "undefined/api/v1/analyze").
mlApi.interceptors.request.use((config) => {
  const target = config.baseURL || mlBaseURL;
  if (!isUsableBaseURL(target)) {
    const err = new Error('No se pudo configurar el servicio de IA.');
    err.isMlConfigError = true;
    return Promise.reject(err);
  }
  return config;
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