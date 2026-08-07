<template>
  <div class="stats-card" :class="variantClass">
    <div class="card-header">
      <span class="card-title">{{ title }}</span>
      <div class="icon-wrapper" :class="variantClass">
        <svg v-if="variant === 'blue'" width="22" height="22" viewBox="0 0 22 22" fill="none">
          <circle cx="8" cy="7" r="3.5" stroke="currentColor" stroke-width="1.5" />
          <path d="M1 19c0-3.866 3.134-7 7-7s7 3.134 7 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
          <path d="M14 8h5M16.5 5.5v5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        </svg>
        <svg v-else-if="variant === 'red'" width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path d="M11 6v6M11 14h.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
          <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="1.5" />
        </svg>
        <svg v-else-if="variant === 'green'" width="22" height="22" viewBox="0 0 22 22" fill="none">
          <circle cx="11" cy="11" r="10" stroke="currentColor" stroke-width="1.5" />
          <path d="M9.5 11.5l3 3 5-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <svg v-else width="22" height="22" viewBox="0 0 22 22" fill="none">
          <circle cx="11" cy="11" r="3" stroke="currentColor" stroke-width="1.5" />
          <path d="M11 2V4M11 18V20M20 11H18M4 11H2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
          <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="1.5" />
        </svg>
      </div>
    </div>
    <p class="card-value">{{ value }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  title: { type: String, required: true },
  value: { type: String, required: true },
  variant: {
    type: String,
    default: 'blue',
    validator: (v) => ['blue', 'red', 'green'].includes(v),
  },
});

const variantClass = computed(() => `variant-${props.variant}`);
</script>

<style scoped>
.stats-card {
  background: #ffffff;
  border-radius: 12px;
  padding: var(--card-padding-alt);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
  border: 1px solid #f3f4f6;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.card-title {
  font-size: 13px;
  font-weight: 500;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.icon-wrapper {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-wrapper.variant-blue {
  background: #eff6ff;
  color: #2563eb;
}

.icon-wrapper.variant-red {
  background: #fef2f2;
  color: #ef4444;
}

.icon-wrapper.variant-green {
  background: #f0fdf4;
  color: #22c55e;
}

.card-value {
  font-size: 26px;
  font-weight: 700;
  color: #111827;
  letter-spacing: -0.3px;
}

.variant-red .card-value {
  color: #ef4444;
}
</style>