<template>
  <header class="alerts-header">
    <div class="header-left">
      <h1 class="page-title">Alerts</h1>
      <p class="page-subtitle">Monitor and manage system alerts</p>
      <nav class="breadcrumb">
        <router-link to="/dashboard" class="breadcrumb-link">Dashboard</router-link>
        <svg class="breadcrumb-sep" width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M5 3L8 6L5 9" stroke="#9ca3af" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <span class="breadcrumb-current">Alerts</span>
      </nav>
    </div>
    <button class="mark-btn" @click="$emit('mark-all-read')">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M1 8H3L5 3L8 13L11 6L13 10H15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      Mark all as read
    </button>
  </header>
</template>

<script setup>
defineEmits(['mark-all-read']);
</script>

<style scoped>
.alerts-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 28px;
  gap: 24px;
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
  margin: 0 0 12px 0;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 6px;
}

.breadcrumb-link {
  font-size: 13px;
  color: #2563eb;
  text-decoration: none;
  font-weight: 500;
}

.breadcrumb-link:hover {
  text-decoration: underline;
}

.breadcrumb-sep {
  flex-shrink: 0;
}

.breadcrumb-current {
  font-size: 13px;
  color: #9ca3af;
  font-weight: 500;
}

.mark-btn {
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
  margin-top: 36px;
}

.mark-btn:hover {
  background: #1d4ed8;
}

/* Responsive */
@media (max-width: 767px) {
  .alerts-header {
    flex-direction: column;
    gap: 16px;
    margin-bottom: 20px;
  }

  .mark-btn {
    margin-top: 0;
  }

  .page-title {
    font-size: 22px;
  }
}
</style>
