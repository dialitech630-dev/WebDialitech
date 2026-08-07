<template>
  <div class="plan-selector">
    <router-link to="/pagos" class="plan-trigger" :title="t('navBar.payments')">
      <PlanBadge :plan="sub.planId" />
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
        <path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </router-link>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { useSubscriptionStore } from '../stores/subscriptionStore';
import PlanBadge from './PlanBadge.vue';

const { t } = useI18n();
const sub = useSubscriptionStore();
</script>

<style scoped>
.plan-selector {
  position: relative;
}

.plan-trigger {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
  color: #6b7280;
  text-decoration: none;
}

.plan-trigger:hover {
  background: #f3f4f6;
  border-color: #d1d5db;
}
</style>
