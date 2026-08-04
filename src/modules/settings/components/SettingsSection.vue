<template>
  <div class="settings-card">
    <h3 class="card-title">{{ title }}</h3>
    <p v-if="description" class="card-desc">{{ description }}</p>
    <div class="card-body">
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  description: { type: String, default: '' },
});
</script>

<style scoped>
.settings-card {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
  border: 1px solid #f3f4f6;
  padding: 24px 28px;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 4px 0;
}

.card-desc {
  font-size: 13px;
  color: #6b7280;
  margin: 0 0 20px 0;
}

.card-body {
  font-size: 14px;
  color: #374151;
}
</style>
