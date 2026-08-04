<template>
  <div class="error-page">
    <div class="error-card">
      <div class="error-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="11" width="18" height="10" rx="2" stroke="#dc2626" stroke-width="1.6" />
          <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="#dc2626" stroke-width="1.6" stroke-linecap="round" />
          <circle cx="12" cy="15" r="1" fill="#dc2626" />
          <path d="M12 15v2" stroke="#dc2626" stroke-width="1.6" stroke-linecap="round" />
        </svg>
      </div>
      <p class="error-code">403</p>
      <h1 class="error-title">Forbidden</h1>
      <p class="error-desc">You don&apos;t have permission to access this page. If you believe this is a mistake, contact your administrator.</p>
      <div class="error-actions">
        <router-link to="/dashboard" class="btn-primary">Go to Dashboard</router-link>
        <router-link to="/" class="btn-outline">Back to Home</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.error-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  padding: 24px;
}

.error-card {
  text-align: center;
  max-width: 420px;
}

.error-icon {
  width: 88px;
  height: 88px;
  margin: 0 auto 20px;
  border-radius: 24px;
  background: #fef2f2;
  display: flex;
  align-items: center;
  justify-content: center;
}

.error-code {
  font-size: 14px;
  font-weight: 700;
  color: #dc2626;
  letter-spacing: 2px;
  margin: 0 0 8px;
}

.error-title {
  font-size: 28px;
  font-weight: 800;
  color: #111827;
  margin: 0 0 10px;
}

.error-desc {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.6;
  margin: 0 0 28px;
}

.error-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.btn-primary,
.btn-outline {
  padding: 10px 24px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.15s;
}

.btn-primary {
  background: #2563eb;
  color: #ffffff;
}

.btn-primary:hover {
  background: #1d4ed8;
}

.btn-outline {
  border: 1px solid #e5e7eb;
  color: #374151;
}

.btn-outline:hover {
  background: #f3f4f6;
}
</style>
