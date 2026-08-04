<template>
  <div class="patient-detail-view">
    <PatientDetailHeader :patient="store.currentPatient" />

    <div v-if="store.loadingDetail" class="loading-detail">
      <div class="skeleton-profile">
        <div class="skeleton-avatar-lg" />
        <div class="skeleton-lines">
          <div class="skeleton-line w-40" />
          <div class="skeleton-line w-60" />
          <div class="skeleton-line w-30" />
        </div>
      </div>
    </div>

    <div v-else-if="store.error && !store.currentPatient" class="error-detail">
      <p class="error-text">{{ store.error }}</p>
      <button class="back-btn" @click="$router.push('/patients')">Back to Patients</button>
    </div>

    <template v-else-if="store.currentPatient">
      <PatientProfileCard :patient="store.currentPatient" />

      <div class="detail-grid">
        <div class="left-column">
          <PatientInfoCard title="Personal Information">
            <div class="info-grid">
              <div class="info-row">
                <span class="info-label">Phone</span>
                <span class="info-value">{{ store.currentPatient.phone || '--' }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Email</span>
                <span class="info-value">{{ store.currentPatient.email || '--' }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Address</span>
                <span class="info-value">{{ store.currentPatient.address || '--' }}</span>
              </div>
            </div>
          </PatientInfoCard>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { usePatientStore } from '../../../stores/patientStore';
import PatientDetailHeader from '../components/detail/PatientDetailHeader.vue';
import PatientProfileCard from '../components/detail/PatientProfileCard.vue';
import PatientInfoCard from '../components/detail/PatientInfoCard.vue';

const route = useRoute();
const store = usePatientStore();

onMounted(() => {
  if (route.params.id) {
    store.fetchById(route.params.id);
  }
});
</script>

<style scoped>
.patient-detail-view {
  padding: 32px;
  background: #f8f9fa;
  flex: 1;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 24px;
  align-items: start;
  margin-bottom: 24px;
}

.left-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.right-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.full-width-section {
  margin-bottom: 24px;
}

.info-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-row {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.info-label {
  font-size: 13px;
  font-weight: 500;
  color: #9ca3af;
  min-width: 110px;
  flex-shrink: 0;
}

.info-value {
  font-size: 14px;
  color: #111827;
  font-weight: 500;
}

.loading-detail {
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #f3f4f6;
  padding: 32px;
}

.skeleton-profile {
  display: flex;
  gap: 20px;
  align-items: center;
}

.skeleton-avatar-lg {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #f3f4f6;
  animation: pulse 1.5s ease-in-out infinite;
}

.skeleton-lines {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.skeleton-line {
  height: 14px;
  background: #f3f4f6;
  border-radius: 6px;
  animation: pulse 1.5s ease-in-out infinite;
}

.w-40 { width: 40%; }
.w-60 { width: 60%; }
.w-30 { width: 30%; }

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.error-detail {
  text-align: center;
  padding: 64px 24px;
}

.error-text {
  font-size: 14px;
  color: #dc2626;
  margin: 0 0 16px;
}

.back-btn {
  padding: 10px 24px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #ffffff;
  color: #374151;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

/* Responsive */
@media (max-width: 1023px) {
  .patient-detail-view {
    padding: 24px;
  }
}

@media (max-width: 767px) {
  .patient-detail-view {
    padding: 16px;
  }

  .detail-grid {
    grid-template-columns: 1fr;
  }

  .info-row {
    flex-direction: column;
    gap: 4px;
  }

  .info-label {
    min-width: 0;
  }
}
</style>
