<template>
  <div class="actions">
    <router-link class="action-btn" title="View patient" :to="`/patients/${patientId}`">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 3C4.5 3 1.5 8 1.5 8C1.5 8 4.5 13 8 13C11.5 13 14.5 8 14.5 8C14.5 8 11.5 3 8 3Z" stroke="#6b7280" stroke-width="1.3" />
        <circle cx="8" cy="8" r="2.5" stroke="#6b7280" stroke-width="1.3" />
      </svg>
    </router-link>
    <button class="action-btn delete-btn" title="Delete patient" @click="$emit('delete')">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M3 4h10M5.5 4V2.5a1 1 0 011-1h3a1 1 0 011 1V4M12 4v9a1 1 0 01-1 1H5a1 1 0 01-1-1V4" stroke="#6b7280" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M6.5 7v4M9.5 7v4" stroke="#6b7280" stroke-width="1.3" stroke-linecap="round" />
      </svg>
    </button>
  </div>
</template>

<script setup>
defineProps({
  patientId: { type: [Number, String], required: true },
});
defineEmits(['delete']);
</script>

<style scoped>
.actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.action-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s;
  text-decoration: none;
}

.action-btn:hover {
  background: #f3f4f6;
}

.action-btn:hover svg path,
.action-btn:hover svg circle {
  stroke: #2563eb;
}

.delete-btn:hover svg path {
  stroke: #dc2626;
}
</style>
