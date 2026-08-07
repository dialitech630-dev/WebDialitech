<template>
  <header class="payments-header">
    <div class="header-left">
      <h1 class="page-title">{{ t('payments.title') }}</h1>
      <p class="page-subtitle">{{ t('payments.subtitle') }}</p>
      <nav class="breadcrumb">
        <router-link to="/dashboard" class="breadcrumb-link">{{ t('nav.dashboard') }}</router-link>
        <svg class="breadcrumb-sep" width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M5 3L8 6L5 9" stroke="#9ca3af" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <span class="breadcrumb-current">{{ t('payments.title') }}</span>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<style scoped>
.payments-header {
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

@media (max-width: 767px) {
  .payments-header {
    flex-direction: column;
    gap: 16px;
    margin-bottom: 20px;
  }

  .page-title {
    font-size: 22px;
  }
}
</style>
