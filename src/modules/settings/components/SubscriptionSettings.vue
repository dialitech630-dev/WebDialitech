<template>
  <SettingsSection title="Subscription / Plan" description="View and manage your current subscription plan">
    <div v-if="loading" class="subscription-skeleton">
      <div class="skeleton skeleton-badge"></div>
      <div class="skeleton skeleton-row" style="width:60%"></div>
      <div class="skeleton skeleton-row" style="width:40%"></div>
      <div class="skeleton skeleton-row" style="width:50%"></div>
      <div class="skeleton skeleton-benefits"></div>
      <div class="skeleton skeleton-grid">
        <div class="skeleton skeleton-card"></div>
        <div class="skeleton skeleton-card"></div>
        <div class="skeleton skeleton-card"></div>
      </div>
    </div>
    <div v-else-if="error" class="error-banner">
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="8" stroke="#ef4444" stroke-width="1.5"/>
        <path d="M9 5.5V9.5" stroke="#ef4444" stroke-width="1.5" stroke-linecap="round"/>
        <circle cx="9" cy="12" r="0.75" fill="#ef4444"/>
      </svg>
      <span>{{ error }}</span>
      <button class="retry-btn" @click="fetch">Retry</button>
    </div>

    <template v-else-if="!hasActiveSubscription">
      <div class="no-plan-card">
        <div class="no-plan-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="6" width="18" height="14" rx="2" stroke="#9ca3af" stroke-width="1.5"/>
            <path d="M12 12V16" stroke="#9ca3af" stroke-width="1.5" stroke-linecap="round"/>
            <circle cx="12" cy="10" r="0.75" fill="#9ca3af"/>
          </svg>
        </div>
        <h4 class="no-plan-title">No Active Subscription</h4>
        <p class="no-plan-desc">You don't currently have an active plan. Choose a plan to unlock all features.</p>
        <button class="view-plans-btn" @click="scrollToPlans">Choose a Plan</button>
      </div>
    </template>

    <template v-else>
      <div class="current-plan-card">
        <div class="current-plan-header">
          <div class="current-plan-title">
            <span class="plan-badge" :class="planClass">{{ plan.name }}</span>
            <span class="status-badge">ACTIVE</span>
          </div>
          <div class="plan-price-display">{{ plan.price }}</div>
        </div>

        <div class="current-plan-dates">
          <div class="date-block">
            <span class="date-label">Start Date</span>
            <span class="date-value">{{ plan.startDate || '—' }}</span>
          </div>
          <div class="date-block">
            <span class="date-label">Expiration Date</span>
            <span class="date-value">{{ plan.endDate || '—' }}</span>
          </div>
          <div class="date-block">
            <span class="date-label">Status</span>
            <span class="date-value">{{ plan.status }}</span>
          </div>
        </div>

        <div class="current-plan-details">
          <div class="detail-row">
            <span class="detail-label">Patients</span>
            <span class="detail-value">{{ patientsLabel }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Caregivers</span>
            <span class="detail-value">{{ caregiversLabel }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Devices</span>
            <span class="detail-value">{{ devicesLabel }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Alerts / day</span>
            <span class="detail-value">{{ alertsLabel }}</span>
          </div>
        </div>

        <div class="current-plan-benefits">
          <h4 class="benefits-title">Plan Benefits</h4>
          <ul class="benefits-list">
            <li v-for="(benefit, idx) in plan.benefits" :key="idx" class="benefit-item">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 8.5L6.5 11L12 5" stroke="#22c55e" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              {{ benefit }}
            </li>
          </ul>
        </div>
      </div>

      <div class="available-plans-section">
        <div class="section-head">
          <h4 class="section-title">Available Plans</h4>
          <BillingToggle />
        </div>
        <div class="plans-grid">
          <div
            v-for="p in availablePlans"
            :key="p.id"
            class="plan-card"
            :class="{
              current: p.isCurrent,
              featured: p.featured && !p.isCurrent,
            }"
          >
            <div class="plan-card-header">
              <div>
                <span class="plan-card-name">{{ p.name }}</span>
                <span class="plan-card-price">{{ formatPrice(p) }}</span>
                <span v-if="showsDiscount(p)" class="plan-card-save">Save {{ p.discount }}% · {{ p.billingNote }}</span>
              </div>
              <span v-if="p.isCurrent" class="current-badge">Current Plan</span>
            </div>

            <p class="plan-card-desc">{{ p.description }}</p>

            <ul class="plan-features">
              <li v-for="(feat, idx) in p.features" :key="idx" class="feature-item">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 7l3 3 5-5" stroke="#22c55e" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
                {{ feat }}
              </li>
            </ul>

            <div class="plan-limits">
              <div class="limit-row">
                <span class="limit-label">Max Patients</span>
                <span class="limit-value">{{ p.patientsLimit }}</span>
              </div>
              <div class="limit-row">
                <span class="limit-label">Max Caregivers</span>
                <span class="limit-value">{{ p.caregiversLimit }}</span>
              </div>
              <div class="limit-row">
                <span class="limit-label">Max Devices</span>
                <span class="limit-value">{{ p.devicesAllowed }}</span>
              </div>
              <div class="limit-row">
                <span class="limit-label">Alerts / day</span>
                <span class="limit-value">{{ p.alertsPerDay }}</span>
              </div>
              <div class="limit-row">
                <span class="limit-label">Reports</span>
                <span class="limit-value feature-check" :class="{ 'feature-no': !p.reportsAvailable }">
                  {{ p.reportsLevel === 'basic' ? 'Basic' : p.advancedReports ? 'Advanced' : '—' }}
                </span>
              </div>
              <div class="limit-row">
                <span class="limit-label">Analytics</span>
                <span class="limit-value">{{ yesNo(p.analytics) }}</span>
              </div>
              <div class="limit-row">
                <span class="limit-label">AI Insights</span>
                <span class="limit-value">{{ yesNo(p.ai) }}</span>
              </div>
              <div class="limit-row">
                <span class="limit-label">Data Exports</span>
                <span class="limit-value">{{ yesNo(p.exports) }}</span>
              </div>
              <div class="limit-row">
                <span class="limit-label">Multi-caregiver</span>
                <span class="limit-value">{{ yesNo(p.multiCaregiver) }}</span>
              </div>
            </div>

            <button
              v-if="!p.isCurrent"
              class="switch-btn"
              :disabled="isChanging"
              @click="openChangeModal(p)"
            >
              <svg v-if="isChanging" class="spinner" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5" stroke-dasharray="28" stroke-linecap="round"/>
              </svg>
              {{ isChanging ? 'Switching...' : 'Switch Plan' }}
            </button>

            <div v-if="p.isCurrent" class="disabled-overlay"></div>
          </div>
        </div>
      </div>
    </template>

    <ChangePlanModal
      v-if="showChangeModal"
      :new-plan="selectedPlan"
      @close="showChangeModal = false"
      @changed="onPlanChanged"
    />
  </SettingsSection>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useSubscription } from '../../../composables/useSubscription';
import { useBillingCycle } from '../../../composables/useBillingCycle';
import SettingsSection from './SettingsSection.vue';
import ChangePlanModal from './ChangePlanModal.vue';
import BillingToggle from '../../../components/BillingToggle.vue';

const { plan, loading, error, hasActiveSubscription, availablePlans, changePlan, fetch, isChanging } = useSubscription();
const { formatPrice, showsDiscount } = useBillingCycle();
const showChangeModal = ref(false);
const selectedPlan = ref(null);

const planClass = computed(() => {
  if (!plan.value) return 'standard';
  return String(plan.value.id).toLowerCase();
});

function formatLimit(v) {
  return v === -1 || v === 'Unlimited' ? 'Unlimited' : v;
}

const patientsLabel = computed(() => formatLimit(plan.value?.limits?.patients));
const caregiversLabel = computed(() => formatLimit(plan.value?.limits?.caregivers));
const devicesLabel = computed(() => formatLimit(plan.value?.limits?.devices));
const alertsLabel = computed(() => formatLimit(plan.value?.limits?.alertsPerDay));

function yesNo(v) {
  return v ? 'Yes' : 'No';
}

function openChangeModal(p) {
  selectedPlan.value = p;
  showChangeModal.value = true;
}

function onPlanChanged() {
  fetch();
}

function scrollToPlans() {
  const el = document.querySelector('.available-plans-section');
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}
</script>

<style scoped>
.plan-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  width: fit-content;
}

.plan-badge.standard {
  background: #dbeafe;
  color: #2563eb;
}

.plan-badge.pro {
  background: #e0e7ff;
  color: #4f46e5;
}

.plan-badge.premium {
  background: #f3e8ff;
  color: #7c3aed;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  background: #dcfce7;
  color: #16a34a;
  margin-left: 8px;
}

.current-plan-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 24px;
  margin-bottom: 32px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.current-plan-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 20px;
}

.plan-price-display {
  font-size: 22px;
  font-weight: 700;
  color: #059669;
}

.current-plan-dates {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}

.date-block {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 16px;
  background: #f9fafb;
  border-radius: 10px;
}

.date-label {
  font-size: 12px;
  font-weight: 500;
  color: #9ca3af;
}

.date-value {
  font-size: 15px;
  font-weight: 600;
  color: #111827;
}

.current-plan-details {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}

.detail-row {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 16px;
  background: #f9fafb;
  border-radius: 10px;
}

.detail-label {
  font-size: 12px;
  font-weight: 500;
  color: #9ca3af;
}

.detail-value {
  font-size: 16px;
  font-weight: 700;
  color: #111827;
}

.current-plan-benefits {
  background: #f9fafb;
  border-radius: 10px;
  padding: 16px 20px;
}

.benefits-title {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 12px 0;
}

.benefits-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: #374151;
}

.available-plans-section {
  margin-top: 8px;
}

.section-title {
  font-size: 15px;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.plans-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.plan-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  position: relative;
  transition: box-shadow 0.2s, border-color 0.2s;
}

.plan-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.plan-card.featured {
  border-color: #2563eb;
  box-shadow: 0 0 0 1px #2563eb;
}

.plan-card.current {
  border-color: #22c55e;
  background: #f0fdf4;
}

.plan-card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 12px;
}

.plan-card-name {
  display: block;
  font-size: 16px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 4px;
}

.plan-card-price {
  display: block;
  font-size: 13px;
  color: #6b7280;
  margin-top: 4px;
}

.plan-card-save {
  display: block;
  font-size: 11px;
  font-weight: 600;
  color: #059669;
  margin-top: 4px;
}

.current-badge {
  display: inline-flex;
  padding: 4px 10px;
  background: #dcfce7;
  color: #16a34a;
  font-size: 11px;
  font-weight: 700;
  border-radius: 6px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  white-space: nowrap;
}

.plan-card-desc {
  font-size: 13px;
  color: #6b7280;
  margin: 0 0 16px;
  line-height: 1.5;
}

.plan-features {
  list-style: none;
  margin: 0 0 16px;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #374151;
}

.plan-limits {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 0;
  border-top: 1px solid #f3f4f6;
  border-bottom: 1px solid #f3f4f6;
  margin-bottom: 16px;
}

.limit-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 0;
}

.limit-label {
  font-size: 12px;
  color: #9ca3af;
}

.limit-value {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  display: flex;
  align-items: center;
}

.switch-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 20px;
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
  margin-top: auto;
  width: 100%;
}

.switch-btn:hover:not(:disabled) {
  background: #1d4ed8;
}

.switch-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner {
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.disabled-overlay {
  position: absolute;
  inset: 0;
  border-radius: 14px;
  pointer-events: none;
}

.no-plan-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 32px 24px;
  background: #f9fafb;
  border-radius: 12px;
  text-align: center;
}

.no-plan-icon {
  color: #9ca3af;
}

.no-plan-title {
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  margin: 0;
}

.no-plan-desc {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
  max-width: 360px;
}

.view-plans-btn {
  padding: 10px 24px;
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}

.view-plans-btn:hover {
  background: #1d4ed8;
}

.subscription-skeleton {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 6px;
}

.skeleton-badge {
  width: 100px;
  height: 28px;
  border-radius: 20px;
}

.skeleton-row {
  height: 36px;
  border-radius: 10px;
}

.skeleton-benefits {
  height: 120px;
  border-radius: 10px;
}

.skeleton-grid {
  display: flex;
  gap: 16px;
  margin-top: 8px;
}

.skeleton-card {
  flex: 1;
  height: 280px;
  border-radius: 14px;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.error-banner {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: #fef2f2;
  border-radius: 10px;
  color: #dc2626;
  font-size: 14px;
}

.retry-btn {
  margin-left: auto;
  padding: 4px 12px;
  background: #dc2626;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}

.retry-btn:hover {
  background: #b91c1c;
}
</style>
