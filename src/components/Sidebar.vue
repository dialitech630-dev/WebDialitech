<template>
  <aside
    class="sidebar"
    :class="{
      'sidebar-open': layout.sidebarOpen.value,
      'sidebar-collapsed': layout.sidebarCollapsed.value,
    }"
  >
    <button class="sidebar-close" @click="layout.closeSidebar()" :aria-label="t('sidebar.closeMenu')">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M5 5L15 15M15 5L5 15" stroke="#6b7280" stroke-width="1.5" stroke-linecap="round" />
      </svg>
    </button>

    <div class="brand">
      <div class="logo">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="8" fill="#2563eb" />
          <path d="M8 16C8 11.5817 11.5817 8 16 8V24C11.5817 24 8 20.4183 8 16Z" fill="#fff" fill-opacity="0.9" />
          <path d="M16 8C20.4183 8 24 11.5817 24 16S20.4183 24 16 24" stroke="#fff" stroke-width="1.5" stroke-linecap="round" />
          <circle cx="16" cy="16" r="3" fill="#fff" />
        </svg>
      </div>
      <div class="brand-info">
        <span class="brand-name">DiaMonitor</span>
        <PlanBadge :plan="sub.planId" />
      </div>
    </div>
    <nav class="menu">
      <template v-for="item in visibleModules" :key="item.key">
        <div
          v-if="item.locked"
          class="menu-item locked"
          @click="onLockedClick"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="4" y="8" width="12" height="10" rx="2" stroke="currentColor" stroke-width="1.5" />
            <path d="M7 8V6C7 4 8.5 3 10 3C11.5 3 13 4 13 6V8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
            <circle cx="10" cy="12" r="1" fill="currentColor" />
            <path d="M10 12V14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
          </svg>
          {{ t('nav.' + item.key) }}
        </div>
        <router-link v-else :to="item.route" class="menu-item">
          <svg v-if="item.icon === 'dashboard'" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="2" y="2" width="7" height="7" rx="1.5" fill="currentColor" />
            <rect x="11" y="2" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.4" />
            <rect x="2" y="11" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.4" />
            <rect x="11" y="11" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.4" />
          </svg>
          <svg v-else-if="item.icon === 'patients'" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="7" cy="6" r="3" stroke="currentColor" stroke-width="1.5" />
            <path d="M1 17c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
            <path d="M13 7h6M16 4v6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
          </svg>
          <svg v-else-if="item.icon === 'alerts'" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 2a6 6 0 0 0-6 6v4l-2 2v1h16v-1l-2-2V8a6 6 0 0 0-6-6Z" stroke="currentColor" stroke-width="1.5" />
            <circle cx="13.5" cy="4" r="3.5" fill="#ef4444" stroke="#fff" stroke-width="1.5" />
            <path d="M8 17a2 2 0 0 0 4 0" stroke="currentColor" stroke-width="1.5" />
          </svg>
          <svg v-else-if="item.icon === 'users'" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="7" cy="6" r="2.5" stroke="currentColor" stroke-width="1.5" />
            <circle cx="14" cy="6" r="2.5" stroke="currentColor" stroke-width="1.5" />
            <path d="M1 16c0-2.5 2-4.5 4.5-4.5h3c2.5 0 4.5 2 4.5 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
            <path d="M14 11.5c2.5 0 4.5 2 4.5 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
          </svg>
          <svg v-else width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="3" stroke="currentColor" stroke-width="1.5" />
            <path d="M10 2V4M10 16V18M18 10H16M4 10H2M15.66 4.34L-1.34 9.66M4.34 4.34L9.66 9.66" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
          </svg>
          {{ t('nav.' + item.key) }}
        </router-link>
      </template>
    </nav>
    <div class="user-card">
      <UserAvatar size="sm" />
      <div class="user-details">
        <p class="user-name">{{ authStore.fullName || authStore.userName }}</p>
        <p class="user-role">{{ userRoleLabel }}</p>
      </div>
    </div>
    <button class="collapse-toggle" @click="layout.toggleCollapsed()" :aria-label="t('sidebar.collapseSidebar')">
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M11 13L6 9L11 5" stroke="#6b7280" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      <span class="collapse-label">{{ t('sidebar.collapse') }}</span>
    </button>
  </aside>

  <UpgradePlanModal
    :visible="showUpgradeModal"
    :current-plan="sub.planId"
    @close="showUpgradeModal = false"
    @select="onSelectPlan"
  />
</template>

<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '../stores/authStore';
import { useSubscriptionStore } from '../stores/subscriptionStore';
import { useLayout } from '../composables/useLayout';
import PlanBadge from './PlanBadge.vue';
import UserAvatar from './UserAvatar.vue';
import UpgradePlanModal from './UpgradePlanModal.vue';

const { t } = useI18n();
const authStore = useAuthStore();
const sub = useSubscriptionStore();
const layout = useLayout();
const showUpgradeModal = ref(false);

const visibleModules = computed(() => {
  return sub.sidebarModules.filter((m) => !m.hidden);
});

const userRoleLabel = computed(() => {
  return t(`roles.${sub.role}`) || 'Cuidador';
});

function onLockedClick() {
  showUpgradeModal.value = true;
}

async function onSelectPlan(planId) {
  showUpgradeModal.value = false;
  const result = await sub.changePlan(planId);
  if (result.success) {
    if (window.__toast) window.__toast.success(t('settings.subscriptionUpdated'));
  } else if (window.__toast) {
    window.__toast.error(result.error);
  }
}
</script>

<style scoped>
.sidebar {
  width: var(--sidebar-width);
  background: #ffffff;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: sticky;
  top: 0;
  flex-shrink: 0;
  z-index: 60;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.03);
  transition: width 0.2s ease, transform 0.25s ease;
}

.sidebar-close {
  display: none;
  position: absolute;
  top: 12px;
  right: 12px;
  width: 34px;
  height: 34px;
  border: none;
  background: #f3f4f6;
  border-radius: 50%;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 2;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 20px 20px 24px;
  white-space: nowrap;
  overflow: hidden;
}

.brand-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
  transition: opacity 0.15s ease;
}

.brand-name {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
}

.menu {
  flex: 1;
  padding: 0 12px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow-y: auto;
  overflow-x: hidden;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  text-decoration: none;
  color: #6b7280;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.15s ease;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
}

.menu-item svg {
  flex-shrink: 0;
}

.menu-item:hover {
  background: #f3f4f6;
  color: #374151;
}

.menu-item.active {
  background: #eff6ff;
  color: #2563eb;
  font-weight: 600;
}

.menu-item.locked {
  opacity: 0.5;
  cursor: pointer;
}

.menu-item.locked:hover {
  opacity: 0.7;
  background: #f3f4f6;
}

.user-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 20px;
  border-top: 1px solid #e5e7eb;
  margin: 12px;
  background: #f9fafb;
  border-radius: 10px;
  white-space: nowrap;
}

.user-details {
  min-width: 0;
  transition: opacity 0.15s ease;
}

.user-name {
  font-size: 13px;
  font-weight: 600;
  color: #111827;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-role {
  font-size: 11px;
  color: #9ca3af;
}

.collapse-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin: 0 12px 12px;
  padding: 9px 12px;
  border: none;
  background: transparent;
  border-radius: 8px;
  color: #6b7280;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s;
  flex-shrink: 0;
}

.collapse-toggle:hover {
  background: #f3f4f6;
  color: #374151;
}

/* Estado colapsado (>=1024) */
.sidebar-collapsed {
  width: 76px;
}

.sidebar-collapsed .brand {
  padding: 20px 0 24px;
  justify-content: center;
}

.sidebar-collapsed .brand-info,
.sidebar-collapsed .user-details {
  opacity: 0;
  width: 0;
  overflow: hidden;
  display: none;
}

.sidebar-collapsed .menu {
  padding: 0 10px;
}

.sidebar-collapsed .menu-item {
  justify-content: center;
  padding: 10px;
}

.sidebar-collapsed .user-card {
  justify-content: center;
  padding: 12px 0;
  margin: 8px;
}

.sidebar-collapsed .collapse-toggle {
  justify-content: center;
  padding: 9px 0;
}

.sidebar-collapsed .collapse-toggle svg {
  transform: rotate(180deg);
}

.sidebar-collapsed .collapse-label {
  display: none;
}

/* Modo drawer: tablet y movil (<1024) */
@media (max-width: 1023px) {
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    height: 100dvh;
    transform: translateX(-100%);
    box-shadow: none;
  }

  .sidebar.sidebar-open {
    transform: translateX(0);
    box-shadow: 0 0 40px rgba(0, 0, 0, 0.25);
  }

  .sidebar-close {
    display: flex;
  }

  .collapse-toggle {
    display: none;
  }

  .sidebar-collapsed {
    width: var(--sidebar-width);
  }

  .sidebar-collapsed .brand {
    padding: 20px 20px 24px;
    justify-content: flex-start;
  }

  .sidebar-collapsed .brand-info,
  .sidebar-collapsed .user-details {
    opacity: 1;
    width: auto;
    display: flex;
    overflow: visible;
  }

  .sidebar-collapsed .menu {
    padding: 0 12px;
  }

  .sidebar-collapsed .menu-item {
    justify-content: flex-start;
    padding: 10px 12px;
  }

  .sidebar-collapsed .user-card {
    justify-content: flex-start;
    padding: 16px 20px;
    margin: 12px;
  }
}
</style>
