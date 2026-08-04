<template>
  <div class="upgrade-page">
    <div class="upgrade-card">
      <div class="upgrade-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
          <rect x="4" y="10" width="16" height="11" rx="2" stroke="#7c3aed" stroke-width="1.6" />
          <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="#7c3aed" stroke-width="1.6" stroke-linecap="round" />
          <circle cx="12" cy="15" r="1.2" fill="#7c3aed" />
          <path d="M12 15v2" stroke="#7c3aed" stroke-width="1.6" stroke-linecap="round" />
        </svg>
      </div>
      <h1 class="upgrade-title">Upgrade Required</h1>
      <p class="upgrade-desc">
        The <strong>{{ featureLabel }}</strong> feature is not included in your current plan.
        Upgrade to a higher plan to unlock it.
      </p>
      <p v-if="suggestedPlan" class="upgrade-suggested">
        Included in the <strong>{{ suggestedPlan.name }}</strong> plan and above.
      </p>
      <div class="upgrade-actions">
        <button class="btn-primary" @click="showPlans = true">View Plans</button>
        <router-link to="/dashboard" class="btn-outline">Go to Dashboard</router-link>
      </div>
    </div>

    <UpgradePlanModal
      :visible="showPlans"
      :current-plan="auth.plan"
      :feature="feature"
      @close="showPlans = false"
      @select="onSelectPlan"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';
import { useSubscriptionStore } from '../stores/subscriptionStore';
import { MODULE_LABELS } from '../config/plans';
import { getUpgradeSuggestion, normalizePlanId } from '../services/permission.service';
import UpgradePlanModal from '../components/UpgradePlanModal.vue';

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const sub = useSubscriptionStore();
const showPlans = ref(false);

const feature = computed(() => route.query.feature || '');
const featureLabel = computed(() => MODULE_LABELS[feature.value] || 'Requested');
const suggestedPlan = computed(() => {
  if (!feature.value) return null;
  return getUpgradeSuggestion(normalizePlanId(auth.plan), feature.value);
});

async function onSelectPlan(planId) {
  showPlans.value = false;
  const result = await sub.changePlan(planId);
  if (result.success) {
    if (window.__toast) window.__toast.success('Subscription updated successfully.');
    router.push('/dashboard');
  } else if (window.__toast) {
    window.__toast.error(result.error);
  }
}
</script>

<style scoped>
.upgrade-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  padding: 24px;
}

.upgrade-card {
  text-align: center;
  max-width: 440px;
}

.upgrade-icon {
  width: 88px;
  height: 88px;
  margin: 0 auto 20px;
  border-radius: 24px;
  background: #f5f3ff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upgrade-title {
  font-size: 28px;
  font-weight: 800;
  color: #111827;
  margin: 0 0 10px;
}

.upgrade-desc {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.6;
  margin: 0 0 10px;
}

.upgrade-desc strong {
  color: #111827;
}

.upgrade-suggested {
  font-size: 13px;
  color: #7c3aed;
  margin: 0 0 28px;
}

.upgrade-actions {
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
  cursor: pointer;
  border: none;
  transition: all 0.15s;
}

.btn-primary {
  background: #7c3aed;
  color: #ffffff;
}

.btn-primary:hover {
  background: #6d28d9;
}

.btn-outline {
  border: 1px solid #e5e7eb;
  background: #ffffff;
  color: #374151;
}

.btn-outline:hover {
  background: #f3f4f6;
}
</style>
