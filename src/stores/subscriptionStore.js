import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import { PLANS, PLAN_ORDER } from '../config/plans';
import { useBillingCycle } from '../composables/useBillingCycle';
import permissionService, {
  normalizePlanId,
  canAccess,
  isFeatureUnlocked,
} from '../services/permission.service';
import { subscriptionService } from '../services/settings/subscription.service';
import { useAuthStore } from './authStore';

export const useSubscriptionStore = defineStore('subscription', () => {
  const auth = useAuthStore();
  const billing = useBillingCycle();

  const planId = ref(normalizePlanId(auth.plan));
  const role = ref('caregiver');
  const changing = ref(false);
  const status = ref('Active');

  watch(
    () => auth.user,
    () => syncFromAuth(),
    { immediate: true },
  );

  function syncFromAuth() {
    planId.value = normalizePlanId(auth.plan);
    role.value = permissionService.normalizeRole(auth.role);
  }

  const currentPlan = computed(() => PLANS[planId.value] || PLANS.Standard);
  const isBasePlan = computed(() => planId.value === 'Standard');
  const isPaid = computed(() => !isBasePlan.value);
  const planName = computed(() => currentPlan.value.name);
  const currentPlanPrice = computed(() => billing.planPrice(currentPlan.value));

  const availablePlans = computed(() => {
    return PLAN_ORDER.map((id) => {
      const plan = PLANS[id];
      const limit = (v) => (v === -1 ? 'Ilimitado' : v);
      return {
        ...plan,
        isCurrent: plan.id === planId.value,
        patientsLimit: limit(plan.limits.patients),
        caregiversLimit: limit(plan.limits.caregivers),
        devicesAllowed: limit(plan.limits.devices),
        alertsPerDay: limit(plan.limits.alertsPerDay),
        reportsLevel: plan.access.reports,
        reportsAvailable: plan.access.reports !== false,
        advancedReports: plan.access.reports === 'advanced' || plan.access.reports === 'all',
        analytics: plan.access.analytics,
        ai: plan.access.ai,
        exports: plan.access.exports,
        advancedMonitoring: plan.access.advancedMonitoring,
        apiAccess: plan.access.apiAccess,
        multiCaregiver: plan.access.multiCaregiver,
        teamCollaboration: plan.access.administration,
      };
    });
  });

  function setPlan(id) {
    const normalized = normalizePlanId(id);
    if (PLANS[normalized]) {
      planId.value = normalized;
    }
  }

  function setRole(r) {
    role.value = permissionService.normalizeRole(r);
  }

  async function changePlan(newPlanId) {
    const normalized = normalizePlanId(newPlanId);
    if (!PLANS[normalized]) {
      return { success: false, error: 'Plan inválido.' };
    }

    changing.value = true;
    try {
      await subscriptionService.changePlan(normalized);
      auth.updateUser({ plan: normalized });
      syncFromAuth();
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.title || 'No se pudo cambiar el plan';
      return { success: false, error: msg };
    } finally {
      changing.value = false;
    }
  }

  async function refreshSubscription() {
    try {
      const { data } = await subscriptionService.get();
      if (data.plan) setPlan(data.plan);
      if (data.role) setRole(data.role);
    } catch {
      // keep current local state
    }
  }

  function can(feature) {
    return canAccess(planId.value, role.value, feature);
  }

  function isLocked(feature) {
    return !isFeatureUnlocked(planId.value, feature);
  }

  const sidebarModules = computed(() => {
    const modules = [
      { key: 'dashboard', route: '/dashboard', icon: 'dashboard' },
      { key: 'patients', route: '/patients', icon: 'patients' },
      { key: 'alerts', route: '/alerts', icon: 'alerts' },
      { key: 'settings', route: '/settings', icon: 'settings' },
    ];
    return modules.map((m) => ({
      ...m,
      locked: isLocked(m.key),
      hidden: role.value === 'patient' && m.key === 'settings',
    }));
  });

  return {
    planId, role, status, currentPlan, isBasePlan, isPaid, planName, currentPlanPrice, changing,
    availablePlans,
    setPlan, setRole, changePlan, refreshSubscription, syncFromAuth,
    can, isLocked, sidebarModules,
  };
});
