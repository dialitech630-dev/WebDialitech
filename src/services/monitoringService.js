import api from './api';

/**
 * Patient Monitoring service.
 *
 * Declares the endpoints the real backend is expected to expose so the
 * monitoring dashboard can switch from simulated to live data without
 * touching any component. Currently every endpoint may return 404 — the
 * `useMonitoringData` composable falls back to `src/data/mockMonitoring.js`.
 *
 * Expected response shape (each endpoint):
 *   GET /dashboard/monitoring/vitals                -> { labels: [], heartRate: [], oxygen: [], temperature: [] }
 *   GET /dashboard/monitoring/blood-pressure        -> { labels: [], systolic: [], diastolic: [] }
 *   GET /dashboard/monitoring/glucose               -> { labels: [], values: [] }
 *   GET /dashboard/monitoring/weight                -> { labels: [], values: [], changes: [{ index, value, label }] }
 *   GET /dashboard/monitoring/dialysis-sessions     -> { labels: [], sessions: [] }
 *   GET /dashboard/monitoring/alerts-distribution   -> [{ name, value }]
 *   GET /dashboard/monitoring/device-status         -> [{ name, value }]
 *   GET /dashboard/monitoring/patients/realtime     -> [{ id, name, connected, lastHeartRate, lastOxygen, sparkline }]
 */
export const monitoringService = {
  getVitals(params) {
    return api.get('/dashboard/monitoring/vitals', { params });
  },

  getBloodPressure(params) {
    return api.get('/dashboard/monitoring/blood-pressure', { params });
  },

  getGlucose(params) {
    return api.get('/dashboard/monitoring/glucose', { params });
  },

  getWeight(params) {
    return api.get('/dashboard/monitoring/weight', { params });
  },

  getDialysisSessions(params) {
    return api.get('/dashboard/monitoring/dialysis-sessions', { params });
  },

  getAlertsDistribution() {
    return api.get('/dashboard/monitoring/alerts-distribution');
  },

  getDeviceStatus() {
    return api.get('/dashboard/monitoring/device-status');
  },

  getRealtimePatients() {
    return api.get('/dashboard/monitoring/patients/realtime');
  },
};
