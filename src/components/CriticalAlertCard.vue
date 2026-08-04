<template>
  <div class="alert-card">
    <div class="alert-indicator" :class="statusClass" />
    <div class="alert-content">
      <div class="alert-header">
        <strong class="patient-name">{{ patient }}</strong>
        <span class="alert-time">{{ time }}</span>
      </div>
      <p class="alert-type">{{ type }}</p>
      <div class="alert-footer">
        <StatusBadge :status="status" />
      </div>
    </div>
  </div>
</template>

<script setup>
import StatusBadge from './StatusBadge.vue';
import { computed } from 'vue';

const props = defineProps({
  patient: { type: String, required: true },
  type: { type: String, required: true },
  time: { type: String, required: true },
  status: { type: String, required: true },
});

const statusClass = computed(() => ({
  indicator: true,
  critical: props.status === 'Critical',
  warning: props.status === 'Warning',
}));
</script>

<style scoped>
.alert-card {
  display: flex;
  background: #ffffff;
  border: 1px solid #f3f4f6;
  border-radius: 10px;
  overflow: hidden;
  transition: box-shadow 0.15s;
}

.alert-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.alert-indicator {
  width: 4px;
  flex-shrink: 0;
}

.alert-indicator.critical {
  background: #ef4444;
}

.alert-indicator.warning {
  background: #f59e0b;
}

.alert-content {
  padding: 14px 16px;
  flex: 1;
  min-width: 0;
}

.alert-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.patient-name {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}

.alert-time {
  font-size: 12px;
  color: #9ca3af;
  white-space: nowrap;
}

.alert-type {
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 10px;
}

.alert-footer {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>