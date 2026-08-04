<template>
  <SettingsSection title="Notifications" description="Configure your notification preferences">
    <div class="switches-list">
      <div class="switch-row">
        <div class="switch-info">
          <span class="switch-label">Email Notifications</span>
          <span class="switch-desc">Receive notifications via email</span>
        </div>
        <label class="toggle" :class="{ active: settings.notifications.email }">
          <input type="checkbox" checked disabled />
          <span class="toggle-slider" />
        </label>
      </div>
      <div class="switch-row">
        <div class="switch-info">
          <span class="switch-label">SMS Notifications</span>
          <span class="switch-desc">Receive notifications via SMS</span>
        </div>
        <label class="toggle" :class="{ active: settings.notifications.sms }">
          <input type="checkbox" disabled />
          <span class="toggle-slider" />
        </label>
      </div>
      <div class="switch-row">
        <div class="switch-info">
          <span class="switch-label">Push Notifications</span>
          <span class="switch-desc">Receive push notifications on mobile</span>
        </div>
        <label class="toggle" :class="{ active: settings.notifications.push }">
          <input type="checkbox" checked disabled />
          <span class="toggle-slider" />
        </label>
      </div>
      <div class="switch-row">
        <div class="switch-info">
          <span class="switch-label">Critical Alerts</span>
          <span class="switch-desc">Immediate alerts for critical events</span>
        </div>
        <label class="toggle" :class="{ active: settings.notifications.criticalAlerts }">
          <input type="checkbox" checked disabled />
          <span class="toggle-slider" />
        </label>
      </div>
      <div class="switch-row">
        <div class="switch-info">
          <span class="switch-label">Weekly Reports</span>
          <span class="switch-desc">Receive weekly summary reports</span>
        </div>
        <label class="toggle" :class="{ active: settings.notifications.weeklyReports }">
          <input type="checkbox" disabled />
          <span class="toggle-slider" />
        </label>
      </div>
    </div>
  </SettingsSection>
</template>

<script setup>
import { settings } from '../data/settings.js';
import SettingsSection from './SettingsSection.vue';
</script>

<style scoped>
.switches-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.switch-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #f3f4f6;
}

.switch-row:last-child {
  border-bottom: none;
}

.switch-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.switch-label {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}

.switch-desc {
  font-size: 12px;
  color: #9ca3af;
}

.toggle {
  position: relative;
  width: 44px;
  height: 24px;
  background: #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.2s;
  flex-shrink: 0;
}

.toggle.active {
  background: #2563eb;
}

.toggle input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background: #ffffff;
  border-radius: 50%;
  transition: transform 0.2s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
}

.toggle.active .toggle-slider {
  transform: translateX(20px);
}

/* Responsive */
@media (max-width: 767px) {
  .switch-row {
    align-items: flex-start;
  }
}
</style>
