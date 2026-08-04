<template>
  <div class="alerts-list">
    <AlertCard v-for="alert in alerts" :key="alert.id" :alert="alert" />
  </div>
</template>

<script setup>
import AlertCard from './AlertCard.vue';

defineProps({
  alerts: { type: Array, required: true },
});
</script>

<style scoped>
.alerts-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
