<template>
  <span class="status-badge" :class="statusClass">{{ status }}</span>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  status: { type: String, required: true },
});

const statusClass = computed(() => {
  const s = props.status.toLowerCase();
  if (s === 'critical' || s === 'blocked') return 'badge-critical';
  if (s === 'warning' || s === 'pending') return 'badge-warning';
  if (s === 'inactive' || s === 'dismissed') return 'badge-inactive';
  if (s === 'active' || s === 'resolved') return 'badge-active';
  return 'badge-normal';
});
</script>

<style scoped>
.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  line-height: 1.6;
}

.badge-critical {
  background: #fef2f2;
  color: #dc2626;
}

.badge-warning {
  background: #fffbeb;
  color: #d97706;
}

.badge-normal {
  background: #f0fdf4;
  color: #16a34a;
}

.badge-inactive {
  background: #f3f4f6;
  color: #6b7280;
}

.badge-active {
  background: #eff6ff;
  color: #2563eb;
}
</style>