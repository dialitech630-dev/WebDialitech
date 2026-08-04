<template>
  <tr class="table-row">
    <td class="cell-patient" data-label="Patient">
      <div class="patient-info">
        <div class="avatar" :style="{ background: avatarColor }">
          {{ initials }}
        </div>
        <router-link class="patient-name" :to="`/patients/${patient.id}`">{{ patient.name }}</router-link>
      </div>
    </td>
    <td class="cell-data" data-label="Age">{{ patient.age }}</td>
    <td class="cell-data" data-label="Gender">{{ patient.gender || '--' }}</td>
    <td class="cell-data" data-label="Assigned Doctor">{{ patient.doctor || '--' }}</td>
    <td class="cell-data" data-label="Last Session">{{ patient.lastSession || '--' }}</td>
    <td class="cell-data" data-label="Next Session">{{ patient.nextSession || '--' }}</td>
    <td class="cell-status" data-label="Status">
      <StatusBadge :status="patient.status" />
    </td>
    <td class="cell-actions" data-label="Actions">
      <PatientActions :patient-id="patient.id" @delete="$emit('delete', patient.id)" />
    </td>
  </tr>
</template>

<script setup>
import { computed } from 'vue';
import StatusBadge from '../../../components/StatusBadge.vue';
import PatientActions from './PatientActions.vue';

const props = defineProps({
  patient: { type: Object, required: true },
});

defineEmits(['delete']);

const avatarColors = ['#2563eb', '#7c3aed', '#db2777', '#dc2626', '#d97706', '#059669', '#0891b2', '#4f46e5', '#9333ea', '#e11d48'];
const initials = computed(() =>
  props.patient.name.split(' ').map(n => n[0]).join('').toUpperCase()
);
const avatarColor = computed(() =>
  avatarColors[Number(props.patient.id) % avatarColors.length]
);
</script>

<style scoped>
.table-row {
  transition: background 0.15s;
}

.table-row:hover {
  background: #f9fafb;
}

.table-row:not(:last-child) .cell-patient,
.table-row:not(:last-child) .cell-data,
.table-row:not(:last-child) .cell-status,
.table-row:not(:last-child) .cell-actions {
  border-bottom: 1px solid #f3f4f6;
}

.cell-patient {
  padding: 14px 16px 14px 24px;
}

.patient-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  color: #ffffff;
  flex-shrink: 0;
}

.patient-name {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  white-space: nowrap;
  text-decoration: none;
  transition: color 0.15s;
}

.patient-name:hover {
  color: #2563eb;
}

.cell-data {
  padding: 14px 16px;
  font-size: 14px;
  color: #374151;
  white-space: nowrap;
}

.cell-status {
  padding: 14px 16px;
}

.cell-actions {
  padding: 14px 24px 14px 16px;
}

/* Responsive: filas como tarjetas en movil */
@media (max-width: 767px) {
  .table-row {
    display: block;
    padding: 16px;
    border-bottom: 1px solid #f3f4f6;
  }

  .table-row:last-child {
    border-bottom: none;
  }

  .table-row:not(:last-child) .cell-patient,
  .table-row:not(:last-child) .cell-data,
  .table-row:not(:last-child) .cell-status,
  .table-row:not(:last-child) .cell-actions {
    border-bottom: none;
  }

  .cell-patient {
    padding: 0 0 12px;
  }

  .patient-info {
    gap: 10px;
  }

  .patient-name {
    white-space: normal;
  }

  .cell-data,
  .cell-status,
  .cell-actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 8px 0;
    font-size: 14px;
  }

  .cell-data::before,
  .cell-status::before,
  .cell-actions::before {
    content: attr(data-label);
    font-size: 12px;
    font-weight: 500;
    color: #9ca3af;
    flex-shrink: 0;
  }

  .cell-actions {
    padding-top: 12px;
  }
}
</style>
