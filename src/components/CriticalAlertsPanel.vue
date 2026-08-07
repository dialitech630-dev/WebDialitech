<template>
  <section class="alerts-panel">
    <div class="panel-header">
      <h2 class="panel-title">Alertas críticas</h2>
      <router-link to="/alerts" class="view-all-btn">Ver todas</router-link>
    </div>
    <div v-if="alertStore.error && !alerts.length" class="panel-error">
      <p>No se pudieron cargar las alertas. El servidor puede estar no disponible.</p>
      <button class="retry-btn" @click="alertStore.fetchAll">Reintentar</button>
    </div>
    <div v-else-if="alerts.length" class="alerts-list">
      <CriticalAlertCard
        v-for="alert in alerts"
        :key="alert.id"
        :patient="alert.patientName"
        :type="alert.type"
        :time="alert.date"
        :status="alert.priority === 'Critical' ? 'Critical' : 'Warning'"
      />
    </div>
    <div v-else class="alerts-empty">
      <p>No hay alertas críticas en este momento</p>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useAuthStore } from '../stores/authStore';
import { useAlertStore } from '../stores/alertStore';
import CriticalAlertCard from './CriticalAlertCard.vue';

const authStore = useAuthStore();
const alertStore = useAlertStore();

const alerts = computed(() => alertStore.alerts.slice(0, 5));

onMounted(() => {
  if (authStore.isAuthenticated) {
    alertStore.fetchAll();
  }
});
</script>

<style scoped>
.alerts-panel {
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

.view-all-btn {
  background: none;
  border: 1px solid #d1d5db;
  color: #374151;
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}

.view-all-btn:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

.alerts-list {
  padding: 12px 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.alerts-empty {
  padding: 32px 20px;
  text-align: center;
  color: #9ca3af;
  font-size: 14px;
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
