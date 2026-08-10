<template>
  <slot v-if="allowed" />
  <slot v-else name="locked">
    <FeatureLockedCard
      v-if="showLocked"
      :title="resolvedLockTitle"
      :description="lockDescription || undefined"
      :button-text="lockButtonText || undefined"
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
  lockDescription: { type: String, default: '' },
  lockButtonText: { type: String, default: '' },
});

defineEmits(['openModal']);

const sub = useSubscriptionStore();
const allowed = computed(() => sub.can(props.feature));

const featureLabels = {
  dashboard: 'Inicio',
  patients: 'Pacientes',
  alerts: 'Alertas',
  reports: 'Reportes',
  statistics: 'Analíticas',
  settings: 'Configuración',
  administration: 'Gestión de usuarios',
  advancedMonitoring: 'Monitoreo avanzado',
  apiAccess: 'Acceso a la API',
  ai: 'Análisis IA',
};

const resolvedLockTitle = computed(() => props.lockTitle || `${featureLabels[props.feature] || 'Esta función'} está bloqueada`);
</script>
