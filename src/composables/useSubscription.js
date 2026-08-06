import { ref, computed, onMounted } from 'vue';
import { useSubscriptionStore } from '../stores/subscriptionStore';
import { useBillingCycle } from './useBillingCycle';

export function useSubscription() {
  const store = useSubscriptionStore();
  const billing = useBillingCycle();
  const loading = ref(true);
  const error = ref('');

  const plan = computed(() => {
    if (!store.planId) return null;
    const config = store.currentPlan;
    return {
      id: config.id,
      name: config.name,
      price: billing.formatPrice(config),
      status: store.status,
      description: config.description,
      benefits: config.features,
      limits: config.limits,
      modules: config.modules,
      access: config.access,
      startDate: null,
      endDate: null,
    };
  });

  const hasActiveSubscription = computed(() => !!store.planId);

  const availablePlans = computed(() => store.availablePlans);

  async function fetch() {
    loading.value = true;
    error.value = '';
    try {
      await store.refreshSubscription();
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data?.title || 'Failed to load subscription';
      error.value = msg;
      if (window.__toast) window.__toast.error(msg);
    } finally {
      loading.value = false;
    }
  }

  async function changePlan(newPlanId) {
    const result = await store.changePlan(newPlanId);
    if (result.success) {
      if (window.__toast) window.__toast.success('Subscription updated successfully.');
    } else {
      if (window.__toast) window.__toast.error(result.error);
    }
    return result;
  }

  onMounted(fetch);

  return {
    plan, loading, error, hasActiveSubscription,
    availablePlans, changePlan, fetch,
    isChanging: computed(() => store.changing),
    currentPlanId: computed(() => store.planId),
  };
}
