import { ref, computed } from 'vue';
import api from './api';
import { useDashboardStore } from '../stores/dashboardStore';

const MIN_POLL_INTERVAL = 3000;
const MAX_POLL_INTERVAL = 30000;
const DEFAULT_POLL_INTERVAL = 5000;
const BACKOFF_MULTIPLIER = 1.5;
const MAX_CONSECUTIVE_EMPTY = 6;

let eventSource = null;
let pollTimer = null;
let isPolling = false;
let currentInterval = DEFAULT_POLL_INTERVAL;
let consecutiveEmpty = 0;
let lastETag = null;
let lastModified = null;
let subscribers = new Set();
let patientId = null;
let range = '30d';

const isActive = ref(false);
const connectionStatus = ref('disconnected');
const lastPollTime = ref(null);
let store = null;

function getStore() {
  if (!store) {
    store = useDashboardStore();
  }
  return store;
}

function notifySubscribers(event, data) {
  subscribers.forEach((cb) => {
    try {
      cb(event, data);
    } catch (e) {
      console.error('[Realtime] Subscriber error:', e);
    }
  });
}

function setConnectionStatus(status) {
  connectionStatus.value = status;
  notifySubscribers('status', { status });
}

async function fetchReadingsOnce(force = false) {
  const s = getStore();
  if (!patientId) return { readings: [], isNew: false };

  const headers = {};
  if (!force && lastETag) headers['If-None-Match'] = lastETag;
  if (!force && lastModified) headers['If-Modified-Since'] = lastModified;

  try {
    const r = dateRangeFor(range);
    const response = await api.get(`/dashboard/${patientId}/readings`, {
      params: { from: r.from, to: r.to, limit: 1000 },
      headers,
      validateStatus: (status) => status === 200 || status === 304,
    });

    lastPollTime.value = new Date();

    if (response.status === 304) {
      consecutiveEmpty += 1;
      return { readings: [], isNew: false, notModified: true };
    }

    const newETag = response.headers?.etag;
    const newLastModified = response.headers?.['last-modified'];
    if (newETag) lastETag = newETag;
    if (newLastModified) lastModified = newLastModified;

    let raw = response.data?.readings ?? response.data ?? [];
    raw = raw.slice().sort((a, b) => {
      const ta = new Date(a?.timestamp);
      const tb = new Date(b?.timestamp);
      return ta - tb;
    });

    const existing = new Set(s.readings.map((r) => r.timestamp));
    const newReadings = raw.filter((r) => r.timestamp && !existing.has(r.timestamp));

    if (newReadings.length > 0) {
      consecutiveEmpty = 0;
      currentInterval = Math.max(MIN_POLL_INTERVAL, currentInterval / BACKOFF_MULTIPLIER);
      s.readings.push(...newReadings);
      notifySubscribers('readings', { newReadings, allReadings: s.readings });
      return { readings: newReadings, isNew: true, allReadings: s.readings };
    } else {
      consecutiveEmpty += 1;
      currentInterval = Math.min(MAX_POLL_INTERVAL, currentInterval * BACKOFF_MULTIPLIER);
      return { readings: [], isNew: false };
    }
  } catch (err) {
    if (err.response?.status === 401) {
      lastETag = null;
      lastModified = null;
    }
    consecutiveEmpty += 1;
    currentInterval = Math.min(MAX_POLL_INTERVAL, currentInterval * BACKOFF_MULTIPLIER);
    notifySubscribers('error', { error: err });
    return { readings: [], isNew: false, error: err };
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

async function pollLoop() {
  if (!isPolling || !patientId) return;

  const result = await fetchReadingsOnce();

  if (!isPolling) return;

  if (result.isNew) {
    setConnectionStatus('connected');
  } else if (result.notModified) {
    setConnectionStatus('connected');
  } else if (result.error) {
    setConnectionStatus('error');
  }

  pollTimer = setTimeout(pollLoop, currentInterval);
}

function startPolling() {
  if (isPolling) return;
  isPolling = true;
  consecutiveEmpty = 0;
  currentInterval = DEFAULT_POLL_INTERVAL;
  setConnectionStatus('connecting');
  pollLoop();
}

function stopPolling() {
  isPolling = false;
  if (pollTimer) {
    clearTimeout(pollTimer);
    pollTimer = null;
  }
  setConnectionStatus('disconnected');
}

function trySSE() {
  if (eventSource) return false;

  try {
    const baseUrl = import.meta.env.DEV ? '/api/v1' : `${import.meta.env.VITE_API_URL}/api/v1`;
    const url = `${baseUrl}/dashboard/${patientId}/readings/stream?range=${range}`;

    eventSource = new EventSource(url, { withCredentials: false });

    eventSource.onopen = () => {
      setConnectionStatus('connected');
      stopPolling();
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.readings?.length) {
          const s = getStore();
          const existing = new Set(s.readings.map((r) => r.timestamp));
          const newReadings = data.readings.filter((r) => r.timestamp && !existing.has(r.timestamp));
          if (newReadings.length) {
            s.readings.push(...newReadings);
            notifySubscribers('readings', { newReadings, allReadings: s.readings });
          }
        }
      } catch (e) {
        console.error('[Realtime] SSE parse error:', e);
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
      eventSource = null;
      setConnectionStatus('disconnected');
      startPolling();
    };

    return true;
  } catch (e) {
    console.warn('[Realtime] SSE not available:', e);
    return false;
  }
}

export function useRealtimeReadings() {
  function subscribe(callback) {
    subscribers.add(callback);
    return () => subscribers.delete(callback);
  }

  function setPatient(id, newRange = '30d') {
    const changed = patientId !== id || range !== newRange;
    patientId = id;
    range = newRange;
    lastETag = null;
    lastModified = null;

    if (changed && isActive.value) {
      stopPolling();
      if (!trySSE()) {
        startPolling();
      }
    }
  }

  async function start() {
    if (!patientId) return;
    isActive.value = true;
    await fetchReadingsOnce(true);
    if (!trySSE()) {
      startPolling();
    }
  }

  function stop() {
    isActive.value = false;
    stopPolling();
    if (eventSource) {
      eventSource.close();
      eventSource = null;
    }
  }

  function onVisibilityChange() {
    if (document.hidden) {
      stopPolling();
    } else if (isActive.value && patientId) {
      currentInterval = MIN_POLL_INTERVAL;
      consecutiveEmpty = 0;
      fetchReadingsOnce(true).then(() => {
        if (!trySSE()) startPolling();
      });
    }
  }

  function forceRefresh() {
    lastETag = null;
    lastModified = null;
    currentInterval = MIN_POLL_INTERVAL;
    return fetchReadingsOnce(true);
  }

  return {
    isActive: computed(() => isActive.value),
    connectionStatus: computed(() => connectionStatus.value),
    lastPollTime: computed(() => lastPollTime.value),
    subscribe,
    setPatient,
    start,
    stop,
    onVisibilityChange,
    forceRefresh,
  };
}

export default { useRealtimeReadings };