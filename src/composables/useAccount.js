import { ref, onMounted } from 'vue';
import { accountService } from '../services/settings/account.service';
import { authService } from '../services/auth/auth.service';
import { useAuthStore } from '../stores/authStore';

export function useAccount() {
  const authStore = useAuthStore();
  const account = ref(null);
  const loading = ref(true);
  const error = ref('');
  const deleting = ref(false);
  const deleteError = ref('');

  async function fetch() {
    loading.value = true;
    error.value = '';
    try {
      const { data } = await accountService.get();
      account.value = {
        id: data.id,
        name: data.name,
        lastname: data.lastname,
        email: data.email,
        phone: data.phone,
        plan: data.plan,
        role: data.role || 'caregiver',
        status: data.status || 'Active',
      };
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.title || 'Failed to load account';
      error.value = msg;
      if (window.__toast) window.__toast.error(msg);
    } finally {
      loading.value = false;
    }
  }

  async function deleteAccount() {
    deleting.value = true;
    deleteError.value = '';
    try {
      await authService.deleteAccount();
      authStore.logout();
      window.location.href = '/login';
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.title || 'Failed to delete account';
      deleteError.value = msg;
      if (window.__toast) window.__toast.error(msg);
      return { success: false, error: msg };
    } finally {
      deleting.value = false;
    }
  }

  onMounted(fetch);

  return { account, loading, error, deleting, deleteError, fetch, deleteAccount };
}
