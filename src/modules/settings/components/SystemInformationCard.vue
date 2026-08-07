<template>
  <SettingsSection title="Información del sistema" description="Versión y estado actual del sistema">
    <div class="sys-grid">
      <div class="sys-item">
        <span class="sys-label">Versión de la aplicación</span>
        <span class="sys-value">{{ settings.system.appVersion }}</span>
      </div>
      <div class="sys-item">
        <span class="sys-label">Versión de la API</span>
        <span class="sys-value">{{ settings.system.apiVersion }}</span>
      </div>
      <div class="sys-item">
        <span class="sys-label">Versión de la base de datos</span>
        <span class="sys-value">{{ settings.system.dbVersion }}</span>
      </div>
      <div class="sys-item">
        <span class="sys-label">Entorno</span>
        <span class="sys-value">{{ settings.system.environment }}</span>
      </div>
      <div class="sys-item">
        <span class="sys-label">Estado del servidor</span>
        <span class="sys-value-row">
          <span class="status-dot online" />
          {{ settings.system.serverStatus }}
        </span>
      </div>
      <div class="sys-item">
        <span class="sys-label">Tiempo de actividad</span>
        <span class="sys-value">{{ settings.system.uptime }}</span>
      </div>
      <div class="sys-item">
        <span class="sys-label">Último respaldo</span>
        <span class="sys-value">{{ settings.system.lastBackup }}</span>
      </div>
    </div>
  </SettingsSection>
</template>

<script setup>
import { settings } from '../data/settings.js';
import SettingsSection from './SettingsSection.vue';
</script>

<style scoped>
.sys-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.sys-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 10px;
}

.sys-label {
  font-size: 11px;
  font-weight: 500;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.sys-value {
  font-size: 15px;
  font-weight: 600;
  color: #111827;
}

.sys-value-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  color: #111827;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-dot.online {
  background: #22c55e;
}

/* Responsive */
@media (max-width: 767px) {
  .sys-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}
</style>
