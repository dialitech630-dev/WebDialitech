import { ref, computed } from 'vue';
import { PLANS, type BillingCycle, type Plan } from '../data/plans';

const billingCycle = ref<BillingCycle>('monthly');

const currencyFormatter = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatMXN(amount) {
  const formatted = currencyFormatter.format(amount);
  return formatted.includes('MXN') ? formatted : `${formatted} MXN`;
}

export function useBillingCycle() {
  const isYearly = computed(() => billingCycle.value === 'yearly');

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
    return price === 0 ? 'Gratis' : formatMXN(price);
  }

  function planPeriodLabel(plan: Plan): string {
    return isYearly.value ? plan.yearlyLabel : plan.monthlyLabel;
  }

  function formatPrice(plan: Plan): string {
    const price = planPrice(plan);
    if (price === 0) return 'Gratis';
    return `${planPriceLabel(plan)} ${planPeriodLabel(plan)}`;
  }

  function planAnnualSavings(plan: Plan): number {
    return Math.max(0, plan.monthlyPrice * 12 - plan.yearlyPrice);
  }

  function planAnnualSavingsLabel(plan: Plan): string {
    const savings = planAnnualSavings(plan);
    return savings === 0 ? 'Gratis' : formatMXN(savings);
  }

  function showsDiscount(plan: Plan): boolean {
    return isYearly.value && plan.discount > 0;
  }

  return {
    billingCycle,
    isYearly,
    annualDiscount,
    setCycle,
    toggle,
    planPrice,
    planPriceLabel,
    planPeriodLabel,
    formatPrice,
    planAnnualSavings,
    planAnnualSavingsLabel,
    formatMXN,
    showsDiscount,
  };
}
