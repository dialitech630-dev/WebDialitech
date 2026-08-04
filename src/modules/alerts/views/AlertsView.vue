<template>
  <div class="alerts-view">
    <AlertsHeader />

    <AlertsToolbar />

    <div v-if="alertStore.error && !alertStore.alerts.length" class="error-banner">
      <span>Unable to load alerts. The server may be unavailable.</span>
      <button @click="alertStore.fetchAll">Retry</button>
    </div>

    <AlertsList v-if="alertStore.alerts.length" :alerts="alertStore.alerts" />
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useAlertStore } from '../../../stores/alertStore';
import { useAuthStore } from '../../../stores/authStore';
import AlertsHeader from '../components/AlertsHeader.vue';
import AlertsToolbar from '../components/AlertsToolbar.vue';
import AlertsList from '../components/AlertsList.vue';

const alertStore = useAlertStore();
const authStore = useAuthStore();

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
