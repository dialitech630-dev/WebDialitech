import { ref, computed, onMounted } from 'vue';
import { alertService } from '../services/alertService';
import { useAuthStore } from '../stores/authStore';

const notifications = ref([]);
const loading = ref(false);

export function useNotifications() {
  const authStore = useAuthStore();

  const unreadCount = computed(() => notifications.value.filter((n) => !n.read).length);
  const hasUnread = computed(() => unreadCount.value > 0);

  async function fetchAll() {
    loading.value = true;
    try {
      const { data } = await alertService.getAll();
      notifications.value = (data || []).map((a) => ({
        id: a.id,
        icon: a.severity >= 3 ? 'critical' : a.severity >= 2 ? 'warning' : 'info',
        title: a.type || 'Alert',
        description: a.message || '',
        time: a.createdAt ? formatTime(a.createdAt) : '',
        date: a.createdAt ? a.createdAt.split('T')[0] : '',
        read: a.isRead || false,
      }));
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.title || 'Failed to load notifications';
      if (window.__toast) window.__toast.error(msg);
    } finally {
      loading.value = false;
    }
  }

  function markAllAsRead() {
    notifications.value.forEach((n) => { n.read = true; });
  }

  function removeNotification(id) {
    notifications.value = notifications.value.filter((n) => n.id !== id);
  }

  onMounted(() => {
    if (authStore.isAuthenticated) {
      fetchAll();
    }
  });

  return {
    notifications,
    unreadCount,
    hasUnread,
    loading,
    fetchAll,
    markAllAsRead,
    removeNotification,
  };
}

function formatTime(timestamp) {
  const d = new Date(timestamp);
  const hours = d.getHours();
  const minutes = d.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const h = hours % 12 || 12;
  return `${h}:${minutes} ${ampm}`;
}
