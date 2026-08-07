import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { accountService } from '../services/settings/account.service';
import { authService } from '../services/auth/auth.service';
import { useAuthStore } from '../stores/authStore';
import { usePatientStore } from '../stores/patientStore';
import { useAlertStore } from '../stores/alertStore';
import { useSessionStore } from '../stores/sessionStore';
import tokenService from '../services/token.service';

function friendlyError(err) {
  const status = err?.response?.status;
  if (status === 401) return 'Tu sesión ha expirado.';
  if (status === 403) return 'No tienes autorización para eliminar esta cuenta.';
  if (status === 404) return 'Cuenta no encontrada.';
  if (status === 409) return 'La cuenta no se puede eliminar porque aún existen recursos dependientes.';
  if (status === 500) return 'Error del servidor. Inténtalo de nuevo más tarde.';
  return 'No se pudo eliminar la cuenta. Inténtalo de nuevo.';
}

export function useAccount() {
  const router = useRouter();
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
      const msg = err.response?.data?.message || err.response?.data?.title || 'No se pudo cargar la cuenta';
      error.value = msg;
      if (window.__toast) window.__toast.error(msg);
    } finally {
      loading.value = false;
    }
  }

  function hasValidSession() {
    return Boolean(authStore.isAuthenticated && tokenService.getToken());
  }

  function clearAuthState() {
    authStore.logout();
    usePatientStore().clear();
    useAlertStore().clear();
    useSessionStore().dismissExpired();
    useSessionStore().dismissInactivity();
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
    } catch {
      /* storage no disponible */
    }
  }

  async function deleteAccount() {
    if (deleting.value) return { success: false };
    if (!hasValidSession()) {
      deleteError.value = 'Tu sesión ha expirado. Inicia sesión nuevamente.';
      return { success: false, error: deleteError.value, code: 'session-expired' };
    }

    deleting.value = true;
    deleteError.value = '';

    try {
      await authService.deleteAccount();
      clearAuthState();
      if (window.__toast) window.__toast.success('Tu cuenta ha sido eliminada exitosamente.');
      router.replace('/login');
      return { success: true };
    } catch (err) {
      const msg = friendlyError(err);
      deleteError.value = msg;
      if (window.__toast) window.__toast.error(msg);
      return { success: false, error: msg };
    } finally {
      deleting.value = false;
    }
  }

  onMounted(fetch);

  return { account, loading, error, deleting, deleteError, fetch, deleteAccount, hasValidSession };
}
