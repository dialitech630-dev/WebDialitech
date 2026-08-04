<template>
  <div class="locked-card" @click="$emit('openModal')">
    <div class="lock-icon">🔒</div>
    <h3 class="locked-title">{{ title }}</h3>
    <p class="locked-desc">{{ description }}</p>
    <button class="view-plans-btn">Upgrade Required</button>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  description: { type: String, default: 'This feature is available in a higher subscription plan. Upgrade to unlock it.' },
});

defineEmits(['openModal']);
</script>

<style scoped>
.locked-card {
  background: #ffffff;
  border: 2px dashed #e5e7eb;
  border-radius: 12px;
  padding: 32px 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.locked-card:hover {
  border-color: #d1d5db;
  background: #fafafa;
}

.lock-icon {
  font-size: 32px;
  line-height: 1;
  opacity: 0.6;
}

.locked-title {
  font-size: 16px;
  font-weight: 600;
  color: #9ca3af;
  margin: 0;
}

.locked-desc {
  font-size: 13px;
  color: #d1d5db;
  margin: 0;
  line-height: 1.4;
  max-width: 220px;
}

.view-plans-btn {
  margin-top: 8px;
  padding: 8px 20px;
  background: #f5f3ff;
  color: #7c3aed;
  border: 1px solid #ddd6fe;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}

.view-plans-btn:hover {
  background: #ede9fe;
  color: #6d28d9;
}
</style>
