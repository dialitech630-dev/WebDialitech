<template>
  <div class="alert-card" :class="`priority-${alert.priority.toLowerCase()}`">
    <div class="alert-icon" :class="`priority-${alert.priority.toLowerCase()}`">
      <svg v-if="alert.priority === 'Critical'" width="22" height="22" viewBox="0 0 22 22" fill="none">
        <circle cx="11" cy="11" r="10" stroke="currentColor" stroke-width="1.5" />
        <path d="M11 6V12" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        <circle cx="11" cy="16" r="1.5" fill="currentColor" />
      </svg>
      <svg v-else-if="alert.priority === 'High'" width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M11 2L2 20H20L11 2Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
        <path d="M11 9V14" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        <circle cx="11" cy="17" r="1.5" fill="currentColor" />
      </svg>
      <svg v-else-if="alert.priority === 'Medium'" width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="3" y="8" width="16" height="12" rx="2" stroke="currentColor" stroke-width="1.5" />
        <path d="M7 8V6C7 4 9 3 11 3C13 3 15 4 15 6V8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        <circle cx="11" cy="13" r="1.5" stroke="currentColor" stroke-width="1.5" />
      </svg>
      <svg v-else width="22" height="22" viewBox="0 0 22 22" fill="none">
        <circle cx="11" cy="11" r="10" stroke="currentColor" stroke-width="1.5" />
        <path d="M7 11L10 14L15 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </div>
    <div class="alert-body">
      <div class="alert-top">
        <div class="alert-title">
          <span class="alert-patient">{{ alert.patientName }}</span>
          <span class="alert-type">{{ alert.type }}</span>
        </div>
        <div class="alert-meta">
          <span class="alert-date">{{ alert.date }}</span>
          <span class="alert-time">{{ alert.time }}</span>
        </div>
      </div>
      <p class="alert-desc">{{ alert.description }}</p>
      <div class="alert-bottom">
        <div class="alert-badges">
          <PriorityBadge :priority="alert.priority" />
          <StatusBadge :status="alert.status" />
        </div>
        <AlertActions />
      </div>
    </div>
  </div>
</template>

<script setup>
import PriorityBadge from './PriorityBadge.vue';
import StatusBadge from '../../../components/StatusBadge.vue';
import AlertActions from './AlertActions.vue';

defineProps({
  alert: { type: Object, required: true },
});
</script>

<style scoped>
.alert-card {
  display: flex;
  gap: 16px;
  padding: 20px 24px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
  border: 1px solid #f3f4f6;
  transition: box-shadow 0.15s;
}

.alert-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.alert-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.alert-icon.priority-critical {
  background: #fef2f2;
  color: #dc2626;
}

.alert-icon.priority-high {
  background: #fff7ed;
  color: #ea580c;
}

.alert-icon.priority-medium {
  background: #fffbeb;
  color: #d97706;
}

.alert-icon.priority-low {
  background: #f0fdf4;
  color: #16a34a;
}

.alert-body {
  flex: 1;
  min-width: 0;
}

.alert-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 8px;
}

.alert-title {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.alert-patient {
  font-size: 15px;
  font-weight: 600;
  color: #111827;
}

.alert-type {
  font-size: 13px;
  color: #6b7280;
  font-weight: 500;
}

.alert-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.alert-date {
  font-size: 13px;
  color: #6b7280;
  font-weight: 500;
}

.alert-time {
  font-size: 12px;
  color: #9ca3af;
}

.alert-desc {
  font-size: 14px;
  color: #374151;
  margin: 0 0 14px 0;
  line-height: 1.5;
}

.alert-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.alert-badges {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
