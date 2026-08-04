<template>
  <div class="dashboard-view">
    <SubscriptionBanner
      :plan="sub.planId"
      @upgrade="showModal = true"
    />

    <header class="page-header">
      <h1 class="page-title">Clinical Dashboard</h1>
      <p class="page-subtitle">Real-time monitoring overview</p>
    </header>

    <div v-if="summaryError" class="error-banner">
      <span>Unable to load dashboard data. The server may be unavailable.</span>
      <button @click="loadSummary">Retry</button>
    </div>

    <div class="kpi-grid">
      <PermissionWrapper feature="dashboard" @open-modal="showModal = true">
        <StatsCard title="Patients Monitored" :value="`${patientCount} / ${patientLimit}`" variant="blue" />
      </PermissionWrapper>

      <PermissionWrapper feature="alerts" @open-modal="showModal = true">
        <StatsCard title="Critical Alerts" :value="`${criticalAlertsCount} Critical`" variant="red" />
      </PermissionWrapper>

      <PermissionWrapper feature="dashboard" @open-modal="showModal = true">
        <StatsCard title="Patients Online" value="--" variant="green" />
      </PermissionWrapper>

      <PermissionWrapper feature="statistics" @open-modal="showModal = true">
        <StatsCard title="System Status" value="Stable" variant="blue" />
      </PermissionWrapper>
    </div>

    <div class="dashboard-grid">
      <PermissionWrapper feature="alerts" @open-modal="showModal = true">
        <CriticalAlertsPanel />
      </PermissionWrapper>

      <PermissionWrapper feature="patients" @open-modal="showModal = true">
        <PatientMonitoringPanel />
      </PermissionWrapper>
    </div>

    <UpgradePlanModal
      :visible="showModal"
      :current-plan="sub.planId"
      @close="showModal = false"
      @select="onSelectPlan"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '../stores/authStore';
import { useSubscriptionStore } from '../stores/subscriptionStore';
import { useAlertStore } from '../stores/alertStore';
import { dashboardService } from '../services/dashboardService';
import StatsCard from '../components/StatsCard.vue';
import CriticalAlertsPanel from '../components/CriticalAlertsPanel.vue';
import PatientMonitoringPanel from '../components/PatientMonitoringPanel.vue';
import SubscriptionBanner from '../components/SubscriptionBanner.vue';
import PermissionWrapper from '../components/PermissionWrapper.vue';
import UpgradePlanModal from '../components/UpgradePlanModal.vue';

const sub = useSubscriptionStore();
const authStore = useAuthStore();
const alertStore = useAlertStore();
const showModal = ref(false);
const patientCount = ref(0);
const criticalAlertsCount = ref(0);
const summaryError = ref(false);

const patientLimit = computed(() => {
  const plan = sub.currentPlan;
  const mod = plan.modules?.patients;
  if (mod && typeof mod === 'object' && mod.max) return mod.max;
  return '--';
});

async function loadSummary() {
  summaryError.value = false;
  try {
    const { data } = await dashboardService.getSummary();
    patientCount.value = data?.totalPatients ?? 0;
    criticalAlertsCount.value = data?.activeAlerts ?? 0;
  } catch {
    summaryError.value = true;
  }
}

async function loadAlerts() {
  if (authStore.userId) {
    await alertStore.fetchAll();
  }
}

onMounted(() => {
  loadSummary();
  loadAlerts();
});

async function onSelectPlan(planId) {
  showModal.value = false;
  const { success } = await sub.changePlan(planId);
  if (!success) showModal.value = true;
}
</script>

<style scoped>
.dashboard-view {
  padding: 32px;
  background: #f8f9fa;
  flex: 1;
}

.page-header {
  margin-bottom: 28px;
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
  gap: 20px;
  margin-bottom: 28px;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 20px;
  align-items: start;
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

  .kpi-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin-bottom: 20px;
  }

  .dashboard-grid {
    grid-template-columns: 1fr;
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
