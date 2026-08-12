<template>
  <header class="topnavbar">
    <div class="left-section">
      <button
        class="hamburger-btn"
        :aria-expanded="layout.sidebarOpen.value"
        :aria-label="t('sidebar.toggleMenu')"
        @click="layout.toggleSidebar()"
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path d="M2 6h18M2 11h18M2 16h18" stroke="#374151" stroke-width="1.8" stroke-linecap="round" />
        </svg>
      </button>

      <div class="search-bar">
        <svg class="search-icon" width="18" height="18" viewBox="0 0 18 18" fill="none">
          <circle cx="8" cy="8" r="5" stroke="#9ca3af" stroke-width="1.5" />
          <path d="M11.5 11.5L16 16" stroke="#9ca3af" stroke-width="1.5" stroke-linecap="round" />
        </svg>
        <input
          type="text"
          class="search-input"
          :placeholder="t('navBar.searchPlaceholder')"
        />
      </div>
    </div>
    <div class="right-section">
      <PlanSelector />

      <div class="notification-wrapper" ref="wrapperRef">
        <button class="notification-btn" @click="toggleDropdown">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 2a6 6 0 0 0-6 6v4l-2 2v1h16v-1l-2-2V8a6 6 0 0 0-6-6Z" stroke="#6b7280" stroke-width="1.5" />
            <path d="M8 17a2 2 0 0 0 4 0" stroke="#6b7280" stroke-width="1.5" />
          </svg>
        </button>

        <Transition name="dropdown">
          <div v-if="showDropdown" class="notification-dropdown">
            <div class="dropdown-header">
              <h3 class="dropdown-title">{{ t('navBar.notifications') }}</h3>
              <button v-if="hasUnread" class="mark-read-btn" @click="markAllAsRead">{{ t('navBar.markAllAsRead') }}</button>
            </div>

            <div class="dropdown-body">
              <div v-if="loading" class="empty-state">
                <p class="empty-title">{{ t('navBar.loadingNotifications') }}</p>
              </div>
              <div v-else-if="!notifications.length" class="empty-state">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <rect x="4" y="8" width="32" height="26" rx="6" stroke="#d1d5db" stroke-width="1.5" />
                  <circle cx="20" cy="18" r="5" stroke="#d1d5db" stroke-width="1.5" />
                  <path d="M14 30c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="#d1d5db" stroke-width="1.5" stroke-linecap="round" />
                </svg>
                <p class="empty-title">{{ t('navBar.noNewNotifications') }}</p>
                <p class="empty-subtitle">{{ t('navBar.allCaughtUp') }}</p>
              </div>

              <div v-else class="notifications-list">
                <div
                  v-for="n in notifications"
                  :key="n.id"
                  class="notification-item"
                  :class="{ unread: !n.read }"
                  @click="n.read = true"
                >
                  <div class="notif-icon" :class="n.icon">
                    <svg v-if="n.icon === 'critical'" width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="6" fill="#dc2626" />
                      <path d="M8 5v3M8 11v1" stroke="#fff" stroke-width="1.5" stroke-linecap="round" />
                    </svg>
                    <svg v-else-if="n.icon === 'warning'" width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 2L1 14h14L8 2z" fill="#d97706" />
                      <path d="M8 6v3M8 12v1" stroke="#fff" stroke-width="1.5" stroke-linecap="round" />
                    </svg>
                    <svg v-else width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="6" fill="#2563eb" />
                      <path d="M8 5v4M8 11v1" stroke="#fff" stroke-width="1.5" stroke-linecap="round" />
                    </svg>
                  </div>
                  <div class="notif-body">
                    <p class="notif-title">{{ n.title }}</p>
                    <p class="notif-desc">{{ n.description }}</p>
                    <span class="notif-time">{{ n.date }} · {{ n.time }}</span>
                  </div>
                  <div v-if="!n.read" class="notif-dot" />
                </div>
              </div>
            </div>

            <div class="dropdown-footer">
              <router-link to="/alerts" class="view-all-link" @click="showDropdown = false">{{ t('navBar.viewAllAlerts') }}</router-link>
            </div>
          </div>
        </Transition>
      </div>

      <div class="user-menu" ref="userMenuRef">
        <button class="user-trigger" @click.stop="toggleUserMenu" aria-haspopup="menu">
          <UserAvatar size="md" />
          <div class="user-info">
            <span class="user-name">{{ authStore.fullName || authStore.userName }}</span>
            <span class="user-role">{{ userRoleLabel }}</span>
          </div>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" :class="{ open: userMenuOpen }">
            <path d="M4 6l4 4 4-4" stroke="#9ca3af" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>

        <Transition name="dropdown">
          <div v-if="userMenuOpen" class="user-dropdown" role="menu" @click.stop>
            <div class="user-card">
              <UserAvatar size="lg" />
              <div class="user-card-info">
                <p class="user-card-name">{{ authStore.fullName || authStore.userName }}</p>
                <p class="user-card-email">{{ authStore.userEmail }}</p>
                <PlanBadge :plan="sub.planId" />
              </div>
            </div>

            <div class="menu-list">
              <button class="menu-item" role="menuitem" @click="goTo('profile')">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <circle cx="9" cy="6.5" r="3" stroke="currentColor" stroke-width="1.5" />
                  <path d="M3 15.5C3 12.463 5.686 10 9 10s6 2.463 6 5.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                </svg>
                {{ t('navBar.myProfile') }}
              </button>
              <button class="menu-item" role="menuitem" @click="goTo('appearance')">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <circle cx="9" cy="9" r="3" stroke="currentColor" stroke-width="1.5" />
                  <path d="M9 1.5v2M9 14.5v2M16.5 9h-2M3.5 9h-2M14.03 3.97l-1.42 1.42M5.39 12.61l-1.42 1.42M14.03 14.03l-1.42-1.42M5.39 5.39L3.97 3.97" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                </svg>
                {{ t('navBar.settings') }}
              </button>
              <button class="menu-item" role="menuitem" @click="goToPayments">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <rect x="2" y="3" width="14" height="12" rx="2" stroke="currentColor" stroke-width="1.5" />
                  <path d="M2 7h14" stroke="currentColor" stroke-width="1.5" />
                  <circle cx="13" cy="13" r="1" fill="currentColor" />
                </svg>
                {{ t('navBar.payments') }}
              </button>
              <div class="menu-divider" />
              <button class="menu-item danger" role="menuitem" @click="logout">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M11 3H3a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                  <path d="M13.5 12.5L16 9l-2.5-3.5M16 9H7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                {{ t('auth.signOut') }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '../stores/authStore';
import { useSubscriptionStore } from '../stores/subscriptionStore';
import { useNotifications } from '../composables/useNotifications';
import { useLayout } from '../composables/useLayout';
import PlanBadge from './PlanBadge.vue';
import PlanSelector from './PlanSelector.vue';
import UserAvatar from './UserAvatar.vue';

const { t } = useI18n();
const router = useRouter();
const authStore = useAuthStore();
const sub = useSubscriptionStore();
const layout = useLayout();
const { notifications, unreadCount, hasUnread, markAllAsRead, loading } = useNotifications();

const showDropdown = ref(false);
const userMenuOpen = ref(false);
const wrapperRef = ref(null);
const userMenuRef = ref(null);

function toggleDropdown() {
  showDropdown.value = !showDropdown.value;
  if (showDropdown.value && hasUnread.value) {
    markAllAsRead();
  }
}

function toggleUserMenu() {
  userMenuOpen.value = !userMenuOpen.value;
}

function goTo(section) {
  userMenuOpen.value = false;
  router.push({ path: '/settings', query: section ? { section } : {} });
}

function goToPayments() {
  userMenuOpen.value = false;
  router.push('/pagos');
}

function logout() {
  userMenuOpen.value = false;
  authStore.logout();
  router.push('/login');
}

function onClickOutside(e) {
  if (wrapperRef.value && !wrapperRef.value.contains(e.target)) {
    showDropdown.value = false;
  }
  if (userMenuRef.value && !userMenuRef.value.contains(e.target)) {
    userMenuOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener('click', onClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', onClickOutside);
});

const userRoleLabel = computed(() => {
  return t(`roles.${sub.role}`) || 'Cuidador';
});
</script>

<style scoped>
.topnavbar {
  background: #ffffff;
  height: var(--navbar-height);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 28px;
  border-bottom: 1px solid #e5e7eb;
  flex-shrink: 0;
  gap: 16px;
}

.left-section {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
  min-width: 0;
}

.hamburger-btn {
  display: none;
  width: 40px;
  height: 40px;
  border: none;
  background: #f3f4f6;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s;
  flex-shrink: 0;
}

.hamburger-btn:hover {
  background: #e5e7eb;
}

.search-bar {
  position: relative;
  flex: 1;
  max-width: 480px;
  min-width: 0;
}

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 10px 14px 10px 42px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  font-size: 14px;
  color: #374151;
  background: #f9fafb;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.search-input::placeholder {
  color: #9ca3af;
}

.search-input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  background: #fff;
}

.right-section {
  display: flex;
  align-items: center;
  gap: 20px;
}

.notification-wrapper {
  position: relative;
}

.notification-btn {
  width: 40px;
  height: 40px;
  border: none;
  background: #f3f4f6;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s;
  position: relative;
}

.notification-btn:hover {
  background: #e5e7eb;
}

.notification-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 380px;
  max-height: 520px;
  background: #ffffff;
  border-radius: 14px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.14), 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid #e5e7eb;
  overflow: hidden;
  z-index: 100;
}

.dropdown-enter-active {
  transition: all 0.2s ease-out;
}

.dropdown-leave-active {
  transition: all 0.15s ease-in;
}

.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}

.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.dropdown-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px 12px;
  border-bottom: 1px solid #f3f4f6;
}

.dropdown-title {
  font-size: 15px;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.mark-read-btn {
  font-size: 12px;
  font-weight: 500;
  color: #2563eb;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: background 0.15s;
}

.mark-read-btn:hover {
  background: #eff6ff;
}

.dropdown-body {
  overflow-y: auto;
  max-height: 360px;
}

.notifications-list {
  display: flex;
  flex-direction: column;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 20px;
  cursor: pointer;
  transition: background 0.15s;
  border-bottom: 1px solid #f3f4f6;
  position: relative;
}

.notification-item:last-child {
  border-bottom: none;
}

.notification-item:hover {
  background: #f9fafb;
}

.notification-item.unread {
  background: #f0f5ff;
}

.notification-item.unread:hover {
  background: #e8f0fe;
}

.notif-icon {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.notif-icon.critical {
  background: #fef2f2;
}

.notif-icon.warning {
  background: #fffbeb;
}

.notif-icon.info {
  background: #eff6ff;
}

.notif-body {
  flex: 1;
  min-width: 0;
}

.notif-title {
  font-size: 13px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 2px;
}

.notif-desc {
  font-size: 12px;
  color: #6b7280;
  margin: 0 0 4px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.notif-time {
  font-size: 11px;
  color: #9ca3af;
}

.notif-dot {
  width: 8px;
  height: 8px;
  background: #2563eb;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 6px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  text-align: center;
}

.empty-title {
  font-size: 14px;
  font-weight: 600;
  color: #6b7280;
  margin: 12px 0 4px;
}

.empty-subtitle {
  font-size: 13px;
  color: #9ca3af;
  margin: 0;
}

.dropdown-footer {
  padding: 12px 20px;
  border-top: 1px solid #f3f4f6;
  text-align: center;
}

.view-all-link {
  font-size: 13px;
  font-weight: 500;
  color: #2563eb;
  text-decoration: none;
  transition: color 0.15s;
}

.view-all-link:hover {
  color: #1d4ed8;
  text-decoration: underline;
}

.user-menu {
  position: relative;
}

.user-trigger {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 4px 6px;
  background: transparent;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.15s;
}

.user-trigger:hover {
  background: #f3f4f6;
}

.user-trigger svg.open {
  transform: rotate(180deg);
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 0;
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  max-width: 140px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-role {
  font-size: 12px;
  color: #9ca3af;
}

.user-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 280px;
  background: #ffffff;
  border-radius: 14px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.14), 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid #e5e7eb;
  overflow: hidden;
  z-index: 100;
}

.user-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-bottom: 1px solid #f3f4f6;
}

.user-card-info {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.user-card-name {
  font-size: 14px;
  font-weight: 700;
  color: #111827;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-card-email {
  font-size: 12px;
  color: #6b7280;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.menu-list {
  padding: 6px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 12px;
  border: none;
  background: transparent;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  text-align: left;
  transition: background 0.15s;
}

.menu-item:hover {
  background: #f3f4f6;
}

.menu-item.danger {
  color: #dc2626;
}

.menu-item.danger:hover {
  background: #fef2f2;
}

.menu-divider {
  height: 1px;
  background: #f3f4f6;
  margin: 4px 0;
}

/* Responsive */
@media (max-width: 1023px) {
  .hamburger-btn {
    display: flex;
  }

  .search-bar {
    max-width: 320px;
  }
}

@media (max-width: 767px) {
  .topnavbar {
    height: var(--navbar-height);
    padding: 0 14px;
    gap: 8px;
  }

  .left-section {
    gap: 10px;
  }

  .search-bar {
    display: none;
  }

  .right-section {
    gap: 10px;
  }

  .right-section > .plan-selector,
  .user-info {
    display: none;
  }

  .user-trigger {
    padding: 4px;
  }

  .notification-dropdown {
    position: fixed;
    top: 64px;
    left: 12px;
    right: 12px;
    width: auto;
    max-width: none;
    max-height: calc(100dvh - 88px);
  }

  .user-dropdown {
    position: fixed;
    top: 64px;
    right: 12px;
    width: min(300px, calc(100vw - 24px));
    max-height: calc(100dvh - 88px);
    overflow-y: auto;
  }
}
</style>
