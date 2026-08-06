<template>
  <div class="realtime">
    <div v-if="loading && !patients.length" class="realtime-empty">Loading live patients...</div>
    <div v-else-if="patients.length" class="realtime-list">
      <div v-for="patient in patients" :key="patient.id" class="patient-row">
        <div class="patient-meta">
          <span class="status-dot" :class="{ online: patient.connected }" />
          <div class="patient-name-wrap">
            <strong class="patient-name">{{ patient.name }}</strong>
            <span class="patient-state">{{ patient.connected ? 'Connected' : 'Offline' }}</span>
          </div>
        </div>

        <div class="patient-spark">
          <v-chart :option="sparkOption(patient)" autoresize class="spark" />
        </div>

        <div class="patient-readings">
          <span class="reading hr">{{ patient.lastHeartRate }} <small>bpm</small></span>
          <span class="reading ox">SpO₂ {{ patient.lastOxygen }}%</span>
        </div>
      </div>
    </div>
    <div v-else class="realtime-empty">No patients streaming yet.</div>
  </div>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount } from 'vue';
import { VChart } from '../../echarts';
import { useChartPresets } from '../../optionPresets';
import { useChartExportSink } from '../../exportBridge';
import { useMonitoringData } from '../../../../composables/useMonitoringData';

const monitoring = useMonitoringData();
const { colors, tooltip, fontFamily } = useChartPresets();

const { register, unregister } = useChartExportSink();

const patients = computed(() => monitoring.realtime.data || []);
const loading = computed(() => monitoring.realtime.loading);

let timer = null;

function sparkOption(patient) {
  const series = patient.sparkline || [];
  if (!series.length) return {};
  const min = Math.min(...series);
  const max = Math.max(...series);
  const pad = Math.max(3, Math.round((max - min) * 0.25));
  const color = patient.connected ? '#2563eb' : '#9ca3af';

  return {
    grid: { left: 0, right: 0, top: 2, bottom: 2 },
    xAxis: { type: 'category', show: false, boundaryGap: false, data: series.map((_, i) => i) },
    yAxis: { type: 'value', show: false, min: min - pad, max: max + pad },
    tooltip: {
      ...tooltip.value,
      trigger: 'axis',
      formatter: (params) => {
        const p = params[0];
        return `${patient.name}<br/><b>HR</b>: ${p?.value} bpm`;
      },
    },
    series: [
      {
        type: 'line',
        data: series,
        smooth: true,
        symbol: 'none',
        lineStyle: { width: 2, color },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: `${color}44` },
              { offset: 1, color: `${color}05` },
            ],
          },
        },
      },
    ],
    textStyle: { fontFamily },
  };
}

const csvPayload = computed(() => ({
  columns: ['Patient', 'Connected', 'Last Heart Rate (bpm)', 'Last SpO2 (%)'],
  rows: patients.value.map((p) => [p.name, p.connected ? 'Yes' : 'No', p.lastHeartRate, p.lastOxygen]),
}));

const handle = { getCsv: () => csvPayload.value };

onMounted(() => {
  register(handle);
  monitoring.realtime.load();
  timer = setInterval(() => monitoring.realtime.load(), 4000);
});

onBeforeUnmount(() => {
  unregister(handle);
  clearInterval(timer);
});
</script>

<style scoped>
.realtime {
  height: 100%;
  overflow-y: auto;
}

.realtime-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.patient-row {
  display: grid;
  grid-template-columns: 150px 1fr 150px;
  align-items: center;
  gap: 14px;
  padding: 10px 12px;
  border: 1px solid #f3f4f6;
  border-radius: 10px;
  background: #fafbfc;
}

.patient-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.status-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #9ca3af;
  flex-shrink: 0;
}

.status-dot.online {
  background: #22c55e;
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.15);
}

.patient-name-wrap {
  min-width: 0;
}

.patient-name {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #111827;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.patient-state {
  font-size: 11px;
  color: #9ca3af;
}

.patient-spark {
  height: 40px;
  min-width: 0;
}

.spark {
  width: 100%;
  height: 100%;
}

.patient-readings {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  white-space: nowrap;
}

.reading {
  font-size: 13px;
  font-weight: 600;
}

.reading.hr {
  color: #ef4444;
}

.reading.hr small {
  font-weight: 500;
  color: #9ca3af;
}

.reading.ox {
  color: #2563eb;
  font-weight: 500;
  font-size: 12px;
}

.realtime-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 160px;
  color: #9ca3af;
  font-size: 14px;
}

:global(:root.theme-dark) .patient-row {
  background: #0f172a;
  border-color: #334155;
}

:global(:root.theme-dark) .patient-name {
  color: #f1f5f9;
}

@media (max-width: 767px) {
  .patient-row {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .patient-readings {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }
}
</style>
