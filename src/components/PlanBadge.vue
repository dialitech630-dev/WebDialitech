<template>
  <span class="plan-badge" :class="planClass">{{ planName }}</span>
</template>

<script setup>
import { computed } from 'vue';
import { PLANS } from '../config/plans';

const props = defineProps({
  plan: { type: String, default: 'Standard' },
});

const planName = computed(() => {
  return PLANS[props.plan]?.name || 'Standard';
});

const planClass = computed(() => `plan-${String(props.plan).toLowerCase()}`);
</script>

<style scoped>
.plan-badge {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  white-space: nowrap;
}

.plan-standard {
  background: #dbeafe;
  color: #2563eb;
}

.plan-pro {
  background: #e0e7ff;
  color: #4f46e5;
}

.plan-premium {
  background: #f3e8ff;
  color: #7c3aed;
}
</style>
