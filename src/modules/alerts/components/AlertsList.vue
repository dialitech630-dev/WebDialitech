<template>
  <div class="alerts-list">
    <AlertCard
      v-for="alert in alerts"
      :key="alert.id"
      :alert="alert"
      @resolve="$emit('resolve', $event)"
      @dismiss="$emit('dismiss', $event)"
    />
  </div>
</template>

<script setup>
import AlertCard from './AlertCard.vue';

defineProps({
  alerts: { type: Array, required: true },
});

defineEmits(['resolve', 'dismiss']);
</script>

<style scoped>
.alerts-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
