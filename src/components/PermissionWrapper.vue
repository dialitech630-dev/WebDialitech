<template>
  <slot v-if="allowed" />
  <slot v-else name="locked">
    <FeatureLockedCard
      v-if="showLocked"
      :title="resolvedLockTitle"
      @open-modal="$emit('openModal', feature)"
    />
  </slot>
</template>

<script setup>
import { computed } from 'vue';
import { useSubscriptionStore } from '../stores/subscriptionStore';
import FeatureLockedCard from './FeatureLockedCard.vue';

const props = defineProps({
  feature: { type: String, required: true },
  showLocked: { type: Boolean, default: true },
  lockTitle: { type: String, default: '' },
});

defineEmits(['openModal']);

const sub = useSubscriptionStore();
const allowed = computed(() => sub.can(props.feature));

const featureLabels = {
  dashboard: 'Dashboard',
  patients: 'Patients',
  alerts: 'Alerts',
  reports: 'Reports',
  statistics: 'Analytics',
  settings: 'Settings',
  administration: 'User Management',
  advancedMonitoring: 'Advanced Monitoring',
  apiAccess: 'API Access',
};

const resolvedLockTitle = computed(() => props.lockTitle || `${featureLabels[props.feature] || 'This feature'} is locked`);
</script>
