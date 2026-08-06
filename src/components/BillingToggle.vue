<template>
  <div class="hero-toggle">
    <span class="toggle-label" :class="{ active: !isYearly }">Monthly</span>
    <label class="toggle-switch">
      <input type="checkbox" :checked="isYearly" @change="toggle" />
      <span class="toggle-slider" />
    </label>
    <span class="toggle-label" :class="{ active: isYearly }">Annual</span>
    <span v-if="isYearly" class="toggle-save">Save {{ annualDiscount }}%</span>
  </div>
</template>

<script setup>
import { useBillingCycle } from '../composables/useBillingCycle';

const { isYearly, toggle, annualDiscount } = useBillingCycle();
</script>

<style scoped>
.hero-toggle {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 6px 20px;
  background: #f3f4f6;
  border-radius: 40px;
}

.toggle-label {
  font-size: 14px;
  font-weight: 500;
  color: #9ca3af;
  transition: color 0.15s;
}

.toggle-label.active {
  color: #111827;
  font-weight: 600;
}

.toggle-switch {
  position: relative;
  width: 44px;
  height: 24px;
  background: #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.2s;
}

.toggle-switch:has(input:checked) {
  background: #2563eb;
}

.toggle-switch input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background: #ffffff;
  border-radius: 50%;
  transition: transform 0.2s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
}

.toggle-switch:has(input:checked) .toggle-slider {
  transform: translateX(20px);
}

.toggle-save {
  font-size: 12px;
  font-weight: 600;
  color: #059669;
  background: #f0fdf4;
  padding: 4px 10px;
  border-radius: 6px;
}
</style>
