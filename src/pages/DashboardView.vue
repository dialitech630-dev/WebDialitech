<template>
  <div class="dashboard-view">
    <SubscriptionBanner
      :plan="sub.planId"
      @upgrade="showModal = true"
    />

    <header class="page-header">
      <div class="page-heading">
        <h1 class="page-title">Panel clínico</h1>
        <p class="page-subtitle">Resumen en vivo de los signos vitales y alertas de tus pacientes</p>
      </div>

      <div class="page-actions">
        <span v-if="store.lastUpdated" class="last-updated">
          Última actualización {{ formatTime(store.lastUpdated) }}
        </span>
        <label class="auto-refresh" title="Actualiza los datos automáticamente cada 30 segundos">
          <input v-model="autoRefresh" type="checkbox" />
          <span>Actualización automática</span>
        </label>
        <button class="refresh-btn" :disabled="store.summaryLoading" @click="refreshAll">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M11.5 7a4.5 4.5 0 1 1-1.4-3.3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
            <path d="M11.5 1.5V4H9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          Actualizar
        </button>
      </div>
    </header>

    <div v-if="store.summaryError && !store.summary" class="error-banner">
      <span>{{ store.summaryError }}</span>
      <button @click="refreshAll">Reintentar</button>
    </div>

    <div class="kpi-grid">
      <template v-if="store.summaryLoading && !store.summary">
        <div v-for="i in 4" :key="i" class="kpi-skeleton" />
      </template>
      <template v-else>
        <PermissionWrapper feature="dashboard" @open-modal="showModal = true">
          <StatsCard title="Total de pacientes" :value="String(store.totalPatients)" variant="blue" />
        </PermissionWrapper>

        <PermissionWrapper feature="alerts" @open-modal="showModal = true">
          <StatsCard title="Alertas activas" :value="String(store.activeAlerts)" variant="red" />
        </PermissionWrapper>

        <PermissionWrapper feature="dashboard" @open-modal="showModal = true">
          <StatsCard title="Pacientes con dispositivo" :value="String(store.patientsWithDevice)" variant="green" />
        </PermissionWrapper>

        <PermissionWrapper feature="statistics" @open-modal="showModal = true">
          <StatsCard title="Frecuencia cardíaca promedio" :value="avgHrText" variant="blue" />
        </PermissionWrapper>
      </template>
    </div>

    <PermissionWrapper feature="advancedMonitoring" @open-modal="showModal = true">
      <PatientMonitoringSection />
    </PermissionWrapper>

    <PermissionWrapper
      feature="ai"
      lock-title="Análisis IA no disponible"
      lock-description="Actualiza tu plan a Pro o Premium para acceder al análisis clínico con IA."
      lock-button-text="Actualizar plan"
      @open-modal="showModal = true"
    >
      <AiInsightsPanel
        :readings="store.readings"
        :patient-id="store.selectedPatientId"
        @retry="runMlAnalysis(true)"
      />
    </PermissionWrapper>

    <div class="dashboard-grid">
      <PermissionWrapper feature="alerts" @open-modal="showModal = true">
        <CriticalAlertsPanel />
      </PermissionWrapper>

      <PermissionWrapper feature="patients" @open-modal="showModal = true">
        <PatientMonitoringPanel @add-patient="showAddModal = true" />
      </PermissionWrapper>
    </div>

    <AddPatientModal
      :visible="showAddModal"
      @close="showAddModal = false"
      @created="onPatientCreated"
    />

    <UpgradePlanModal
      :visible="showModal"
      :current-plan="sub.planId"
      @close="showModal = false"
      @select="onSelectPlan"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, defineAsyncComponent } from 'vue';
import { useAuthStore } from '../stores/authStore';
import { useSubscriptionStore } from '../stores/subscriptionStore';
import { useAlertStore } from '../stores/alertStore';
import { useDashboardStore } from '../stores/dashboardStore';
import { useMlStore } from '../stores/mlStore';
import StatsCard from '../components/StatsCard.vue';
import CriticalAlertsPanel from '../components/CriticalAlertsPanel.vue';
import PatientMonitoringPanel from '../components/PatientMonitoringPanel.vue';
import SubscriptionBanner from '../components/SubscriptionBanner.vue';
import PermissionWrapper from '../components/PermissionWrapper.vue';
import UpgradePlanModal from '../components/UpgradePlanModal.vue';
import AddPatientModal from '../components/AddPatientModal.vue';
import AiInsightsPanel from '../components/dashboard/AiInsightsPanel.vue';

const PatientMonitoringSection = defineAsyncComponent(() =>
  import('../modules/dashboard/components/PatientMonitoringSection.vue'),
);

const REFRESH_INTERVAL = 30 * 1000;

const sub = useSubscriptionStore();
const authStore = useAuthStore();
const alertStore = useAlertStore();
const store = useDashboardStore();
const mlStore = useMlStore();

const showModal = ref(false);
const showAddModal = ref(false);
const autoRefresh = ref(true);
let refreshTimer = null;

// IA: la restricción de plan también se aplica aquí (no solo visual), de modo
// que los planes Standard jamás disparan POST /api/v1/analyze.
const aiAllowed = computed(() => sub.can('ai'));
let lastAnalysisSignature = '';

// Firma basada en TODAS las lecturas (no solo la última) para que el
// auto-refresh de 30s no vuelva a analizar datos idénticos (sin llamadas
// duplicadas por el mismo conjunto de readings).
function readingsSignature(rows) {
  if (!rows?.length) return '';
  let hash = 5381;
  for (const r of rows) {
    const line = [r.timestamp, r.heartRate, r.oxygen, r.activity]
      .map((v) => String(v ?? ''))
      .join('|');
    for (let i = 0; i < line.length; i += 1) {
      hash = ((hash << 5) + hash) ^ line.charCodeAt(i);
    }
  }
  return String(hash >>> 0);
}

function analysisSignature() {
  if (!store.selectedPatientId) return '';
  return `${store.selectedPatientId}|${readingsSignature(store.readings)}`;
}

async function runMlAnalysis(force = false) {
  if (!aiAllowed.value) return;
  if (!store.selectedPatientId) return;
  const rows = store.readings;
  if (!rows?.length) return;

  if (rows.length < 12) {
    mlStore.insufficientData.value = true;
    mlStore.insufficientReason.value = `Se necesitan al menos 12 lecturas para realizar el análisis de IA. Actualmente hay ${rows.length}.`;
    return;
  }

  const signature = analysisSignature();
  if (!force && signature === lastAnalysisSignature) return;
  if (mlStore.analyzing) return;
  lastAnalysisSignature = signature;
  await mlStore.analyzePatient(store.selectedPatientId, rows);
}

watch(
  () => store.selectedPatientId,
  () => {
    // Cambio de paciente: limpiar análisis anterior antes de ejecutar el nuevo.
    mlStore.reset();
    lastAnalysisSignature = '';
    runMlAnalysis();
  },
  { immediate: true },
);

watch(
  () => store.readings,
  () => runMlAnalysis(),
);

// Cuando un análisis en curso termina, se re-evalúa por si las lecturas
// cambiaron mientras estaba en vuelo (la firma impide crear un loop).
watch(
  () => mlStore.analyzing,
  (now, was) => {
    if (was && !now) runMlAnalysis();
  },
);

const avgHrText = computed(() => (store.averageHeartRate ? `${store.averageHeartRate} lpm` : '--'));

function formatTime(date) {
  return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

async function refreshAll() {
  await store.fetchSummary({ force: true });
  if (store.selectedPatientId) {
    store.fetchPatientDetail(store.selectedPatientId, true);
    store.fetchReadings(store.selectedPatientId, store.range, true);
  }
}

function startAutoRefresh() {
  stopAutoRefresh();
  refreshTimer = setInterval(() => {
    if (!document.hidden) refreshAll();
  }, REFRESH_INTERVAL);
}

function stopAutoRefresh() {
  if (refreshTimer) {
    clearInterval(refreshTimer);
    refreshTimer = null;
  }
}

function onVisibilityChange() {
  if (document.hidden) stopAutoRefresh();
  else if (autoRefresh.value) startAutoRefresh();
}

function onPatientCreated() {
  showAddModal.value = false;
  refreshAll();
}

watch(autoRefresh, (enabled) => {
  if (enabled) startAutoRefresh();
  else stopAutoRefresh();
});

onMounted(async () => {
  await store.fetchSummary();
  await store.ensureSelectedData();
  if (authStore.userId) {
    await alertStore.fetchAll();
  }
  if (aiAllowed.value) {
    mlStore.checkHealth();
  }
  startAutoRefresh();
  document.addEventListener('visibilitychange', onVisibilityChange);
});

onBeforeUnmount(() => {
  stopAutoRefresh();
  document.removeEventListener('visibilitychange', onVisibilityChange);
  store.reset();
  mlStore.reset();
});

async function onSelectPlan(planId) {
  showModal.value = false;
  const { success } = await sub.changePlan(planId);
  if (!success) showModal.value = true;
}
</script>

<style scoped>
.dashboard-view {
  padding: var(--page-padding);
  background: #f8f9fa;
  flex: 1;
}

.page-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 28px;
  flex-wrap: wrap;
}

.page-heading {
  min-width: 0;
}

.page-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.last-updated {
  font-size: 12px;
  color: #9ca3af;
}

.auto-refresh {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  user-select: none;
}

.auto-refresh input {
  accent-color: #2563eb;
}

.refresh-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #ffffff;
  color: #374151;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}

.refresh-btn:hover:not(:disabled) {
  background: #f9fafb;
  border-color: #9ca3af;
}

.refresh-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.error-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 16px;
  margin-bottom: 20px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 10px;
  color: #b91c1c;
  font-size: 14px;
}

.error-banner button {
  padding: 6px 14px;
  border: 1px solid #fca5a5;
  border-radius: 8px;
  background: #ffffff;
  color: #b91c1c;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.error-banner button:hover {
  background: #fecaca;
}

.page-title {
  font-size: 26px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 4px 0;
  letter-spacing: -0.5px;
}

.page-subtitle {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--grid-gap);
  margin-bottom: 28px;
}

.kpi-skeleton {
  height: 112px;
  border-radius: 12px;
  background: linear-gradient(90deg, #e5e7eb 25%, #d1d5db 37%, #e5e7eb 63%);
  background-size: 400% 100%;
  animation: kpi-shimmer 1.4s ease infinite;
}

@keyframes kpi-shimmer {
  0% {
    background-position: 100% 0;
  }
  100% {
    background-position: -100% 0;
  }
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: var(--grid-gap);
  align-items: start;
  margin-top: 28px;
}

/* Responsive */
@media (max-width: 1023px) {
  .dashboard-view {
    padding: 24px;
  }
}

@media (max-width: 767px) {
  .dashboard-view {
    padding: 16px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .kpi-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin-bottom: 20px;
  }

  .dashboard-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .page-title {
    font-size: 22px;
  }
}

@media (max-width: 479px) {
  .kpi-grid {
    grid-template-columns: 1fr;
  }
}
</style>
