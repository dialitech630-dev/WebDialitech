<template>
  <div class="settings-view">
    <SettingsHeader />

    <div class="settings-layout">
      <SettingsSidebar :activeSection="activeSection" @select="activeSection = $event" />

      <div class="settings-content">
        <ProfileSettings v-if="activeSection === 'profile'" />
        <AccountSettings v-if="activeSection === 'account'" />
        <NotificationSettingsCard v-if="activeSection === 'notifications'" />
        <SecuritySettingsCard v-if="activeSection === 'security'" />
        <AppearanceSettingsCard v-if="activeSection === 'appearance'" />
        <SubscriptionSettings v-if="activeSection === 'subscription'" />
        <SystemInformationCard v-if="activeSection === 'system'" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import SettingsHeader from '../components/SettingsHeader.vue';
import SettingsSidebar from '../components/SettingsSidebar.vue';
import ProfileSettings from '../components/ProfileSettings.vue';
import AccountSettings from '../components/AccountSettings.vue';
import NotificationSettingsCard from '../components/NotificationSettingsCard.vue';
import SecuritySettingsCard from '../components/SecuritySettingsCard.vue';
import AppearanceSettingsCard from '../components/AppearanceSettingsCard.vue';
import SubscriptionSettings from '../components/SubscriptionSettings.vue';
import SystemInformationCard from '../components/SystemInformationCard.vue';

const route = useRoute();
const activeSection = ref(route.query.section || 'profile');

watch(
  () => route.query.section,
  (section) => {
    if (section) activeSection.value = section;
  },
);
</script>

<style scoped>
.settings-view {
  padding: 32px;
  background: #f8f9fa;
  flex: 1;
}

.settings-layout {
  display: flex;
  gap: 28px;
  align-items: flex-start;
}

.settings-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Responsive */
@media (max-width: 1023px) {
  .settings-view {
    padding: 24px;
  }

  .settings-layout {
    gap: 20px;
  }
}

@media (max-width: 767px) {
  .settings-view {
    padding: 16px;
  }

  .settings-layout {
    flex-direction: column;
    gap: 16px;
  }

  .settings-content {
    width: 100%;
  }
}
</style>
