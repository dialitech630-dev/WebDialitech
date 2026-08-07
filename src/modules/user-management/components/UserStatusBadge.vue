<template>
  <span class="user-status-badge" :class="badgeClass">{{ label }}</span>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
  status: { type: String, required: true },
});

const badgeClass = computed(() => {
  const s = props.status.toLowerCase();
  if (s === 'active') return 'status-active';
  if (s === 'inactive') return 'status-inactive';
  if (s === 'pending') return 'status-pending';
  if (s === 'blocked') return 'status-blocked';
  return 'status-default';
});

const label = computed(() => {
  const s = props.status.toLowerCase();
  if (s === 'active') return t('common.active');
  if (s === 'inactive') return t('common.inactive');
  if (s === 'pending') return t('common.pending');
  if (s === 'blocked') return t('common.blocked');
  return props.status;
});
</script>

<style scoped>
.user-status-badge {
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

.status-active {
  background: #f0fdf4;
  color: #16a34a;
}

.status-inactive {
  background: #f3f4f6;
  color: #6b7280;
}

.status-pending {
  background: #fffbeb;
  color: #d97706;
}

.status-blocked {
  background: #fef2f2;
  color: #dc2626;
}

.status-default {
  background: #f3f4f6;
  color: #6b7280;
}
</style>
