<template>
  <header class="patients-header">
    <div class="header-left">
      <h1 class="page-title">{{ title }}</h1>
      <p class="page-subtitle">{{ subtitle }}</p>
    </div>
    <button class="add-btn" @click="$emit('add')">
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M9 3V15M3 9H15" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      </svg>
      Agregar paciente
    </button>
  </header>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
});
defineEmits(['add']);
</script>

<style scoped>
.patients-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 28px;
}

.header-left {
  flex: 1;
}

.page-title {
  font-size: 26px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 4px 0;
  letter-spacing: -0.5px;
}

.page-subtitle {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.add-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #2563eb;
  color: #ffffff;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
  white-space: nowrap;
}

.add-btn:hover {
  background: #1d4ed8;
}

/* Responsive */
@media (max-width: 767px) {
  .patients-header {
    flex-direction: column;
    gap: 16px;
    margin-bottom: 20px;
  }

  .page-title {
    font-size: 22px;
  }

  .add-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
