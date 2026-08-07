<template>
  <section class="settings-card plan-summary">
    <div class="card-head">
      <h3 class="card-title">{{ t('payments.currentPlanSummary') }}</h3>
      <span class="status-badge"><span class="status-dot" />{{ t('common.active') }}</span>
    </div>

    <div class="summary-grid">
      <div class="summary-item">
        <span class="summary-label">{{ t('payments.plan') }}</span>
        <span class="summary-value plan-name">{{ plan.name }}</span>
      </div>

      <div class="summary-item">
        <span class="summary-label">{{ t('payments.monthlyPrice') }}</span>
        <span class="summary-value">{{ monthlyPriceLabel }}</span>
      </div>

      <div class="summary-item">
        <span class="summary-label">{{ t('payments.annualPrice') }}</span>
        <span class="summary-value">{{ annualPriceLabel }}</span>
        <span v-if="plan.discount > 0" class="summary-note">{{ t('billing.savePercent', { percent: plan.discount }) }}</span>
      </div>

      <div class="summary-item">
        <span class="summary-label">{{ t('payments.nextCharge') }}</span>
        <span class="summary-value">{{ nextChargeLabel }}</span>
      </div>

      <div class="summary-item">
        <span class="summary-label">{{ t('payments.status') }}</span>
        <span class="summary-value">{{ t('common.active') }}</span>
      </div>

      <div class="summary-item">
        <span class="summary-label">{{ t('payments.paymentMethod') }}</span>
        <span class="summary-value">{{ paymentMethodLabel }}</span>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useSubscriptionStore } from '../../../stores/subscriptionStore';
import { useBillingCycle, formatMXN } from '../../../composables/useBillingCycle';

const props = defineProps({
  paymentMethod: { type: String, default: '' },
});

const { t } = useI18n();
const sub = useSubscriptionStore();
const { isYearly } = useBillingCycle();

const plan = computed(() => sub.currentPlan);

const monthlyPriceLabel = computed(() => `${formatMXN(plan.value.monthlyPrice)} ${t('billing.perMonth')}`);
const annualPriceLabel = computed(() => `${formatMXN(plan.value.yearlyPrice)} ${t('billing.perYear')}`);

const nextChargeLabel = computed(() => {
  const now = new Date();
  const next = isYearly.value
    ? new Date(now.getFullYear() + 1, now.getMonth(), now.getDate())
    : new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
  return new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'long', year: 'numeric' }).format(next);
});

const paymentMethodLabel = computed(() => {
  if (props.paymentMethod) return props.paymentMethod;
  return t('payments.noPaymentMethod');
});
</script>

<style scoped>
.settings-card {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
  border: 1px solid #f3f4f6;
  padding: var(--card-padding) var(--card-padding-h);
}

.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 20px;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  color: #059669;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  padding: 4px 12px;
  border-radius: 20px;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #22c55e;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.summary-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.summary-label {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  color: #9ca3af;
}

.summary-value {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}

.plan-name {
  color: #2563eb;
}

.summary-note {
  font-size: 12px;
  font-weight: 600;
  color: #059669;
  background: #f0fdf4;
  padding: 2px 8px;
  border-radius: 6px;
  width: fit-content;
}

@media (max-width: 1023px) {
  .summary-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 767px) {
  .settings-card {
    padding: 20px;
  }

  .summary-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .card-head {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
