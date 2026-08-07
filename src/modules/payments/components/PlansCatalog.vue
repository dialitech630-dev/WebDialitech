<template>
  <section class="plans-section">
    <div class="plans-head">
      <div>
        <h3 class="section-title">{{ t('settings.availablePlans') }}</h3>
        <p class="section-desc">{{ t('payments.subtitle') }}</p>
      </div>
      <BillingToggle />
    </div>

    <div class="plans-grid">
      <article
        v-for="plan in plans"
        :key="plan.id"
        class="plan-card"
        :class="{ featured: plan.id === 'pro' }"
      >
        <div v-if="plan.id === 'pro'" class="plan-badge">{{ t('plans.mostPopular') }}</div>

        <div class="plan-header">
          <h4 class="plan-name">{{ plan.name }}</h4>
          <p class="plan-desc">{{ plan.description }}</p>
        </div>

        <div class="plan-price">
          <Transition name="price" mode="out-in">
            <div :key="isYearly ? 'yearly' : 'monthly'" class="price-inner">
              <div class="price-row">
                <span class="price-value">{{ displayPrice(plan) }}</span>
                <span class="price-period">{{ isYearly ? t('billing.perYear') : t('billing.perMonth') }}</span>
              </div>
              <div v-if="isYearly && plan.discount > 0" class="price-save">
                <span class="save-badge">{{ t('billing.savePercent', { percent: plan.discount }) }}</span>
                <span class="save-note">{{ t('billing.annualSavings') }} · {{ savingsLabel(plan) }}</span>
              </div>
            </div>
          </Transition>
        </div>

        <ul class="plan-features">
          <li v-for="(feature, i) in plan.features" :key="i" class="feature-item">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6" :stroke="plan.id === 'pro' ? '#2563eb' : '#9ca3af'" stroke-width="1.3" />
              <path d="M5.5 8L7.5 10L11 5.5" :stroke="plan.id === 'pro' ? '#2563eb' : '#6b7280'" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            {{ feature }}
          </li>
        </ul>

        <div class="plan-limits">
          <span class="limit-item">{{ t('payments.limits') }}: {{ limitsLabel(plan) }}</span>
        </div>

        <button
          v-if="plan.backendPlan === sub.planId"
          class="plan-btn current"
          type="button"
          disabled
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 8.5L6.5 11L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          {{ t('payments.current') }}
        </button>
        <button v-else class="plan-btn change" type="button" @click="openChangeModal(plan)">
          {{ t('payments.changePlan') }}
        </button>
      </article>
    </div>

    <ChangePlanModal
      v-if="selectedPlan"
      :new-plan="selectedPlan"
      @close="selectedPlan = null"
      @changed="selectedPlan = null"
    />
  </section>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { PAYMENT_PLANS } from '../../../data/paymentPlans';
import { PLANS } from '../../../data/plans';
import { useSubscriptionStore } from '../../../stores/subscriptionStore';
import { useBillingCycle, formatMXN } from '../../../composables/useBillingCycle';
import BillingToggle from '../../../components/BillingToggle.vue';
import ChangePlanModal from '../../settings/components/ChangePlanModal.vue';

const { t } = useI18n();
const sub = useSubscriptionStore();
const { isYearly, planPrice, planAnnualSavings } = useBillingCycle();

const plans = PAYMENT_PLANS;
const selectedPlan = ref(null);

function displayPrice(plan) {
  const price = planPrice({ monthlyPrice: plan.monthlyPrice, yearlyPrice: plan.yearlyPrice });
  return price === 0 ? t('billing.free') : formatMXN(price);
}

function savingsLabel(plan) {
  const savings = planAnnualSavings({ monthlyPrice: plan.monthlyPrice, yearlyPrice: plan.yearlyPrice });
  return savings === 0 ? t('billing.free') : formatMXN(savings);
}

function limitsLabel(plan) {
  const limit = (v) => (v === -1 ? t('common.unlimited') : v);
  const l = plan.limits;
  const parts = [
    `${limit(l.patients)} ${t('settings.patients').toLowerCase()}`,
    `${limit(l.devices)} ${t('settings.devices').toLowerCase()}`,
    `${limit(l.alertsPerDay)} ${t('settings.alertsPerDay').toLowerCase()}`,
  ];
  return parts.join(' · ');
}

function openChangeModal(plan) {
  selectedPlan.value = {
    ...PLANS[plan.backendPlan],
    id: plan.backendPlan,
    name: plan.name,
  };
}
</script>

<style scoped>
.plans-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.plans-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 4px 0;
}

.section-desc {
  font-size: 13px;
  color: #6b7280;
  margin: 0;
}

.plans-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 18px;
}

.plan-card {
  position: relative;
  background: #ffffff;
  border-radius: 16px;
  padding: 26px 22px;
  border: 1px solid #f3f4f6;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.2s, transform 0.2s;
}

.plan-card:hover {
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.plan-card.featured {
  border-color: #2563eb;
  box-shadow: 0 0 0 1px #2563eb, 0 8px 32px rgba(37, 99, 235, 0.1);
}

.plan-badge {
  position: absolute;
  top: -11px;
  left: 50%;
  transform: translateX(-50%);
  background: #2563eb;
  color: #ffffff;
  font-size: 11px;
  font-weight: 600;
  padding: 4px 14px;
  border-radius: 20px;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  white-space: nowrap;
}

.plan-header {
  margin-bottom: 18px;
}

.plan-name {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 6px 0;
}

.plan-desc {
  font-size: 13px;
  color: #6b7280;
  line-height: 1.5;
  margin: 0;
  min-height: 38px;
}

.plan-price {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 18px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f3f4f6;
}

.price-inner {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.price-row {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 4px;
}

.price-value {
  font-size: 32px;
  font-weight: 800;
  color: #111827;
  letter-spacing: -0.8px;
}

.price-period {
  font-size: 14px;
  color: #9ca3af;
  font-weight: 500;
}

.price-save {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.save-badge {
  font-size: 11px;
  font-weight: 600;
  color: #059669;
  background: #f0fdf4;
  padding: 3px 8px;
  border-radius: 6px;
}

.save-note {
  font-size: 11px;
  color: #9ca3af;
}

.price-enter-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.price-leave-active {
  transition: opacity 0.12s ease, transform 0.12s ease;
}

.price-enter-from {
  opacity: 0;
  transform: translateY(6px);
}

.price-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

.plan-features {
  list-style: none;
  padding: 0;
  margin: 0 0 14px 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #374151;
  line-height: 1.4;
}

.plan-limits {
  margin-bottom: 16px;
}

.limit-item {
  font-size: 11px;
  color: #9ca3af;
  background: #f9fafb;
  border: 1px dashed #e5e7eb;
  border-radius: 8px;
  padding: 6px 10px;
  display: block;
}

.plan-btn {
  width: 100%;
  padding: 10px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-sizing: border-box;
}

.plan-btn.current {
  background: #f0fdf4;
  color: #059669;
  border: 1px solid #bbf7d0;
  cursor: default;
}

.plan-btn.change {
  background: #2563eb;
  color: #ffffff;
  border: none;
}

.plan-btn.change:hover {
  background: #1d4ed8;
}

@media (max-width: 767px) {
  .plans-head {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .plan-card {
    padding: 22px 18px;
  }

  .plan-desc {
    min-height: 0;
  }
}
</style>
