<template>
  <span class="priority-badge" :class="badgeClass">{{ priority }}</span>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  priority: { type: String, required: true },
});

const badgeClass = computed(() => {
  const p = props.priority.toLowerCase();
  if (p === 'critical') return 'prio-critical';
  if (p === 'high') return 'prio-high';
  if (p === 'medium') return 'prio-medium';
  if (p === 'low') return 'prio-low';
  return 'prio-default';
});
</script>

<style scoped>
.priority-badge {
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

.prio-critical {
  background: #fef2f2;
  color: #dc2626;
}

.prio-high {
  background: #fff7ed;
  color: #ea580c;
}

.prio-medium {
  background: #fffbeb;
  color: #d97706;
}

.prio-low {
  background: #f0fdf4;
  color: #16a34a;
}

.prio-default {
  background: #f3f4f6;
  color: #6b7280;
}
</style>
