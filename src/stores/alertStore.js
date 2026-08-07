import { defineStore } from 'pinia';
import { ref } from 'vue';
import { alertService } from '../services/alertService';

export const useAlertStore = defineStore('alerts', () => {
  const alerts = ref([]);
  const loading = ref(false);
  const error = ref('');

  async function fetchAll() {
    loading.value = true;
    error.value = '';
    try {
      const { data } = await alertService.getAll();
      alerts.value = (data || []).map(mapApiAlertToFrontend);
    } catch (err) {
      error.value = err.response?.data?.message || err.response?.data?.title || 'No se pudieron cargar las alertas';
    } finally {
      loading.value = false;
    }
  }

  async function remove(alertId) {
    if (!alertId) {
      return { success: false, error: 'No se pudo resolver la alerta porque el ID de la alerta no es válido.' };
    }
    loading.value = true;
    error.value = '';
    try {
      await alertService.remove(alertId);
      alerts.value = alerts.value.filter((a) => a.id !== alertId);
      return { success: true };
    } catch (err) {
      error.value = err.response?.data?.message || err.response?.data?.title || 'No se pudo eliminar la alerta';
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  }

  function markAllRead() {
    let count = 0;
    alerts.value.forEach((a) => {
      if (a.status !== 'Resolved') {
        a.status = 'Resolved';
        count += 1;
      }
    });
    return count;
  }

  function clear() {
    alerts.value = [];
    error.value = '';
    loading.value = false;
  }

  return { alerts, loading, error, fetchAll, remove, markAllRead, clear };
});

function mapApiAlertToFrontend(apiAlert) {
  return {
    id: apiAlert.id,
    patientName: apiAlert.patientName || 'Unknown',
    type: apiAlert.type,
    priority: apiAlert.severity >= 3 ? 'Critical' : apiAlert.severity >= 2 ? 'High' : apiAlert.severity >= 1 ? 'Medium' : 'Low',
    date: apiAlert.createdAt ? apiAlert.createdAt.split('T')[0] : 'N/A',
    time: apiAlert.createdAt ? new Date(apiAlert.createdAt).toLocaleTimeString() : 'N/A',
    description: apiAlert.message,
    status: apiAlert.isRead ? 'Resolved' : 'Active',
  };
}
