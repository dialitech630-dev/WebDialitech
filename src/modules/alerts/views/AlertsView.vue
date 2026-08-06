<template>
  <div class="alerts-view">
    <AlertsHeader @mark-all-read="handleMarkAllRead" />

    <AlertsToolbar
      v-model:search="search"
      v-model:priority="priority"
      v-model:status="status"
      v-model:date="date"
    />

    <div v-if="alertStore.error && !alertStore.alerts.length" class="error-banner">
      <span>Unable to load alerts. The server may be unavailable.</span>
      <button @click="alertStore.fetchAll">Retry</button>
    </div>

    <AlertsList
      v-if="filteredAlerts.length"
      :alerts="filteredAlerts"
      @resolve="handleResolve"
      @dismiss="handleDismiss"
    />

    <div v-else-if="alertStore.alerts.length" class="empty-banner">
      No alerts match your filters.
    </div>

    <div v-else-if="!alertStore.loading && !alertStore.error" class="empty-banner">
      No alerts yet.
    </div>

    <ResolveAlertModal
      :visible="resolveModalVisible"
      :loading="resolving"
      :alert="selectedAlert"
      @close="resolveModalVisible = false"
      @confirm="confirmResolve"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAlertStore } from '../../../stores/alertStore';
import { useAuthStore } from '../../../stores/authStore';
import { useNotifications } from '../../../composables/useNotifications';
import { priorities } from '../data/alerts';
import AlertsHeader from '../components/AlertsHeader.vue';
import AlertsToolbar from '../components/AlertsToolbar.vue';
import AlertsList from '../components/AlertsList.vue';
import ResolveAlertModal from '../components/ResolveAlertModal.vue';

const alertStore = useAlertStore();
const authStore = useAuthStore();
const route = useRoute();
const { fetchAll: refreshNotifications } = useNotifications();

const search = ref('');
const priority = ref(priorities.includes(String(route.query.priority)) ? String(route.query.priority) : 'All Priorities');
const status = ref('All Status');
const date = ref('All Dates');
const resolveModalVisible = ref(false);
const resolving = ref(false);
const selectedAlert = ref(null);

const filteredAlerts = computed(() => {
  const query = search.value.trim().toLowerCase();
  return alertStore.alerts.filter((alert) => {
    if (priority.value !== 'All Priorities' && alert.priority !== priority.value) return false;
    if (status.value !== 'All Status' && alert.status !== status.value) return false;
    if (!matchesDate(alert.date, date.value)) return false;
    if (query) {
      const haystack = `${alert.patientName} ${alert.type} ${alert.description}`.toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    return true;
  });
});

function matchesDate(dateStr, filter) {
  if (filter === 'All Dates') return true;
  if (!dateStr || dateStr === 'N/A') return false;
  const d = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(d.getTime())) return false;

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (filter === 'Today') return d.getTime() >= startOfToday.getTime();

  if (filter === 'This Week') {
    const day = (startOfToday.getDay() + 6) % 7;
    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfToday.getDate() - day);
    return d.getTime() >= startOfWeek.getTime();
  }

  if (filter === 'This Month') {
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    return d.getTime() >= startOfMonth.getTime();
  }

  return true;
}

function handleResolve(alert) {
  selectedAlert.value = alert;
  resolveModalVisible.value = true;
}

async function confirmResolve() {
  const alertId = selectedAlert.value?.id;
  if (!alertId) {
    resolveModalVisible.value = false;
    if (window.__toast) window.__toast.error('Unable to resolve alert because the alert ID is invalid.');
    return;
  }

  resolving.value = true;
  const result = await alertStore.remove(alertId);
  resolving.value = false;
  if (result.success) {
    selectedAlert.value = null;
    resolveModalVisible.value = false;
    if (window.__toast) window.__toast.success('Alert resolved.');
    refreshNotifications();
  } else if (window.__toast) {
    window.__toast.error(result.error);
  }
}

async function handleDismiss(alert) {
  const alertId = alert?.id;
  if (!alertId) {
    if (window.__toast) window.__toast.error('Unable to resolve alert because the alert ID is invalid.');
    return;
  }
  const result = await alertStore.remove(alertId);
  if (result.success) {
    if (window.__toast) window.__toast.success('Alert dismissed.');
    refreshNotifications();
  } else if (window.__toast) {
    window.__toast.error(result.error);
  }
}

function handleMarkAllRead() {
  const count = alertStore.markAllRead();
  if (!window.__toast) return;
  if (count > 0) window.__toast.success(`${count} alert(s) marked as read.`);
  else window.__toast.info('No unread alerts.');
}

onMounted(() => {
  if (authStore.isAuthenticated) {
    alertStore.fetchAll();
  }
});
</script>

<style scoped>
.alerts-view {
  padding: 32px;
  background: #f8f9fa;
  flex: 1;
}

.error-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 16px;
  margin-top: 20px;
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

.empty-banner {
  padding: 32px 16px;
  text-align: center;
  color: #9ca3af;
  font-size: 14px;
}

/* Responsive */
@media (max-width: 1023px) {
  .alerts-view {
    padding: 24px;
  }
}

@media (max-width: 767px) {
  .alerts-view {
    padding: 16px;
  }

  .error-banner {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
