import { ref, reactive, computed } from 'vue';
import { monitoringService } from '../services/monitoringService';
import {
  generateMockVitals,
  generateMockBloodPressure,
  generateMockGlucose,
  generateMockWeight,
  generateMockDialysisSessions,
  generateMockAlertsDistribution,
  generateMockDeviceStatus,
  generateMockRealtimePatients,
} from '../data/mockMonitoring';

/**
 * Force simulated data for every monitoring dataset. Set to `true` while the
 * backend endpoints are not implemented, `false` once they are live:
 *   VITE_USE_MOCK_DATA=true  -> never call the API (default, avoids 404 toasts)
 *   VITE_USE_MOCK_DATA=false -> call the API, fall back to mock on error
 */
const FORCE_MOCK = import.meta.env.VITE_USE_MOCK_DATA === 'true';

function createLoader(serviceFn, mockFn, normalize = (value) => value, { keepPrevious = false } = {}) {
  const data = ref(null);
  const loading = ref(false);
  const error = ref(false);
  const source = ref('mock');
  const usingMock = computed(() => source.value !== 'live');

  async function load(params) {
    loading.value = true;
    error.value = false;
    if (!keepPrevious) data.value = null;
    source.value = 'live';

    if (FORCE_MOCK) {
      data.value = normalize(mockFn(params));
      source.value = 'mock';
      loading.value = false;
      return usingMock.value;
    }

    try {
      const { data: res } = await serviceFn(params);
      data.value = normalize(res);
      source.value = 'live';
    } catch {
      data.value = normalize(mockFn(params));
      source.value = 'mock';
    } finally {
      loading.value = false;
    }
    return usingMock.value;
  }

  return { data, loading, error, source, usingMock, load };
}

function passthrough(value) {
  return value;
}

function normalizeTimeSeries(value, keys) {
  if (!value) return value;
  if (value.labels && keys.some((k) => value[k])) return value;
  return value;
}

function normalizePair(value) {
  if (!value) return value;
  if (value.labels && Array.isArray(value.systolic) && Array.isArray(value.diastolic)) return value;
  return value;
}

function normalizeWeight(value) {
  if (!value) return value;
  return {
    labels: value.labels || [],
    values: value.values || value.weight || [],
    changes: value.changes || [],
  };
}

function normalizeDistribution(value) {
  if (Array.isArray(value)) return value;
  if (value && typeof value === 'object') {
    return Object.entries(value).map(([name, count]) => ({ name, value: Number(count) || 0 }));
  }
  return [];
}

/**
 * Shared reactive monitoring dataset (singleton). All chart components consume
 * the same instance, so there is a single source of truth and one data fetch
 * per dataset. Components only read `data`, `loading`, `error` and `usingMock`
 * — they never know whether the source is live or simulated.
 */
const state = {
  vitals: createLoader(
    (params) => monitoringService.getVitals(params),
    (params) => generateMockVitals(params?.range),
    (v) => normalizeTimeSeries(v, ['heartRate', 'oxygen', 'temperature']),
  ),

  bloodPressure: createLoader(
    (params) => monitoringService.getBloodPressure(params),
    (params) => generateMockBloodPressure(params?.range),
    normalizePair,
  ),

  glucose: createLoader(
    (params) => monitoringService.getGlucose(params),
    () => generateMockGlucose(),
    (v) => normalizeTimeSeries(v, ['values']),
  ),

  weight: createLoader(
    (params) => monitoringService.getWeight(params),
    () => generateMockWeight(),
    normalizeWeight,
  ),

  dialysis: createLoader(
    (params) => monitoringService.getDialysisSessions(params),
    () => generateMockDialysisSessions(),
    (v) => normalizeTimeSeries(v, ['sessions']),
  ),

  alertsDistribution: createLoader(
    () => monitoringService.getAlertsDistribution(),
    () => generateMockAlertsDistribution(),
    normalizeDistribution,
  ),

  deviceStatus: createLoader(
    () => monitoringService.getDeviceStatus(),
    () => generateMockDeviceStatus(),
    normalizeDistribution,
  ),

  realtime: createLoader(
    () => monitoringService.getRealtimePatients(),
    () => generateMockRealtimePatients(),
    passthrough,
    { keepPrevious: true },
  ),
};

function loadAll(range) {
  const params = { range };
  state.vitals.load(params);
  state.bloodPressure.load(params);
  state.glucose.load(params);
  state.weight.load(params);
  state.dialysis.load();
  state.alertsDistribution.load();
  state.deviceStatus.load();
}

const anyMock = computed(() =>
  [state.vitals, state.bloodPressure, state.glucose, state.weight, state.dialysis, state.alertsDistribution, state.deviceStatus, state.realtime]
    .some((ds) => ds.usingMock.value),
);

export function useMonitoringData() {
  return reactive({
    ...state,
    loadAll,
    anyMock,
  });
}
