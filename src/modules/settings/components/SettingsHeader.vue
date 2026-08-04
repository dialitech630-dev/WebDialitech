<template>
  <header class="settings-header">
    <div class="header-left">
      <h1 class="page-title">Settings</h1>
      <p class="page-subtitle">Manage the application configuration and preferences</p>
      <nav class="breadcrumb">
        <router-link to="/dashboard" class="breadcrumb-link">Dashboard</router-link>
        <svg class="breadcrumb-sep" width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M5 3L8 6L5 9" stroke="#9ca3af" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <span class="breadcrumb-current">Settings</span>
      </nav>
    </div>
    <button class="save-btn" :class="{ disabled: !store.hasChanges }" :disabled="!store.hasChanges" @click="handleSave">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M3 1H13L15 3V13C15 14.1 14.1 15 13 15H3C1.9 15 1 14.1 1 13V3C1 1.9 1.9 1 3 1Z" stroke="currentColor" stroke-width="1.5" />
        <path d="M11 1V6H5V1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        <circle cx="8" cy="10" r="2" stroke="currentColor" stroke-width="1.5" />
      </svg>
      Save Changes
    </button>
  </header>
</template>

<script setup>
import { useAppearanceStore } from '../../../stores/appearanceStore';

const store = useAppearanceStore();

function handleSave() {
  store.save();
  if (window.__toast) window.__toast.success('Settings updated successfully.');
}
</script>

<style scoped>
.settings-header {
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

.save-btn {
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
  transition: all 0.15s;
  white-space: nowrap;
  margin-top: 36px;
}

.save-btn:hover:not(.disabled) {
  background: #1d4ed8;
}

.save-btn.disabled {
  background: #d1d5db;
  cursor: not-allowed;
  opacity: 0.6;
}

/* Responsive */
@media (max-width: 767px) {
  .settings-header {
    flex-direction: column;
    gap: 16px;
    margin-bottom: 20px;
  }

  .save-btn {
    margin-top: 0;
  }

  .page-title {
    font-size: 22px;
  }
}
</style>
