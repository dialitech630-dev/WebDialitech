<template>
  <header class="detail-header">
    <div class="header-top">
      <button class="back-btn" @click="$router.push('/patients')">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M11 3L6 9L11 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        Back
      </button>
      <nav class="breadcrumb">
        <router-link to="/dashboard" class="breadcrumb-link">Dashboard</router-link>
        <svg class="breadcrumb-sep" width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M5 3L8 6L5 9" stroke="#9ca3af" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <router-link to="/patients" class="breadcrumb-link">Patients</router-link>
        <svg class="breadcrumb-sep" width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M5 3L8 6L5 9" stroke="#9ca3af" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <span class="breadcrumb-current">{{ patient?.name || 'Patient Details' }}</span>
      </nav>
    </div>
    <div class="header-bottom">
      <h1 class="page-title">{{ patient?.name || 'Patient Details' }}</h1>
    </div>
  </header>
</template>

<script setup>
defineProps({
  patient: { type: Object, default: null },
});
</script>

<style scoped>
.detail-header {
  margin-bottom: 28px;
}

.header-top {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 8px;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #ffffff;
  color: #6b7280;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}

.back-btn:hover {
  background: #f3f4f6;
  border-color: #d1d5db;
  color: #374151;
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
  color: #6b7280;
  font-weight: 500;
}

.header-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.page-title {
  font-size: 26px;
  font-weight: 700;
  color: #111827;
  margin: 0;
  letter-spacing: -0.5px;
}

/* Responsive */
@media (max-width: 767px) {
  .header-top {
    flex-wrap: wrap;
  }

  .breadcrumb {
    flex-wrap: wrap;
  }

  .page-title {
    font-size: 22px;
  }
}
</style>
