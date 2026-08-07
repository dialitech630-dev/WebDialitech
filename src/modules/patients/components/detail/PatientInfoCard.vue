<template>
  <div class="info-card">
    <h3 class="info-card-title">{{ title }}</h3>
    <div class="info-card-body">
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
});
</script>

<style scoped>
.info-card {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
  border: 1px solid #f3f4f6;
  padding: var(--card-padding-alt);
}

.info-card-title {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 16px 0;
  padding-bottom: 12px;
  border-bottom: 1px solid #f3f4f6;
}

.info-card-body {
  font-size: 14px;
  color: #374151;
}
</style>
