<template>
  <span class="role-badge" :class="badgeClass">{{ label }}</span>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
  role: { type: String, required: true },
});

const badgeClass = computed(() => {
  const r = props.role.toLowerCase();
  if (r === 'admin') return 'role-admin';
  if (r === 'doctor') return 'role-doctor';
  if (r === 'nurse') return 'role-nurse';
  if (r === 'caregiver') return 'role-caregiver';
  if (r === 'receptionist') return 'role-receptionist';
  if (r === 'supervisor') return 'role-supervisor';
  return 'role-default';
});

const label = computed(() => {
  const r = props.role.toLowerCase();
  if (r === 'admin') return t('roles.admin');
  if (r === 'doctor') return t('roles.doctor');
  if (r === 'nurse') return t('roles.nurse');
  if (r === 'caregiver') return t('roles.caregiver');
  if (r === 'receptionist') return t('roles.receptionist');
  if (r === 'supervisor') return t('roles.supervisor');
  return props.role;
});
</script>

<style scoped>
.role-badge {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  line-height: 1.6;
}

.role-admin {
  background: #f5f3ff;
  color: #7c3aed;
}

.role-doctor {
  background: #eff6ff;
  color: #2563eb;
}

.role-nurse {
  background: #f0fdf4;
  color: #059669;
}

.role-caregiver {
  background: #fffbeb;
  color: #d97706;
}

.role-receptionist {
  background: #fef2f2;
  color: #dc2626;
}

.role-supervisor {
  background: #ecfeff;
  color: #0891b2;
}

.role-default {
  background: #f3f4f6;
  color: #6b7280;
}
</style>
