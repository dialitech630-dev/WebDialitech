<template>
  <div class="plan-selector" ref="wrapperRef">
    <button class="plan-trigger" @click.stop="toggle" aria-haspopup="menu">
      <PlanBadge :plan="sub.planId" />
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" :class="{ open: open }">
        <path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>

    <Transition name="dropdown">
      <div v-if="open" class="plan-dropdown" role="menu" @click.stop>
        <div class="dropdown-header">
          <span class="dropdown-title">Current Plan</span>
        </div>
        <div class="dropdown-body">
          <button
            v-for="p in sub.availablePlans"
            :key="p.id"
            class="plan-option"
            :class="{ current: p.isCurrent }"
            :disabled="p.isCurrent"
            role="menuitem"
            @click="selectPlan(p)"
          >
            <span class="opt-name">{{ p.name }}</span>
            <span class="opt-price">{{ formatPrice(p) }}</span>
            <svg v-if="p.isCurrent" class="opt-check" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 8.5L6.5 11L12 5" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </Transition>

    <ChangePlanModal
      v-if="selectedPlan"
      :new-plan="selectedPlan"
      @close="selectedPlan = null"
      @changed="selectedPlan = null"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useSubscriptionStore } from '../stores/subscriptionStore';
import { useBillingCycle } from '../composables/useBillingCycle';
import PlanBadge from './PlanBadge.vue';
import ChangePlanModal from '../modules/settings/components/ChangePlanModal.vue';

const sub = useSubscriptionStore();
const { formatPrice } = useBillingCycle();
const open = ref(false);
const wrapperRef = ref(null);
const selectedPlan = ref(null);

function toggle() {
  open.value = !open.value;
}

function selectPlan(plan) {
  if (plan.isCurrent) return;
  open.value = false;
  selectedPlan.value = plan;
}

function onClickOutside(e) {
  if (wrapperRef.value && !wrapperRef.value.contains(e.target)) {
    open.value = false;
  }
}

onMounted(() => {
  document.addEventListener('click', onClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', onClickOutside);
});
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
}

.plan-trigger:hover {
  background: #f3f4f6;
  border-color: #d1d5db;
}

.plan-trigger svg.open {
  transform: rotate(180deg);
}

.plan-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 240px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.14), 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid #e5e7eb;
  overflow: hidden;
  z-index: 100;
}

.dropdown-enter-active {
  transition: all 0.2s ease-out;
}

.dropdown-leave-active {
  transition: all 0.15s ease-in;
}

.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}

.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.dropdown-header {
  padding: 12px 16px 8px;
  border-bottom: 1px solid #f3f4f6;
}

.dropdown-title {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  color: #9ca3af;
}

.dropdown-body {
  padding: 6px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.plan-option {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 10px 12px;
  border: none;
  background: transparent;
  border-radius: 8px;
  cursor: pointer;
  text-align: left;
  transition: background 0.15s;
}

.plan-option:hover:not(:disabled) {
  background: #f3f4f6;
}

.plan-option.current {
  background: #eff6ff;
  cursor: default;
}

.opt-name {
  flex: 1;
  font-size: 13px;
  font-weight: 600;
  color: #111827;
}

.opt-price {
  font-size: 12px;
  color: #6b7280;
}

.opt-check {
  flex-shrink: 0;
}
</style>
