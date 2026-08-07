<template>
  <div class="profile-card">
    <div class="profile-top">
      <div class="profile-avatar">{{ initials }}</div>
      <div class="profile-main">
        <div class="profile-name-row">
          <h2 class="profile-name">{{ patient.name }}</h2>
          <StatusBadge :status="patient.status" />
        </div>
        <p class="profile-meta">{{ patient.gender }} · {{ patient.age }} años</p>
        <p class="profile-doctor">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="5.5" cy="4.5" r="2.5" stroke="#6b7280" stroke-width="1.2" />
            <path d="M1 12c0-2.5 2-4.5 4.5-4.5S10 9.5 10 12" stroke="#6b7280" stroke-width="1.2" stroke-linecap="round" />
            <path d="M11 5h3M12.5 3.5v3" stroke="#2563eb" stroke-width="1.2" stroke-linecap="round" />
          </svg>
          {{ patient.doctor }}
        </p>
      </div>
    </div>
    <div class="profile-divider" />
    <div class="profile-grid">
      <div class="profile-item">
        <span class="profile-label">Diagnóstico</span>
        <span class="profile-value">{{ patient.diagnosis }}</span>
      </div>
      <div class="profile-item">
        <span class="profile-label">Última sesión</span>
        <span class="profile-value">{{ patient.lastSession }}</span>
      </div>
      <div class="profile-item">
        <span class="profile-label">Próxima sesión</span>
        <span class="profile-value">{{ patient.nextSession }}</span>
      </div>
      <div class="profile-item">
        <span class="profile-label">Tipo de sangre</span>
        <span class="profile-value">{{ patient.bloodType }}</span>
      </div>
    </div>
    <div class="profile-divider" />
    <div class="profile-treatment">
      <span class="profile-label">Tratamiento actual</span>
      <span class="profile-value">{{ patient.treatment }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import StatusBadge from '../../../../components/StatusBadge.vue';

const props = defineProps({
  patient: { type: Object, required: true },
});

const initials = computed(() =>
  props.patient.name.split(' ').map(n => n[0]).join('').toUpperCase()
);
</script>

<style scoped>
.profile-card {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
  border: 1px solid #f3f4f6;
  padding: 28px 32px;
  margin-bottom: 24px;
}

.profile-top {
  display: flex;
  align-items: flex-start;
  gap: 20px;
}

.profile-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #2563eb;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: 700;
  flex-shrink: 0;
}

.profile-main {
  flex: 1;
  min-width: 0;
}

.profile-name-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 6px;
}

.profile-name {
  font-size: 22px;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.profile-meta {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 4px 0;
}

.profile-doctor {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.profile-divider {
  height: 1px;
  background: #f3f4f6;
  margin: 20px 0;
}

.profile-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.profile-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.profile-label {
  font-size: 12px;
  font-weight: 500;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.profile-value {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}

.profile-treatment {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

/* Responsive */
@media (max-width: 767px) {
  .profile-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
}

@media (max-width: 479px) {
  .profile-grid {
    grid-template-columns: 1fr;
  }
}
</style>
