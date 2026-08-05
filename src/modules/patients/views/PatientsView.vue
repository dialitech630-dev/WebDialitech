<template>
  <div class="patients-view">
    <PatientsHeader
      title="Patients"
      subtitle="Manage and monitor all registered patients"
      @add="showAddModal = true"
    />

    <div class="toolbar">
      <PatientsSearchBar v-model:search="search" />
      <PatientsFilters
        v-model:status="status"
        v-model:age="age"
        v-model:doctor="doctor"
        :patients="store.patients"
      />
    </div>

    <div v-if="store.loading" class="loading-state">
      <div class="skeleton-table">
        <div v-for="i in 5" :key="i" class="skeleton-row">
          <div class="skeleton-cell skeleton-avatar" />
          <div class="skeleton-cell skeleton-text" />
          <div class="skeleton-cell skeleton-text-short" />
          <div class="skeleton-cell skeleton-text-short" />
          <div class="skeleton-cell skeleton-text" />
          <div class="skeleton-cell skeleton-text-short" />
          <div class="skeleton-cell skeleton-badge" />
          <div class="skeleton-cell skeleton-icon" />
        </div>
      </div>
    </div>

    <div v-else-if="store.error && !store.patients.length" class="error-state">
      <p class="error-text">{{ store.error }}</p>
      <button class="retry-btn" @click="store.fetchAll()">Retry</button>
    </div>

    <div v-else-if="!store.patients.length" class="empty-state">
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
        <rect x="8" y="12" width="48" height="40" rx="8" stroke="#d1d5db" stroke-width="2" />
        <circle cx="32" cy="30" r="8" stroke="#d1d5db" stroke-width="2" />
        <path d="M22 46c0-5.5 4.5-10 10-10s10 4.5 10 10" stroke="#d1d5db" stroke-width="2" stroke-linecap="round" />
      </svg>
      <p class="empty-title">No patients found</p>
      <p class="empty-subtitle">Add your first patient to start monitoring</p>
      <button class="add-empty-btn" @click="showAddModal = true">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
        Add Patient
      </button>
    </div>

    <template v-else>
      <PatientsTable :patients="paginatedPatients" @delete="confirmDelete" />

      <div v-if="filteredPatients.length === 0" class="empty-state">
        <p class="empty-title">No results</p>
        <p class="empty-subtitle">No patients match your search or filters</p>
      </div>

      <div v-else class="pagination-wrapper">
        <Pagination
          :total-items="filteredPatients.length"
          :current-page="currentPage"
          :page-size="PAGE_SIZE"
          @update:current-page="currentPage = $event"
        />
      </div>
    </template>

    <AddPatientModal
      :visible="showAddModal"
      @close="showAddModal = false"
      @created="store.fetchAll()"
    />

    <DeleteConfirmDialog
      :visible="showDeleteDialog"
      :patient-id="deleteTargetId"
      @close="showDeleteDialog = false"
      @deleted="store.fetchAll()"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { usePatientStore } from '../../../stores/patientStore';
import PatientsHeader from '../components/PatientsHeader.vue';
import PatientsSearchBar from '../components/PatientsSearchBar.vue';
import PatientsFilters from '../components/PatientsFilters.vue';
import PatientsTable from '../components/PatientsTable.vue';
import Pagination from '../components/Pagination.vue';
import AddPatientModal from '../../../components/AddPatientModal.vue';
import DeleteConfirmDialog from '../../../components/DeleteConfirmDialog.vue';

const store = usePatientStore();
const showAddModal = ref(false);
const showDeleteDialog = ref(false);
const deleteTargetId = ref('');

const search = ref('');
const status = ref('All Status');
const age = ref('All Ages');
const doctor = ref('All Doctors');
const currentPage = ref(1);
const PAGE_SIZE = 8;

const filteredPatients = computed(() => {
  const query = search.value.trim().toLowerCase();
  return store.patients.filter((p) => {
    if (status.value !== 'All Status' && p.status !== status.value) return false;
    if (doctor.value !== 'All Doctors' && p.doctor !== doctor.value) return false;
    if (!matchesAge(p.age, age.value)) return false;
    if (query) {
      const haystack = `${p.name} ${p.doctor} ${p.gender}`.toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    return true;
  });
});

const paginatedPatients = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE;
  return filteredPatients.value.slice(start, start + PAGE_SIZE);
});

function matchesAge(patientAge, filter) {
  if (filter === 'All Ages') return true;
  const value = Number(patientAge);
  if (!Number.isFinite(value)) return false;
  if (filter === '18-30') return value >= 18 && value <= 30;
  if (filter === '31-45') return value >= 31 && value <= 45;
  if (filter === '46-60') return value >= 46 && value <= 60;
  if (filter === '60+') return value >= 60;
  return true;
}

watch([search, status, age, doctor], () => {
  currentPage.value = 1;
});

function confirmDelete(id) {
  deleteTargetId.value = id;
  showDeleteDialog.value = true;
}

onMounted(() => {
  store.fetchAll();
});
</script>

<style scoped>
.patients-view {
  padding: 32px;
  background: #f8f9fa;
  flex: 1;
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  gap: 16px;
  flex-wrap: wrap;
}

.pagination-wrapper {
  margin-top: 20px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
  border: 1px solid #f3f4f6;
}

.loading-state {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
  border: 1px solid #f3f4f6;
  overflow: hidden;
}

.skeleton-table {
  padding: 0;
}

.skeleton-row {
  display: flex;
  align-items: center;
  padding: 16px 24px;
  gap: 16px;
  border-bottom: 1px solid #f3f4f6;
}

.skeleton-row:last-child {
  border-bottom: none;
}

.skeleton-cell {
  background: #f3f4f6;
  border-radius: 6px;
  height: 16px;
  animation: pulse 1.5s ease-in-out infinite;
}

.skeleton-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  flex-shrink: 0;
}

.skeleton-text {
  flex: 2;
}

.skeleton-text-short {
  flex: 1;
}

.skeleton-badge {
  width: 60px;
  height: 24px;
  border-radius: 12px;
}

.skeleton-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.error-state {
  text-align: center;
  padding: 64px 24px;
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #f3f4f6;
}

.error-text {
  font-size: 14px;
  color: #dc2626;
  margin: 0 0 16px;
}

.retry-btn {
  padding: 10px 24px;
  border: none;
  border-radius: 10px;
  background: #2563eb;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.retry-btn:hover {
  background: #1d4ed8;
}

.empty-state {
  text-align: center;
  padding: 64px 24px;
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #f3f4f6;
}

.empty-title {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 16px 0 4px;
}

.empty-subtitle {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 20px;
}

.add-empty-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 24px;
  border: none;
  border-radius: 10px;
  background: #2563eb;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.add-empty-btn:hover {
  background: #1d4ed8;
}

/* Responsive */
@media (max-width: 1023px) {
  .patients-view {
    padding: 24px;
  }
}

@media (max-width: 767px) {
  .patients-view {
    padding: 16px;
  }

  .toolbar {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .search-bar {
    max-width: none;
  }

  .filters {
    flex-wrap: wrap;
    gap: 8px;
  }

  .filter-select {
    min-width: 0;
    flex: 1;
  }
}
</style>
