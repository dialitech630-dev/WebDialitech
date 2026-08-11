<template>
  <div class="patient-detail-view">
    <PatientDetailHeader :patient="store.currentPatient" />

    <div v-if="store.loadingDetail" class="loading-detail">
      <div class="skeleton-profile">
        <div class="skeleton-avatar-lg" />
        <div class="skeleton-lines">
          <div class="skeleton-line w-40" />
          <div class="skeleton-line w-60" />
          <div class="skeleton-line w-30" />
        </div>
      </div>
    </div>

    <div v-else-if="store.error && !store.currentPatient" class="error-detail">
      <p class="error-text">{{ store.error }}</p>
      <button class="back-btn" @click="$router.push('/patients')">{{ t('patients.backToPatients') }}</button>
    </div>

    <template v-else-if="store.currentPatient">
      <PatientProfileCard :patient="store.currentPatient" />

      <div class="linking-actions">
        <button class="link-btn" @click="openCodeModal('mobile')">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect x="3" y="1.5" width="12" height="15" rx="2" stroke="currentColor" stroke-width="1.4" />
            <path d="M7 4h4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" />
          </svg>
          {{ t('patients.generateMobileCode') }}
        </button>
        <button class="link-btn secondary" @click="openCodeModal('wearable')">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect x="4.5" y="2" width="9" height="14" rx="2.5" stroke="currentColor" stroke-width="1.4" />
            <path d="M7.5 13.5h3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" />
          </svg>
          {{ t('patients.generateWearableCode') }}
        </button>
      </div>

      <div class="detail-grid">
        <div class="left-column">
          <PatientInfoCard :title="t('patients.personalInformation')">
            <div class="info-grid">
              <div class="info-row">
                <span class="info-label">{{ t('patients.phone') }}</span>
                <span class="info-value">{{ store.currentPatient.phone || '--' }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">{{ t('patients.email') }}</span>
                <span class="info-value">{{ store.currentPatient.email || '--' }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">{{ t('patients.address') }}</span>
                <span class="info-value">{{ store.currentPatient.address || '--' }}</span>
              </div>
            </div>
          </PatientInfoCard>

          <PatientInfoCard :title="t('patients.currentStatus')">
            <div v-if="statusLoading" class="info-loading">{{ t('patients.loadingStatus') }}</div>
            <div v-else-if="statusError" class="info-error">
              <p>{{ t('patients.unableToLoadStatus') }}</p>
              <button class="retry-btn" @click="loadStatus">{{ t('common.retry') }}</button>
            </div>
            <template v-else-if="status">
              <div class="status-grid">
                <div class="status-item">
                  <span class="status-label">{{ t('patients.state') }}</span>
                  <StatusBadge :status="statusLabel" />
                </div>
                <div class="status-item">
                  <span class="status-label">{{ t('patients.lastReading') }}</span>
                  <span class="status-value">{{ formatDateTime(status.lastReadingAt) }}</span>
                </div>
                <div class="status-item">
                  <span class="status-label">{{ t('patients.activeAlerts') }}</span>
                  <span class="status-value">{{ status.activeAlerts ?? 0 }}</span>
                </div>
                <div class="status-item">
                  <span class="status-label">{{ t('patients.device') }}</span>
                  <span class="status-value">{{ deviceStateLabel }}</span>
                </div>
              </div>
              <div class="vitals-grid">
                <div class="vital-item">
                  <span class="vital-label">{{ t('patients.heartRate') }}</span>
                  <span class="vital-value">{{ status.lastHeartRate ?? '--' }} bpm</span>
                </div>
                <div class="vital-item">
                  <span class="vital-label">{{ t('patients.spO2') }}</span>
                  <span class="vital-value">{{ status.lastOxygen ?? '--' }}%</span>
                </div>
                <div class="vital-item">
                  <span class="vital-label">{{ t('patients.activity') }}</span>
                  <span class="vital-value">{{ status.lastActivity ?? '--' }}</span>
                </div>
              </div>
            </template>
            <div v-else class="info-loading">{{ t('patients.noStatus') }}</div>
          </PatientInfoCard>
        </div>
      </div>

      <div class="full-width-section">
        <PatientInfoCard :title="t('patients.readingsHistory')">
          <div class="filter-tabs">
            <button
              v-for="f in readingFilters"
              :key="f.value"
              class="filter-tab"
              :class="{ active: activeFilter === f.value }"
              @click="setFilter(f.value)"
            >
              {{ f.label }}
            </button>
          </div>
          <div v-if="activeFilter === 'custom'" class="custom-range">
            <label class="range-label">{{ t('patients.from') }}
              <input v-model="customFrom" type="date" class="range-input" />
            </label>
            <label class="range-label">{{ t('patients.to') }}
              <input v-model="customTo" type="date" class="range-input" />
            </label>
            <button class="apply-btn" @click="loadReadings">{{ t('common.apply') }}</button>
          </div>
          <ReadingsChart
            :readings="readings"
            :range="activeFilter"
            :loading="readingsLoading"
            :error="readingsError"
            @retry="loadReadings"
          />
        </PatientInfoCard>
      </div>

      <div class="full-width-section">
        <PatientInfoCard :title="t('ai.title')">
          <PermissionWrapper
            feature="ai"
            show-locked
            lock-title="Análisis IA no disponible"
            lock-description="Actualiza tu plan a Pro o Premium para acceder al análisis clínico con IA."
            lock-button-text="Actualizar plan"
            @open-modal="showModal = true"
          >
            <AiInsightsPanel
              :readings="readings"
              :patient-id="route.params.id"
              @retry="runMlAnalysis(true)"
            />
          </PermissionWrapper>
        </PatientInfoCard>
      </div>

      <div class="full-width-section">
        <PatientInfoCard :title="t('patients.patientAlerts')">
          <div v-if="alertsLoading" class="info-loading">{{ t('patients.loadingAlerts') }}</div>
          <div v-else-if="patientAlerts.length" class="patient-alerts">
            <div v-for="alert in patientAlerts" :key="alert.id" class="patient-alert-row">
              <div class="patient-alert-info">
                <span class="patient-alert-type">{{ alert.type }}</span>
                <span class="patient-alert-desc">{{ alert.description }}</span>
              </div>
              <div class="patient-alert-meta">
                <PriorityBadge :priority="alert.priority" />
                <button class="dismiss-btn" :title="t('alerts.resolveAlert')" @click="resolveAlert(alert)">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M5.5 8L7.5 10L10.5 6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div v-else class="info-loading">{{ t('patients.noAlerts') }}</div>
        </PatientInfoCard>
      </div>
    </template>

    <PatientCodeModal
      :visible="codeModalVisible"
      :patient-id="route.params.id"
      :kind="codeModalKind"
      @close="codeModalVisible = false"
      @generated="onCodeGenerated"
    />

    <ResolveAlertModal
      :visible="resolveModalVisible"
      :loading="resolving"
      :alert="resolveAlertTarget"
      @close="resolveModalVisible = false"
      @confirm="confirmResolve"
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
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { usePatientStore } from '../../../stores/patientStore';
import { useMlStore } from '../../../stores/mlStore';
import { useSubscriptionStore } from '../../../stores/subscriptionStore';
import { dashboardService } from '../../../services/dashboardService';
import { alertService } from '../../../services/alertService';
import { patientService } from '../../../services/patients/patient.service';
import PatientDetailHeader from '../components/detail/PatientDetailHeader.vue';
import PatientProfileCard from '../components/detail/PatientProfileCard.vue';
import PatientInfoCard from '../components/detail/PatientInfoCard.vue';
import PatientCodeModal from '../components/detail/PatientCodeModal.vue';
import ReadingsChart from '../components/detail/ReadingsChart.vue';
import AiInsightsPanel from '../../../components/dashboard/AiInsightsPanel.vue';
import PermissionWrapper from '../../../components/PermissionWrapper.vue';
import UpgradePlanModal from '../../../components/UpgradePlanModal.vue';
import StatusBadge from '../../../components/StatusBadge.vue';
import PriorityBadge from '../../alerts/components/PriorityBadge.vue';
import ResolveAlertModal from '../../alerts/components/ResolveAlertModal.vue';

const { t } = useI18n();
const route = useRoute();
const store = usePatientStore();
const mlStore = useMlStore();
const sub = useSubscriptionStore();
const showModal = ref(false);

const status = ref(null);
const statusLoading = ref(false);
const statusError = ref(false);
const readings = ref([]);
const readingsLoading = ref(false);
const readingsError = ref('');
const activeFilter = ref('7d');
const customFrom = ref('');
const customTo = ref('');
const patientAlerts = ref([]);
const alertsLoading = ref(false);
const codeModalVisible = ref(false);
const codeModalKind = ref('mobile');
const resolveModalVisible = ref(false);
const resolving = ref(false);
const resolveAlertTarget = ref(null);

const aiAllowed = computed(() => sub.can('ai'));
let lastAnalysisSignature = '';

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
  if (!patientId.value) return '';
  return `${patientId.value}|${readingsSignature(readings.value)}`;
}

async function runMlAnalysis(force = false) {
  if (!aiAllowed.value) return;
  if (!patientId.value) return;
  const rows = readings.value;
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
  await mlStore.analyzePatient(patientId.value, rows);
}

watch(() => readings.value, () => runMlAnalysis());

watch(
  () => mlStore.analyzing,
  (now, was) => {
    if (was && !now) runMlAnalysis();
  },
);

const readingFilters = [
  { label: t('patients.filterToday'), value: 'today' },
  { label: t('patients.filter7d'), value: '7d' },
  { label: t('patients.filter30d'), value: '30d' },
  { label: t('patients.filterCustom'), value: 'custom' },
];

const patientId = computed(() => route.params.id);

const statusLabel = computed(() => {
  if (!status.value) return 'Normal';
  if (status.value.activeAlerts > 0) return 'Warning';
  return status.value.lastHeartRate ? 'Active' : 'Normal';
});

const deviceStateLabel = computed(() => {
  if (!status.value) return '--';
  return status.value.hasDevice === false ? t('patients.notLinked') : t('patients.connected');
});

function formatDateTime(ts) {
  if (!ts) return '--';
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return '--';
  return d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function openCodeModal(kind) {
  codeModalKind.value = kind;
  codeModalVisible.value = true;
}

function onCodeGenerated() {
  // No requiere recargar; el modal gestiona copia/regeneración.
}

async function loadStatus() {
  if (!patientId.value) return;
  statusLoading.value = true;
  statusError.value = false;
  try {
    const { data } = await dashboardService.getPatientStatus(patientId.value);
    status.value = data || null;
  } catch (err) {
    statusError.value = true;
  } finally {
    statusLoading.value = false;
  }
}

function dateRangeFor(filter) {
  const to = new Date();
  let from = new Date();
  if (filter === 'today') {
    from = new Date(to.getFullYear(), to.getMonth(), to.getDate());
  } else if (filter === '7d') {
    from.setDate(to.getDate() - 7);
  } else if (filter === '30d') {
    from.setDate(to.getDate() - 30);
  }
  return { from: from.toISOString(), to: to.toISOString() };
}

async function loadReadings() {
  if (!patientId.value) return;
  readingsLoading.value = true;
  readingsError.value = '';
  let range;
  if (activeFilter.value === 'custom') {
    if (!customFrom.value || !customTo.value) {
      readingsLoading.value = false;
      readingsError.value = t('patients.selectDates');
      return;
    }
    range = { from: new Date(customFrom.value).toISOString(), to: new Date(customTo.value).toISOString() };
  } else {
    range = dateRangeFor(activeFilter.value);
  }
  try {
    const { data } = await dashboardService.getPatientReadings(patientId.value, {
      from: range.from,
      to: range.to,
      limit: 100,
    });
    readings.value = data || [];
  } catch (err) {
    readingsError.value = t('patients.unableToLoadReadings');
  } finally {
    readingsLoading.value = false;
  }
}

function setFilter(value) {
  activeFilter.value = value;
  if (value !== 'custom') loadReadings();
  else readings.value = [];
}

async function loadPatientAlerts() {
  if (!patientId.value) return;
  alertsLoading.value = true;
  try {
    const { data } = await alertService.getByPatient(patientId.value);
    patientAlerts.value = (data || []).map((a) => ({
      id: a.id,
      type: a.type || t('patients.alert'),
      description: a.message || '',
      priority: a.severity >= 3 ? 'Critical' : a.severity >= 2 ? 'High' : a.severity >= 1 ? 'Medium' : 'Low',
      status: a.isRead ? 'Resolved' : 'Active',
    }));
  } catch {
    patientAlerts.value = [];
  } finally {
    alertsLoading.value = false;
  }
}

function resolveAlert(alert) {
  resolveAlertTarget.value = alert;
  resolveModalVisible.value = true;
}

async function confirmResolve() {
  const alertId = resolveAlertTarget.value?.id;
  if (!alertId) {
    resolveModalVisible.value = false;
    if (window.__toast) window.__toast.error(t('patients.unableToResolveInvalidId'));
    return;
  }

  resolving.value = true;
  try {
    await alertService.remove(alertId);
    patientAlerts.value = patientAlerts.value.filter((a) => a.id !== alertId);
    resolveAlertTarget.value = null;
    resolveModalVisible.value = false;
    if (window.__toast) window.__toast.success(t('alerts.alertResolved'));
  } catch (err) {
    const msg = err.response?.data?.message || err.response?.data?.title || t('patients.failedToResolveAlert');
    if (window.__toast) window.__toast.error(msg);
  } finally {
    resolving.value = false;
  }
}

async function onSelectPlan(planId) {
  showModal.value = false;
  const { success } = await sub.changePlan(planId);
  if (!success) showModal.value = true;
}

onMounted(() => {
  if (route.params.id) {
    store.fetchById(route.params.id);
    loadStatus();
    loadReadings();
    loadPatientAlerts();
  }
});

onBeforeUnmount(() => {
  mlStore.reset();
});
</script>

<style scoped>
.patient-detail-view {
  padding: 32px;
  background: #f8f9fa;
  flex: 1;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 24px;
  align-items: start;
  margin-bottom: 24px;
}

.left-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.right-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.full-width-section {
  margin-bottom: 24px;
}

.info-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-row {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.info-label {
  font-size: 13px;
  font-weight: 500;
  color: #9ca3af;
  min-width: 110px;
  flex-shrink: 0;
}

.info-value {
  font-size: 14px;
  color: #111827;
  font-weight: 500;
}

.linking-actions {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.link-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}

.link-btn:hover {
  background: #1d4ed8;
}

.link-btn.secondary {
  background: #ffffff;
  color: #374151;
  border: 1px solid #e5e7eb;
}

.link-btn.secondary:hover {
  background: #f3f4f6;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.status-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 10px;
}

.status-label {
  font-size: 11px;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.status-value {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}

.vitals-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.vital-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  border: 1px solid #f3f4f6;
  border-radius: 10px;
}

.vital-label {
  font-size: 12px;
  color: #9ca3af;
}

.vital-value {
  font-size: 15px;
  font-weight: 700;
  color: #111827;
}

.filter-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.filter-tab {
  padding: 6px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #ffffff;
  font-size: 13px;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.15s;
}

.filter-tab:hover {
  background: #f9fafb;
}

.filter-tab.active {
  background: #2563eb;
  border-color: #2563eb;
  color: #ffffff;
}

.custom-range {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.range-label {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
  color: #6b7280;
}

.range-input {
  padding: 8px 10px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 13px;
  color: #374151;
  background: #fff;
  outline: none;
}

.apply-btn {
  padding: 8px 18px;
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.apply-btn:hover {
  background: #1d4ed8;
}

.patient-alerts {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.patient-alert-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 16px;
  background: #f9fafb;
  border-radius: 10px;
}

.patient-alert-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.patient-alert-type {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}

.patient-alert-desc {
  font-size: 13px;
  color: #6b7280;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.patient-alert-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.dismiss-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.15s;
}

.dismiss-btn:hover {
  color: #2563eb;
  border-color: #2563eb;
  background: #eff6ff;
}

.info-loading {
  padding: 20px 0;
  text-align: center;
  color: #9ca3af;
  font-size: 14px;
}

.info-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 20px 0;
  color: #dc2626;
  font-size: 14px;
}

.info-error p {
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

.loading-detail {
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #f3f4f6;
  padding: 32px;
}

.skeleton-profile {
  display: flex;
  gap: 20px;
  align-items: center;
}

.skeleton-avatar-lg {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #f3f4f6;
  animation: pulse 1.5s ease-in-out infinite;
}

.skeleton-lines {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.skeleton-line {
  height: 14px;
  background: #f3f4f6;
  border-radius: 6px;
  animation: pulse 1.5s ease-in-out infinite;
}

.w-40 { width: 40%; }
.w-60 { width: 60%; }
.w-30 { width: 30%; }

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.error-detail {
  text-align: center;
  padding: 64px 24px;
}

.error-text {
  font-size: 14px;
  color: #dc2626;
  margin: 0 0 16px;
}

.back-btn {
  padding: 10px 24px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #ffffff;
  color: #374151;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

/* Responsive */
@media (max-width: 1023px) {
  .patient-detail-view {
    padding: 24px;
  }
}

@media (max-width: 767px) {
  .patient-detail-view {
    padding: 16px;
  }

  .detail-grid {
    grid-template-columns: 1fr;
  }

  .info-row {
    flex-direction: column;
    gap: 4px;
  }

  .info-label {
    min-width: 0;
  }

  .status-grid,
  .vitals-grid {
    grid-template-columns: 1fr;
  }
}
</style>
