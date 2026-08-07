<template>
  <section class="monitoring-panel">
    <header class="panel-header">
      <h2 class="panel-title">Patient Status</h2>
      <span v-if="store.patients.length" class="panel-count">{{ store.patients.length }}</span>
    </header>

    <div v-if="store.summaryLoading && !store.summary" class="panel-loading">
      <div v-for="i in 3" :key="i" class="card-skeleton" />
    </div>

    <div v-else-if="store.summaryError && !store.patients.length" class="panel-error">
      <p>{{ store.summaryError }}</p>
      <button class="retry-btn" @click="retry">Retry</button>
    </div>

    <div v-else-if="!store.patients.length" class="patients-empty">
      <p>No patients registered yet.</p>
      <button class="add-btn" @click="$emit('add-patient')">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M7 1v12M1 7h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        </svg>
        Add Patient
      </button>
    </div>

    <div v-else class="patients-grid">
      <div
        v-for="patient in store.patients"
        :key="patient.patientId"
        class="patient-card"
        :class="{ selected: String(patient.patientId) === String(store.selectedPatientId) }"
        role="button"
        tabindex="0"
        @click="$emit('select', patient.patientId)"
        @keydown.enter="$emit('select', patient.patientId)"
      >
        <div class="card-top">
          <span class="avatar">{{ initials(patient.name) }}</span>
          <span
            class="device-dot"
            :class="patient.hasDevice ? 'online' : 'offline'"
            :title="patient.hasDevice ? 'Device linked' : 'No device linked'"
          />
        </div>
        <p class="patient-name">{{ patient.name }}</p>
        <p class="patient-meta">
          {{ patient.hasDevice ? 'Device linked' : 'No device' }} · {{ relativeTime(patient.lastReadingAt) }}
        </p>

        <div class="vitals">
          <div class="vital">
            <span class="vital-label">HR</span>
            <span class="vital-value">{{ fmt(patient.lastHeartRate) }}<small> bpm</small></span>
          </div>
          <div class="vital">
            <span class="vital-label">SpO₂</span>
            <span class="vital-value">{{ fmt(patient.lastOxygen) }}<small>%</small></span>
          </div>
          <div class="vital">
            <span class="vital-label">Activity</span>
            <span class="vital-value">{{ fmt(patient.lastActivity) }}</span>
          </div>
        </div>

        <div class="card-footer">
          <span v-if="patient.activeAlerts > 0" class="alert-badge">
            {{ patient.activeAlerts }} alert{{ patient.activeAlerts > 1 ? 's' : '' }}
          </span>
          <span v-else class="alert-ok">No alerts</span>
          <router-link
            class="view-link"
            :to="`/patients/${patient.patientId}`"
            @click.stop
          >
            View details
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </router-link>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useDashboardStore } from '../stores/dashboardStore';

defineEmits(['select', 'add-patient']);

const store = useDashboardStore();

function initials(name = '') {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join('') || '--'
  );
}

function fmt(value) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.round(n) : '--';
}

function relativeTime(ts) {
  if (!ts) return 'no readings';
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return 'no readings';
  const minutes = Math.floor((Date.now() - d.getTime()) / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function retry() {
  store.fetchSummary({ force: true });
}
</script>

<style scoped>
.monitoring-panel {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
  border: 1px solid #f3f4f6;
  overflow: hidden;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px 0;
}

.panel-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}

.panel-count {
  font-size: 12px;
  font-weight: 600;
  color: #2563eb;
  background: #eff6ff;
  border-radius: 999px;
  padding: 2px 10px;
}

.patients-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding: 16px 20px 20px;
}

.patient-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 14px;
  border: 1px solid #f3f4f6;
  border-radius: 12px;
  background: #ffffff;
  cursor: pointer;
  outline: none;
  transition: all 0.15s;
}

.patient-card:hover {
  border-color: #d1d5db;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.patient-card.selected {
  border-color: #2563eb;
  background: #f8fbff;
}

.card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #eff6ff;
  color: #2563eb;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.device-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.device-dot.online {
  background: #22c55e;
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.15);
}

.device-dot.offline {
  background: #d1d5db;
}

.patient-name {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.patient-meta {
  font-size: 12px;
  color: #9ca3af;
  margin: 0;
}

.vitals {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-top: 6px;
}

.vital {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 8px;
  background: #f9fafb;
  border-radius: 8px;
}

.vital-label {
  font-size: 10px;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.vital-value {
  font-size: 14px;
  font-weight: 700;
  color: #111827;
}

.vital-value small {
  font-size: 10px;
  font-weight: 500;
  color: #9ca3af;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 4px;
}

.alert-badge {
  font-size: 11px;
  font-weight: 600;
  color: #dc2626;
  background: #fef2f2;
  border: 1px solid #fecaca;
  padding: 2px 8px;
  border-radius: 999px;
}

.alert-ok {
  font-size: 11px;
  font-weight: 600;
  color: #15803d;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  padding: 2px 8px;
  border-radius: 999px;
}

.view-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
  color: #2563eb;
  text-decoration: none;
}

.view-link:hover {
  color: #1d4ed8;
}

.panel-loading {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px 20px 20px;
}

.card-skeleton {
  height: 108px;
  border-radius: 12px;
  background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 37%, #f3f4f6 63%);
  background-size: 400% 100%;
  animation: shimmer 1.4s ease infinite;
}

@keyframes shimmer {
  0% {
    background-position: 100% 0;
  }
  100% {
    background-position: -100% 0;
  }
}

.patients-empty {
  padding: 32px 20px;
  text-align: center;
  color: #9ca3af;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}

.patients-empty p {
  margin: 0;
}

.add-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: #2563eb;
  color: #ffffff;
  border: none;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}

.add-btn:hover {
  background: #1d4ed8;
}

.panel-error {
  padding: 32px 20px;
  text-align: center;
  color: #dc2626;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.panel-error p {
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

:global(:root.theme-dark) .monitoring-panel {
  background: #1e293b;
  border-color: #334155;
}

:global(:root.theme-dark) .panel-title {
  color: #f1f5f9;
}

:global(:root.theme-dark) .panel-count {
  color: #60a5fa;
  background: #1e3a5f;
}

:global(:root.theme-dark) .patient-card {
  background: #1e293b;
  border-color: #334155;
}

:global(:root.theme-dark) .patient-card:hover {
  border-color: #64748b;
}

:global(:root.theme-dark) .patient-card.selected {
  border-color: #60a5fa;
  background: #16233b;
}

:global(:root.theme-dark) .avatar {
  background: #1e3a5f;
  color: #60a5fa;
}

:global(:root.theme-dark) .patient-name {
  color: #f1f5f9;
}

:global(:root.theme-dark) .patient-meta {
  color: #64748b;
}

:global(:root.theme-dark) .vital {
  background: #0f172a;
}

:global(:root.theme-dark) .vital-label {
  color: #64748b;
}

:global(:root.theme-dark) .vital-value {
  color: #f1f5f9;
}

:global(:root.theme-dark) .card-skeleton {
  background: linear-gradient(90deg, #334155 25%, #475569 37%, #334155 63%);
  background-size: 400% 100%;
}

@media (max-width: 767px) {
  .patients-grid {
    grid-template-columns: 1fr;
    padding: 12px 16px 16px;
  }

  .panel-header {
    padding: 16px 16px 0;
  }
}
</style>
