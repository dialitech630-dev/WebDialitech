import { ref, computed } from 'vue';
import { PLANS, type BillingCycle, type Plan } from '../data/plans';

const billingCycle = ref<BillingCycle>('monthly');

export function useBillingCycle() {
  const isYearly = computed(() => billingCycle.value === 'yearly');

  const periodLabel = computed(() => (isYearly.value ? '/year' : '/month'));

  const annualDiscount = computed(() =>
    Math.max(0, ...Object.values(PLANS).map((plan) => plan.discount)),
  );

  function setCycle(cycle: BillingCycle) {
    billingCycle.value = cycle;
  }

  function toggle() {
    billingCycle.value = isYearly.value ? 'monthly' : 'yearly';
  }

  function planPrice(plan: Plan): number {
    return isYearly.value ? plan.yearlyPrice : plan.monthlyPrice;
  }

  function planPriceLabel(plan: Plan): string {
    const price = planPrice(plan);
    return price === 0 ? 'Free' : `$${price}`;
  }

  function planPeriodLabel(plan: Plan): string {
    return isYearly.value ? plan.yearlyLabel : plan.monthlyLabel;
  }

  function formatPrice(plan: Plan): string {
    const price = planPrice(plan);
    if (price === 0) return 'Free';
    return `$${price}${planPeriodLabel(plan)}`;
  }

  function showsDiscount(plan: Plan): boolean {
    return isYearly.value && plan.discount > 0;
  }

  return {
    billingCycle,
    isYearly,
    periodLabel,
    annualDiscount,
    setCycle,
    toggle,
    planPrice,
    planPriceLabel,
    planPeriodLabel,
    formatPrice,
    showsDiscount,
  };
}
