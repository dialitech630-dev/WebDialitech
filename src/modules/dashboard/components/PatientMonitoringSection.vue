<template>
  <section class="monitoring-section">
    <header class="monitoring-header">
      <div class="monitoring-heading">
        <h2 class="monitoring-title">Patient Monitoring</h2>
        <p class="monitoring-subtitle">
          Real-time clinical trends
          <span v-if="monitoring.anyMock" class="mock-note" title="Data source is simulated while live endpoints are being integrated">simulated data</span>
        </p>
      </div>

      <div class="range-toggle" role="tablist" aria-label="Monitoring time range">
        <button
          v-for="option in ranges"
          :key="option.value"
          type="button"
          role="tab"
          class="range-btn"
          :class="{ active: range === option.value }"
          :aria-selected="range === option.value"
          @click="setRange(option.value)"
        >
          {{ option.label }}
        </button>
      </div>
    </header>

    <div class="monitoring-grid">
      <ChartCard
        class="card-full"
        title="Vital Signs Timeline"
        subtitle="Heart rate · SpO₂ · Temperature"
        :height="340"
        :loading="monitoring.vitals.loading"
        :using-mock="monitoring.vitals.usingMock"
        :error="monitoring.vitals.error ? 'Unable to load vital signs.' : ''"
      >
        <VitalSignsTimeline />
      </ChartCard>

      <ChartCard
        title="Blood Pressure"
        subtitle="Systolic & diastolic with normal-range references"
        :height="300"
        :loading="monitoring.bloodPressure.loading"
        :using-mock="monitoring.bloodPressure.usingMock"
        :error="monitoring.bloodPressure.error ? 'Unable to load blood pressure.' : ''"
      >
        <BloodPressureChart />
      </ChartCard>

      <ChartCard
        title="Glucose Trend"
        subtitle="Auto-colored: normal / caution / out of range"
        :height="300"
        :loading="monitoring.glucose.loading"
        :using-mock="monitoring.glucose.usingMock"
        :error="monitoring.glucose.error ? 'Unable to load glucose data.' : ''"
      >
        <GlucoseTrend />
      </ChartCard>

      <ChartCard
        title="Weight Evolution"
        subtitle="Important changes are marked automatically"
        :height="300"
        :loading="monitoring.weight.loading"
        :using-mock="monitoring.weight.usingMock"
        :error="monitoring.weight.error ? 'Unable to load weight data.' : ''"
      >
        <WeightEvolution />
      </ChartCard>

      <ChartCard
        title="Dialysis Sessions"
        subtitle="Sessions completed per week"
        :height="300"
        :loading="monitoring.dialysis.loading"
        :using-mock="monitoring.dialysis.usingMock"
        :error="monitoring.dialysis.error ? 'Unable to load dialysis sessions.' : ''"
      >
        <DialysisSessions />
      </ChartCard>

      <ChartCard
        title="Alerts Distribution"
        subtitle="Click a segment to open filtered alerts"
        :height="300"
        :loading="monitoring.alertsDistribution.loading"
        :using-mock="monitoring.alertsDistribution.usingMock"
        :error="monitoring.alertsDistribution.error ? 'Unable to load alerts.' : ''"
      >
        <AlertsDistribution @select="onAlertSelect" />
      </ChartCard>

      <ChartCard
        title="Device Status"
        subtitle="Connected devices overview"
        :height="300"
        :loading="monitoring.deviceStatus.loading"
        :using-mock="monitoring.deviceStatus.usingMock"
        :error="monitoring.deviceStatus.error ? 'Unable to load device status.' : ''"
      >
        <DeviceStatus />
      </ChartCard>

      <ChartCard
        class="card-full"
        title="Real-Time Monitoring"
        subtitle="Latest readings · live feed"
        :height="360"
        :loading="monitoring.realtime.loading && !monitoring.realtime.data"
        :using-mock="monitoring.realtime.usingMock"
        :error="monitoring.realtime.error ? 'Unable to load live readings.' : ''"
      >
        <RealTimeMonitoring />
      </ChartCard>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, defineAsyncComponent } from 'vue';
import { useRouter } from 'vue-router';
import { useMonitoringData } from '../../../composables/useMonitoringData';
import ChartCard from './charts/ChartCard.vue';

const VitalSignsTimeline = defineAsyncComponent(() => import('./charts/VitalSignsTimeline.vue'));
const BloodPressureChart = defineAsyncComponent(() => import('./charts/BloodPressureChart.vue'));
const GlucoseTrend = defineAsyncComponent(() => import('./charts/GlucoseTrend.vue'));
const WeightEvolution = defineAsyncComponent(() => import('./charts/WeightEvolution.vue'));
const DialysisSessions = defineAsyncComponent(() => import('./charts/DialysisSessions.vue'));
const AlertsDistribution = defineAsyncComponent(() => import('./charts/AlertsDistribution.vue'));
const DeviceStatus = defineAsyncComponent(() => import('./charts/DeviceStatus.vue'));
const RealTimeMonitoring = defineAsyncComponent(() => import('./charts/RealTimeMonitoring.vue'));

const router = useRouter();
const monitoring = useMonitoringData();

const ranges = [
  { value: '24h', label: 'Last 24h' },
  { value: '7d', label: 'Last 7d' },
  { value: '30d', label: 'Last 30d' },
];

const range = ref('24h');

function setRange(value) {
  range.value = value;
  monitoring.vitals.load({ range: value });
  monitoring.bloodPressure.load({ range: value });
  monitoring.glucose.load({ range: value });
}

function onAlertSelect(priority) {
  router.push({ name: 'alerts', query: { priority } });
}

onMounted(() => monitoring.loadAll(range.value));
</script>

<style scoped>
.monitoring-section {
  margin-top: 28px;
}

.monitoring-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.monitoring-title {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 2px 0;
  letter-spacing: -0.3px;
}

.monitoring-subtitle {
  font-size: 13px;
  color: #6b7280;
  margin: 0;
}

.mock-note {
  display: inline-block;
  margin-left: 6px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  color: #b45309;
  background: #fef3c7;
  border: 1px solid #fde68a;
  padding: 2px 8px;
  border-radius: 999px;
}

.range-toggle {
  display: inline-flex;
  align-items: center;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 3px;
  gap: 2px;
}

.range-btn {
  padding: 6px 14px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: #6b7280;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
}

.range-btn:hover {
  color: #111827;
}

.range-btn.active {
  background: #eff6ff;
  color: #2563eb;
  font-weight: 600;
}

.monitoring-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
  align-items: stretch;
}

.card-full {
  grid-column: 1 / -1;
}

:global(:root.theme-dark) .monitoring-title {
  color: #f1f5f9;
}

:global(:root.theme-dark) .monitoring-subtitle {
  color: #94a3b8;
}

:global(:root.theme-dark) .range-toggle {
  background: #1e293b;
  border-color: #334155;
}

:global(:root.theme-dark) .range-btn {
  color: #94a3b8;
}

:global(:root.theme-dark) .range-btn:hover {
  color: #f1f5f9;
}

:global(:root.theme-dark) .range-btn.active {
  background: #1e3a5f;
  color: #60a5fa;
}

:global(:root.theme-dark) .mock-note {
  background: rgba(245, 158, 11, 0.15);
  border-color: rgba(245, 158, 11, 0.35);
}

/* Tablet: keep 2 columns, tighten gaps */
@media (min-width: 768px) and (max-width: 1023px) {
  .monitoring-grid {
    gap: 16px;
  }
}

/* Mobile: 1 chart per row, never horizontal scroll */
@media (max-width: 767px) {
  .monitoring-section {
    margin-top: 20px;
  }

  .monitoring-grid {
    grid-template-columns: 1fr;
    gap: 14px;
  }

  .monitoring-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .range-toggle {
    width: 100%;
  }

  .range-btn {
    flex: 1;
    text-align: center;
  }
}
</style>
