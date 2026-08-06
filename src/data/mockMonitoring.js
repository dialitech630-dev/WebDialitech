/**
 * SIMULATED (MOCK) DATA — Patient Monitoring.
 *
 * This module ONLY exists so the monitoring UI can be developed and tested
 * without a backend. Every dataset is clearly namespaced with the `mock`
 * prefix and returns plain, serializable data.
 *
 * To integrate real data, do NOT touch the chart components. Implement the
 * endpoints declared in `src/services/monitoringService.js` and the loaders
 * in `src/composables/useMonitoringData.js` will automatically use them
 * (set `VITE_USE_MOCK_DATA=false` to force live calls).
 */

const HOUR_MS = 3600_000;
const DAY_MS = 86400_000;

function mulberry32(seed) {
  let a = seed;
  return function next() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(20260214);
const between = (min, max) => min + rand() * (max - min);

function round1(v) {
  return Math.round(v * 10) / 10;
}

function round2(v) {
  return Math.round(v * 100) / 100;
}

function timeKey(ts, range) {
  if (range === '24h') {
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  return new Date(ts).toLocaleDateString([], { day: '2-digit', month: 'short' });
}

function dayKey(ts) {
  return new Date(ts).toLocaleDateString([], { day: '2-digit', month: 'short' });
}

function weekKey(ts) {
  return `Wk ${Math.floor(ts / (7 * DAY_MS)) % 10 + 1}`;
}

/**
 * Build a timeline of timestamps for the requested range.
 * @param {'24h'|'7d'|'30d'} range
 */
function buildTimeline(range) {
  const now = Date.now();
  const points = [];
  const step = range === '24h' ? HOUR_MS : range === '7d' ? 6 * HOUR_MS : DAY_MS;
  const count = range === '24h' ? 24 : range === '7d' ? 28 : 30;
  for (let i = count - 1; i >= 0; i -= 1) {
    points.push(now - i * step);
  }
  return points;
}

/**
 * Mock vital signs (heart rate / SpO2 / temperature) with a circadian
 * pattern so the evolution looks realistic.
 * @returns {{labels:string[], heartRate:number[], oxygen:number[], temperature:number[]}}
 */
export function generateMockVitals(range = '24h') {
  const timeline = buildTimeline(range);
  const labels = timeline.map((ts) => timeKey(ts, range));
  const heartRate = [];
  const oxygen = [];
  const temperature = [];

  timeline.forEach((ts, i) => {
    const hour = new Date(ts).getHours() + new Date(ts).getMinutes() / 60;
    const circadian = Math.sin(((hour - 6) / 24) * Math.PI * 2) * 8;
    heartRate.push(Math.round(70 + circadian + between(-6, 6)));
    oxygen.push(Math.round(Math.min(100, Math.max(92, 97 + between(-2.2, 1.2))) * 10) / 10);
    temperature.push(round1(36.7 + Math.sin(((hour - 5) / 24) * Math.PI * 2) * 0.45 + between(-0.3, 0.3)));
    if (i === 9) temperature[i] = round1(temperature[i] + 0.6);
  });

  return { labels, heartRate, oxygen, temperature };
}

/**
 * Mock blood pressure readings for the selected range.
 * @returns {{labels:string[], systolic:number[], diastolic:number[]}}
 */
export function generateMockBloodPressure(range = '24h') {
  const timeline = buildTimeline(range);
  const labels = timeline.map((ts) => timeKey(ts, range));
  const systolic = [];
  const diastolic = [];

  timeline.forEach((ts, i) => {
    const hour = new Date(ts).getHours() + new Date(ts).getMinutes() / 60;
    const drift = Math.sin(((hour - 8) / 24) * Math.PI * 2) * 10;
    systolic.push(Math.round(122 + drift + between(-8, 8)));
    diastolic.push(Math.round(78 + drift * 0.45 + between(-5, 5)));
    if (i === 11) systolic[i] = 152;
    if (i === 12) diastolic[i] = 96;
  });

  return { labels, systolic, diastolic };
}

/**
 * Mock glucose readings (mg/dL) across 30 days, including hypo/hyper
 * excursions so every color band of the visual map appears.
 * @returns {{labels:string[], values:number[]}}
 */
export function generateMockGlucose() {
  const labels = [];
  const values = [];
  const now = Date.now();

  for (let i = 29; i >= 0; i -= 1) {
    const ts = now - i * DAY_MS;
    labels.push(dayKey(ts));
    let value = between(88, 150);
    if (i % 5 === 2) value = between(190, 235);
    if (i % 9 === 4) value = between(58, 68);
    values.push(Math.round(value));
  }

  return { labels, values };
}

/**
 * Mock weight evolution (kg) over 90 days. Returns the readings plus a list
 * of important changes (delta > 1.5 kg) used to mark the chart automatically.
 * @returns {{labels:string[], values:number[], changes:{index:number, label:string}[]}}
 */
export function generateMockWeight() {
  const labels = [];
  const values = [];
  const changes = [];
  const now = Date.now();
  let weight = between(68, 74);

  for (let i = 89; i >= 0; i -= 1) {
    const ts = now - i * DAY_MS;
    labels.push(dayKey(ts));
    const prev = weight;
    let delta = between(-0.4, 0.4);
    if (i % 21 === 9) delta = between(1.7, 2.9);
    if (i % 30 === 17) delta = between(-2.4, -1.6);
    weight = round2(Math.max(58, weight + delta));
    values.push(weight);
    if (Math.abs(weight - prev) > 1.5) {
      changes.push({
        index: i,
        value: weight,
        label: `${weight - prev > 0 ? '+' : ''}${round1(weight - prev)} kg`,
      });
    }
  }

  return { labels, values, changes };
}

/**
 * Mock dialysis sessions per week (last 8 weeks).
 * @returns {{labels:string[], sessions:number[]}}
 */
export function generateMockDialysisSessions() {
  const labels = [];
  const sessions = [];
  const now = Date.now();

  for (let i = 7; i >= 0; i -= 1) {
    const ts = now - i * 7 * DAY_MS;
    labels.push(weekKey(ts));
    sessions.push(Math.round(between(2, 4)));
  }

  return { labels, sessions };
}

/**
 * Mock alert distribution by severity.
 * @returns {{name:string, value:number}[]}
 */
export function generateMockAlertsDistribution() {
  return [
    { name: 'Critical', value: 4 },
    { name: 'High', value: 9 },
    { name: 'Medium', value: 14 },
    { name: 'Low', value: 21 },
  ];
}

/**
 * Mock device status distribution.
 * @returns {{name:string, value:number}[]}
 */
export function generateMockDeviceStatus() {
  return [
    { name: 'Connected', value: 18 },
    { name: 'Disconnected', value: 5 },
    { name: 'Low battery', value: 3 },
    { name: 'Not synced', value: 2 },
  ];
}

let realtimeState = null;

function initRealtimePatients() {
  const names = ['Elena Torres', 'Marco Rossi', 'Aisha Khan', 'Diego Morales', 'Lena Fischer', 'Tomás Herrera'];
  return names.map((name, i) => ({
    id: `mock-${i + 1}`,
    name,
    connected: i % 4 !== 3,
    lastHeartRate: Math.round(between(62, 104)),
    lastOxygen: Math.round(between(93, 100)),
    sparkline: Array.from({ length: 20 }, () => Math.round(between(62, 104))),
  }));
}

/**
 * Mock real-time patient feed. Keeps a rolling buffer and appends a new
 * reading on every call so consumers can simulate live updates.
 * @returns {{id:string, name:string, connected:boolean, lastHeartRate:number, lastOxygen:number, sparkline:number[]}[]}
 */
export function generateMockRealtimePatients() {
  if (!realtimeState) realtimeState = initRealtimePatients();

  realtimeState.forEach((p) => {
    const next = Math.round(Math.min(140, Math.max(45, p.lastHeartRate + between(-4, 4))));
    p.sparkline.push(next);
    if (p.sparkline.length > 30) p.sparkline.shift();
    p.lastHeartRate = next;
    p.lastOxygen = Math.round(Math.min(100, Math.max(90, p.lastOxygen + between(-0.8, 0.8))));
  });

  return realtimeState.map((p) => ({
    id: p.id,
    name: p.name,
    connected: p.connected,
    lastHeartRate: p.lastHeartRate,
    lastOxygen: p.lastOxygen,
    sparkline: [...p.sparkline],
  }));
}
