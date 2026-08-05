<template>
  <div class="readings-chart">
    <div v-if="loading" class="chart-state">
      <p>Loading readings...</p>
    </div>
    <div v-else-if="error" class="chart-state error">
      <p>{{ error }}</p>
      <button class="retry-btn" @click="$emit('retry')">Retry</button>
    </div>
    <div v-else-if="!points.length" class="chart-state">
      <p>No readings available for the selected period.</p>
    </div>
    <template v-else>
      <svg :viewBox="`0 0 ${width} ${height}`" class="chart-svg" preserveAspectRatio="none" role="img" :aria-label="label">
        <g v-for="i in gridLines" :key="i">
          <line
            :x1="padding.left"
            :y1="i * gridStepY + padding.top"
            :x2="width - padding.right"
            :y2="i * gridStepY + padding.top"
            class="grid-line"
          />
        </g>
        <polyline :points="linePoints" class="chart-line" fill="none" />
        <polygon :points="areaPoints" class="chart-area" />
        <circle
          v-for="(p, i) in points"
          :key="i"
          :cx="p.x"
          :cy="p.y"
          r="3"
          class="chart-dot"
        />
      </svg>
      <div class="chart-labels">
        <span>{{ firstLabel }}</span>
        <span>{{ lastLabel }}</span>
      </div>
      <div class="chart-meta">
        <span class="meta-item">
          <span class="meta-dot" />
          {{ label }}
        </span>
        <span class="meta-value">Latest: {{ latestValue }} {{ unit }}</span>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  readings: { type: Array, default: () => [] },
  label: { type: String, default: 'Heart Rate' },
  unit: { type: String, default: 'bpm' },
  valueKey: { type: String, default: 'heartRate' },
  loading: { type: Boolean, default: false },
  error: { type: String, default: '' },
});

defineEmits(['retry']);

const width = 560;
const height = 200;
const padding = { top: 12, right: 12, bottom: 8, left: 12 };
const gridLines = 4;
const gridStepY = (height - padding.top - padding.bottom) / (gridLines + 1);

const points = computed(() => {
  const vals = props.readings
    .map((r) => {
      const v = Number(r[props.valueKey]);
      return Number.isFinite(v) ? v : null;
    })
    .filter((v) => v !== null);

  if (!vals.length) return [];

  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const range = max - min || 1;
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  return props.readings.map((r, i) => {
    const v = Number(r[props.valueKey]);
    const value = Number.isFinite(v) ? v : min;
    const x = padding.left + (i / Math.max(props.readings.length - 1, 1)) * chartW;
    const y = padding.top + (1 - (value - min) / range) * chartH;
    return { x, y, value };
  });
});

const linePoints = computed(() => points.value.map((p) => `${p.x},${p.y}`).join(' '));

const areaPoints = computed(() => {
  if (!points.value.length) return '';
  const bottom = height - padding.bottom;
  const first = points.value[0];
  const last = points.value[points.value.length - 1];
  return `${first.x},${bottom} ${linePoints.value} ${last.x},${bottom}`;
});

const latestValue = computed(() => {
  const last = points.value[points.value.length - 1];
  return last ? last.value : '--';
});

const firstLabel = computed(() => {
  const r = props.readings[0];
  return r ? formatShortDate(r) : '';
});

const lastLabel = computed(() => {
  const r = props.readings[props.readings.length - 1];
  return r ? formatShortDate(r) : '';
});

function formatShortDate(r) {
  if (r.timestamp) return formatTimestamp(r.timestamp);
  if (r.createdAt) return formatTimestamp(r.createdAt);
  return '';
}

function formatTimestamp(ts) {
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString(undefined, { day: '2-digit', month: 'short' });
}
</script>

<style scoped>
.readings-chart {
  width: 100%;
}

.chart-svg {
  width: 100%;
  height: 200px;
}

.grid-line {
  stroke: #f3f4f6;
  stroke-width: 1;
}

.chart-line {
  stroke: #2563eb;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.chart-area {
  fill: rgba(37, 99, 235, 0.08);
}

.chart-dot {
  fill: #2563eb;
}

.chart-labels {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #9ca3af;
  margin-top: 4px;
}

.chart-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 10px;
  font-size: 13px;
  color: #6b7280;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.meta-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #2563eb;
}

.meta-value {
  font-weight: 600;
  color: #111827;
}

.chart-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  height: 200px;
  color: #9ca3af;
  font-size: 14px;
}

.chart-state.error {
  color: #dc2626;
}

.chart-state p {
  margin: 0;
}

.retry-btn {
  padding: 6px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: #ffffff;
  color: #374151;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}

.retry-btn:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}
</style>
