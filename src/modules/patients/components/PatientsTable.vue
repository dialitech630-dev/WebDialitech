<template>
  <div class="table-card">
    <div class="table-wrapper">
      <table class="patients-table">
        <thead>
          <tr>
            <th class="th-patient">Patient</th>
            <th class="th-data">Age</th>
            <th class="th-data">Gender</th>
            <th class="th-data">Assigned Doctor</th>
            <th class="th-data">Last Session</th>
            <th class="th-data">Next Session</th>
            <th class="th-status">Status</th>
            <th class="th-actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          <PatientsTableRow
            v-for="patient in patients"
            :key="patient.id"
            :patient="patient"
            @delete="$emit('delete', $event)"
          />
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import PatientsTableRow from './PatientsTableRow.vue';

defineProps({
  patients: { type: Array, required: true },
});
defineEmits(['delete']);
</script>

<style scoped>
.table-card {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
  border: 1px solid #f3f4f6;
  overflow: hidden;
}

.table-wrapper {
  overflow-x: auto;
}

.patients-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: auto;
}

.patients-table thead {
  background: #f9fafb;
}

.patients-table th {
  padding: 12px 16px;
  font-size: 11px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  text-align: left;
  white-space: nowrap;
  border-bottom: 1px solid #e5e7eb;
}

.th-patient {
  padding-left: 24px !important;
}

.th-actions {
  padding-right: 24px !important;
}

@media (max-width: 767px) {
  .patients-table thead {
    display: none;
  }

  .table-wrapper {
    overflow-x: visible;
  }
}
</style>
