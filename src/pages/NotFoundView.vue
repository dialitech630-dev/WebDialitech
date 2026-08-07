<template>
  <div class="error-page">
    <div class="error-card">
      <div class="error-code">404</div>
      <h1 class="error-title">Página no encontrada</h1>
      <p class="error-desc">La página que buscas no existe o ha sido movida.</p>
      <div class="error-actions">
        <router-link to="/dashboard" class="btn-primary">Ir al Inicio</router-link>
        <router-link to="/" class="btn-outline">Volver al inicio</router-link>
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

.error-code {
  font-size: 72px;
  font-weight: 800;
  color: #2563eb;
  letter-spacing: -2px;
  line-height: 1;
  margin: 0 0 12px;
}

.error-title {
  font-size: 26px;
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
