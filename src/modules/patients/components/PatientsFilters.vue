<template>
  <div class="filters">
    <div class="filter-group">
      <label class="filter-label">Estado</label>
      <select v-model="status" class="filter-select">
        <option v-for="s in statusOptions" :key="s">{{ s }}</option>
      </select>
    </div>
    <div class="filter-group">
      <label class="filter-label">Edad</label>
      <select v-model="age" class="filter-select">
        <option v-for="a in ageOptions" :key="a">{{ a }}</option>
      </select>
    </div>
    <div class="filter-group">
      <label class="filter-label">Médico</label>
      <select v-model="doctor" class="filter-select">
        <option v-for="d in doctorOptions" :key="d">{{ d }}</option>
      </select>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  patients: { type: Array, default: () => [] },
});

const status = defineModel('status', { type: String, default: 'Todos los estados' });
const age = defineModel('age', { type: String, default: 'Todas las edades' });
const doctor = defineModel('doctor', { type: String, default: 'Todos los médicos' });

const statusOptions = computed(() => ['Todos los estados', ...new Set(props.patients.map((p) => p.status).filter(Boolean))]);
const doctorOptions = computed(() => ['Todos los médicos', ...new Set(props.patients.map((p) => p.doctor).filter(Boolean))]);

const ageOptions = ['Todas las edades', '18-30', '31-45', '46-60', '60+'];
</script>

<style scoped>
.filters {
  display: flex;
  align-items: center;
  gap: 12px;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-label {
  font-size: 13px;
  font-weight: 500;
  color: #6b7280;
  white-space: nowrap;
}

.filter-select {
  padding: 8px 32px 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 13px;
  color: #374151;
  background: #ffffff;
  outline: none;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%236b7280' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  min-width: 130px;
  transition: border-color 0.15s;
}

.filter-select:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}
</style>
