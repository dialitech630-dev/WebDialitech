<template>
  <div class="plan-card" :class="{ featured: plan.featured }">
    <div v-if="plan.featured" class="plan-badge">Recommended</div>
    <div class="plan-header">
      <h3 class="plan-name">{{ plan.name }}</h3>
      <p class="plan-desc">{{ plan.description }}</p>
    </div>
    <div class="plan-price">
      <Transition name="price" mode="out-in">
        <div :key="billingCycle" class="price-inner">
          <div class="price-row">
            <span class="price-value">{{ displayPrice }}</span>
            <span v-if="!isFree" class="price-period">{{ periodLabel }}</span>
          </div>
          <div v-if="showsDiscount(plan)" class="price-save">
            <span class="save-badge">Save {{ plan.discount }}%</span>
            <span class="save-note">{{ plan.billingNote }}</span>
          </div>
        </div>
      </Transition>
    </div>
    <ul class="plan-features">
      <li v-for="(feature, i) in plan.features" :key="i" class="feature-item">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="6" :stroke="plan.featured ? '#2563eb' : '#9ca3af'" stroke-width="1.3" />
          <path d="M5.5 8L7.5 10L11 5.5" :stroke="plan.featured ? '#2563eb' : '#6b7280'" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        {{ feature }}
      </li>
    </ul>
    <router-link to="/register" class="plan-btn" :class="plan.featured ? 'btn-primary' : 'btn-outline'">
      {{ plan.featured ? 'Get Started' : 'Choose Plan' }}
    </router-link>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useBillingCycle } from '../../../composables/useBillingCycle';

const props = defineProps({
  plan: { type: Object, required: true },
});

const { billingCycle, planPrice, planPriceLabel, planPeriodLabel, showsDiscount } = useBillingCycle();

const isFree = computed(() => planPrice(props.plan) === 0);
const displayPrice = computed(() => planPriceLabel(props.plan));
const periodLabel = computed(() => planPeriodLabel(props.plan));
</script>

<style scoped>
.plan-card {
  position: relative;
  background: #ffffff;
  border-radius: 20px;
  padding: 36px 32px;
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

@media (max-width: 767px) {
  .plan-card {
    padding: 28px 22px;
  }
}

.plan-card.featured {
  border-color: #2563eb;
  box-shadow: 0 0 0 1px #2563eb, 0 8px 32px rgba(37, 99, 235, 0.1);
  transform: scale(1.03);
}

.plan-badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: #2563eb;
  color: #ffffff;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 16px;
  border-radius: 20px;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  white-space: nowrap;
}

.plan-header {
  margin-bottom: 24px;
}

.plan-name {
  font-size: 22px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 8px 0;
}

.plan-desc {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.6;
  margin: 0;
}

.plan-price {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 28px;
  padding-bottom: 24px;
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
  gap: 4px;
}

.price-value {
  font-size: 42px;
  font-weight: 800;
  color: #111827;
  letter-spacing: -1px;
}

.price-period {
  font-size: 16px;
  color: #9ca3af;
  font-weight: 500;
}

.price-save {
  display: flex;
  align-items: center;
  gap: 8px;
}

.save-badge {
  font-size: 12px;
  font-weight: 600;
  color: #059669;
  background: #f0fdf4;
  padding: 3px 10px;
  border-radius: 6px;
}

.save-note {
  font-size: 12px;
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
  margin: 0 0 28px 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: #374151;
  line-height: 1.5;
}

.plan-btn {
  width: 100%;
  padding: 12px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  text-align: center;
  text-decoration: none;
  box-sizing: border-box;
}

.btn-primary {
  background: #2563eb;
  color: #ffffff;
  border: none;
}

.btn-primary:hover {
  background: #1d4ed8;
}

.btn-outline {
  background: transparent;
  color: #374151;
  border: 1px solid #e5e7eb;
}

.btn-outline:hover {
  background: #f3f4f6;
  border-color: #d1d5db;
}
</style>
