<template>
  <nav class="settings-sidebar">
    <ul class="sidebar-menu">
      <li
        v-for="item in menuItems"
        :key="item.key"
        class="sidebar-item"
        :class="{ active: activeSection === item.key }"
        @click="$emit('select', item.key)"
      >
        <component :is="item.icon" class="menu-icon" />
        <span class="menu-label">{{ item.label }}</span>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import ProfileIcon from './icons/ProfileIcon.vue';
import AccountIcon from './icons/AccountIcon.vue';
import NotificationsIcon from './icons/NotificationsIcon.vue';
import SecurityIcon from './icons/SecurityIcon.vue';
import AppearanceIcon from './icons/AppearanceIcon.vue';
import SubscriptionIcon from './icons/SubscriptionIcon.vue';
import SystemIcon from './icons/SystemIcon.vue';

defineProps({
  activeSection: { type: String, required: true },
});

defineEmits(['select']);

const menuItems = [
  { key: 'profile', label: 'Profile', icon: ProfileIcon },
  { key: 'account', label: 'Account', icon: AccountIcon },
  { key: 'notifications', label: 'Notifications', icon: NotificationsIcon },
  { key: 'security', label: 'Security', icon: SecurityIcon },
  { key: 'appearance', label: 'Appearance', icon: AppearanceIcon },
  { key: 'subscription', label: 'Subscription / Plan', icon: SubscriptionIcon },
  { key: 'system', label: 'System Information', icon: SystemIcon },
];
</script>

<style scoped>
.settings-sidebar {
  width: 240px;
  flex-shrink: 0;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
  border: 1px solid #f3f4f6;
  padding: 8px;
  height: fit-content;
  position: sticky;
  top: 32px;
}

.sidebar-menu {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.sidebar-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 10px;
  cursor: pointer;
  color: #6b7280;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.15s;
  user-select: none;
}

.sidebar-item:hover {
  background: #f3f4f6;
  color: #374151;
}

.sidebar-item.active {
  background: #eff6ff;
  color: #2563eb;
  font-weight: 600;
}

.menu-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.menu-label {
  white-space: nowrap;
}

/* Responsive */
@media (max-width: 767px) {
  .settings-sidebar {
    width: 100%;
    position: static;
    top: auto;
    padding: 6px;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }

  .settings-sidebar::-webkit-scrollbar {
    display: none;
  }

  .sidebar-menu {
    flex-direction: row;
    gap: 4px;
    width: max-content;
    min-width: 100%;
  }

  .sidebar-item {
    flex-direction: column;
    gap: 4px;
    padding: 10px 14px;
    text-align: center;
  }

  .menu-label {
    font-size: 12px;
  }
}
</style>
