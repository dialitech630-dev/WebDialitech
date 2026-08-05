import { ref, reactive, onMounted } from 'vue';
import { profileService } from '../services/settings/profile.service';
import { useAuthStore } from '../stores/authStore';
import { validateProfileForm, sanitizeString, sanitizePhone } from '../utils/validators';

export function useProfile() {
  const authStore = useAuthStore();
  const profile = ref(null);
  const loading = ref(true);
  const error = ref('');
  const saving = ref(false);
  const fieldErrors = reactive({
    name: '',
    lastname: '',
    phone: '',
  });

  const form = reactive({
    name: '',
    lastname: '',
    phone: '',
    email: '',
    imageUrl: '',
  });

  async function fetch() {
    loading.value = true;
    error.value = '';
    try {
      const { data } = await profileService.get();
      profile.value = data;
      form.name = data.name || '';
      form.lastname = data.lastname || '';
      form.phone = data.phone || '';
      form.email = data.email || '';
      form.imageUrl = data.imageUrl || '';
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.title || 'Failed to load profile';
      error.value = msg;
      if (window.__toast) window.__toast.error(msg);
    } finally {
      loading.value = false;
    }
  }

  async function save() {
    if (saving.value) return false;

    const payload = {
      name: sanitizeString(form.name),
      lastname: sanitizeString(form.lastname),
      phone: sanitizePhone(form.phone),
      imageUrl: form.imageUrl,
    };

    const errors = validateProfileForm(payload);
    fieldErrors.name = errors.name || '';
    fieldErrors.lastname = errors.lastname || '';
    fieldErrors.phone = errors.phone || '';
    if (fieldErrors.name || fieldErrors.lastname || fieldErrors.phone) {
      return false;
    }

    saving.value = true;
    error.value = '';
    try {
      const { data } = await profileService.update(payload);
      profile.value = data;
      authStore.updateUser(data);
      if (window.__toast) window.__toast.success('Profile updated successfully.');
      return true;
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.title || 'Failed to update profile';
      error.value = msg;
      if (window.__toast) window.__toast.error(msg);
      return false;
    } finally {
      saving.value = false;
    }
  }

  onMounted(fetch);

  return { profile, form, fieldErrors, loading, saving, error, fetch, save };
}
