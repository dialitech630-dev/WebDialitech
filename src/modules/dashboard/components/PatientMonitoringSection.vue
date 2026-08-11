<template>
  <section class="monitoring-section">
    <header class="monitoring-header">
      <div class="monitoring-heading">
        <h2 class="monitoring-title">Monitoreo de pacientes</h2>
        <p class="monitoring-subtitle">Signos vitales del dispositivo vinculado del paciente seleccionado</p>
      </div>

      <div class="monitoring-controls">
        <label v-if="store.patients.length > 1" class="patient-select">
          <select :value="String(store.selectedPatientId)" @change="onPatientChange">
            <option v-for="p in store.patients" :key="p.patientId" :value="String(p.patientId)">
              {{ p.name }}
            </option>
          </select>
        </label>

        <div class="range-toggle" role="tablist" aria-label="Rango de tiempo de monitoreo">
          <button
            v-for="option in ranges"
            :key="option.value"
            type="button"
            role="tab"
            class="range-btn"
            :class="{ active: store.range === option.value }"
            :aria-selected="store.range === option.value"
            @click="store.setRange(option.value)"
          >
            {{ option.label }}
          </button>
        </div>
      </div>
    </header>

    <div class="live-stats">
      <div v-for="chip in chips" :key="chip.label" class="stat-chip">
        <span class="stat-chip__label">{{ chip.label }}</span>
        <span class="stat-chip__value" :style="{ color: chip.color }">{{ chip.value }}</span>
      </div>
    </div>

    <ChartCard
      title="Línea de tiempo de signos vitales"
      :subtitle="chartSubtitle"
      :height="340"
      :loading="store.readingsLoading && !store.readings.length"
      :error="readingsErrorText"
    >
      <div v-if="!store.patients.length" class="no-patients">
        <p>Aún no hay pacientes vinculados.</p>
        <p>Agrega un paciente para comenzar a monitorear sus signos vitales.</p>
      </div>
      <VitalSignsTimeline v-else />
    </ChartCard>
  </section>
</template>

<script setup>
import { computed, defineAsyncComponent } from 'vue';
import { useDashboardStore } from '../../../stores/dashboardStore';
import ChartCard from './charts/ChartCard.vue';

const VitalSignsTimeline = defineAsyncComponent(() => import('./charts/VitalSignsTimeline.vue'));

const store = useDashboardStore();

const ranges = [
  { value: 'today', label: 'Hoy' },
  { value: '24h', label: 'Últimas 24 h' },
  { value: '7d', label: 'Últimos 7 días' },
  { value: '30d', label: 'Últimos 30 días' },
];

function fmt(value, unit = '') {
  const n = Number(value);
  return Number.isFinite(n) ? `${Math.round(n)}${unit}` : '--';
}

const chips = computed(() => {
  const d = store.patientDetail;
  const alerts = toCount(d?.activeAlerts);
  return [
    { label: 'Frecuencia cardíaca', value: fmt(d?.lastHeartRate, ' lpm'), color: '#ef4444' },
    { label: 'SpO₂', value: fmt(d?.lastOxygen, '%'), color: '#2563eb' },
    { label: 'Actividad', value: fmt(d?.lastActivity), color: '#f59e0b' },
    {
      label: 'Alertas activas',
      value: String(alerts),
      color: alerts > 0 ? '#ef4444' : '#22c55e',
    },
  ];
});

const readingsErrorText = computed(() => (store.readingsError ? 'No se pudieron cargar las lecturas de este paciente.' : ''));

const chartSubtitle = computed(() => {
  if (store.readingsLoading) return 'Cargando lecturas...';
  if (store.readings.length) return `Frecuencia cardíaca · SpO₂ · Actividad · ${store.readingsCount} lecturas`;
  return 'Frecuencia cardíaca · SpO₂ · Actividad';
});

function toCount(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function onPatientChange(event) {
  store.selectPatient(event.target.value);
}
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

.monitoring-heading {
  min-width: 0;
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

.monitoring-controls {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.patient-select select {
  max-width: 220px;
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #ffffff;
  color: #374151;
  font-size: 13px;
  font-weight: 500;
  outline: none;
  cursor: pointer;
}

.patient-select select:focus {
  border-color: #2563eb;
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

.live-stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 20px;
}

.stat-chip {
  background: #ffffff;
  border: 1px solid #f3f4f6;
  border-radius: 12px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}

.stat-chip__label {
  font-size: 11px;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.stat-chip__value {
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.3px;
  color: #111827;
}

.no-patients {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  height: 100%;
  color: #9ca3af;
  font-size: 14px;
  text-align: center;
}

.no-patients p {
  margin: 0;
}

:global(:root.theme-dark) .monitoring-title {
  color: #f1f5f9;
}

:global(:root.theme-dark) .monitoring-subtitle {
  color: #94a3b8;
}

:global(:root.theme-dark) .range-toggle,
:global(:root.theme-dark) .patient-select select,
:global(:root.theme-dark) .stat-chip {
  background: #1e293b;
  border-color: #334155;
}

:global(:root.theme-dark) .patient-select select {
  color: #e2e8f0;
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

:global(:root.theme-dark) .stat-chip__label {
  color: #64748b;
}

:global(:root.theme-dark) .stat-chip__value {
  color: #f1f5f9;
}

:global(:root.theme-dark) .no-patients {
  color: #64748b;
}

@media (max-width: 767px) {
  .monitoring-section {
    margin-top: 20px;
  }

  .monitoring-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .monitoring-controls {
    width: 100%;
  }

  .range-toggle {
    flex: 1;
  }

  .range-btn {
    flex: 1;
    text-align: center;
  }

  .patient-select {
    width: 100%;
  }

  .patient-select select {
    width: 100%;
    max-width: none;
  }

  .live-stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
