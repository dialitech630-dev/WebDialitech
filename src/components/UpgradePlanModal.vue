<template>
  <Teleport to="body">
    <div v-if="visible" class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-card">
        <button class="close-btn" @click="$emit('close')">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M5 5L15 15M15 5L5 15" stroke="#6b7280" stroke-width="1.5" stroke-linecap="round" />
          </svg>
        </button>

        <div v-if="!viewingPlans" class="modal-body">
          <div class="lock-badge">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <rect x="4" y="10" width="16" height="11" rx="2" stroke="#7c3aed" stroke-width="1.6" />
              <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="#7c3aed" stroke-width="1.6" stroke-linecap="round" />
              <circle cx="12" cy="15" r="1.2" fill="#7c3aed" />
              <path d="M12 15v2" stroke="#7c3aed" stroke-width="1.6" stroke-linecap="round" />
            </svg>
          </div>
          <h2 class="modal-title">Requiere actualización</h2>
          <p class="modal-desc">
            {{ message }}
          </p>
          <p v-if="suggestedPlan" class="suggested">
            Esta función está incluida en el plan <strong>{{ suggestedPlan.name }}</strong> y superiores.
          </p>
          <button class="view-plans-btn" @click="viewingPlans = true">Ver planes</button>
        </div>

        <div v-else class="modal-body">
          <h2 class="modal-title">Elegir plan</h2>
          <p class="modal-desc">Compara los planes y elige el que se adapte a tus necesidades.</p>
          <div class="billing-toggle-wrap">
            <BillingToggle />
          </div>

          <div class="plans-comparison">
            <div
              v-for="plan in upgradePlans"
              :key="plan.id"
              class="plan-card"
              :class="{ featured: plan.featured, current: plan.isCurrent }"
            >
              <div v-if="plan.featured && !plan.isCurrent" class="popular-badge">Más popular</div>
              <div v-if="plan.isCurrent" class="popular-badge current-badge">Actual</div>
              <h3 class="plan-name">{{ plan.name }}</h3>
              <div class="plan-price">
                <span class="price">{{ planPriceLabel(plan) }}</span>
                <span v-if="planPrice(plan) !== 0" class="period">{{ planPeriodLabel(plan) }}</span>
              </div>
              <div v-if="showsDiscount(plan)" class="plan-save">
                <span class="save-badge">Ahorra {{ plan.discount }}%</span>
                <span class="save-note">{{ plan.billingNote }}</span>
              </div>
              <ul class="plan-features">
                <li v-for="(feat, i) in plan.features.slice(0, 6)" :key="i" class="feature-item">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3 7.5L5.5 10L11 4" stroke="#22c55e" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  {{ feat }}
                </li>
              </ul>
              <button
                class="select-plan-btn"
                :disabled="plan.isCurrent"
                @click="$emit('select', plan.id)"
              >
                {{ plan.isCurrent ? 'Plan actual' : `Elegir ${plan.name}` }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue';
import { PLANS, PLAN_ORDER } from '../config/plans';
import { useBillingCycle } from '../composables/useBillingCycle';
import BillingToggle from './BillingToggle.vue';
import { getUpgradeSuggestion, normalizePlanId } from '../services/permission.service';

const props = defineProps({
  visible: { type: Boolean, default: false },
  currentPlan: { type: String, default: 'Standard' },
  feature: { type: String, default: '' },
  message: {
    type: String,
    default: 'Esta función está disponible en un plan de suscripción superior. Actualiza para desbloquearla.',
  },
});

defineEmits(['close', 'select']);

const { planPrice, planPriceLabel, planPeriodLabel, showsDiscount } = useBillingCycle();

const viewingPlans = ref(false);

const suggestedPlan = computed(() => {
  if (!props.feature) return null;
  return getUpgradeSuggestion(normalizePlanId(props.currentPlan), props.feature);
});

const upgradePlans = computed(() => {
  const currentPlan = normalizePlanId(props.currentPlan);
  const currentIndex = PLAN_ORDER.indexOf(currentPlan);
  const start = currentIndex >= 0 ? currentIndex : 0;
  return PLAN_ORDER.slice(start).map((id) => {
    const plan = PLANS[id];
    return { ...plan, isCurrent: id === currentPlan };
  });
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 24px;
}

.modal-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 36px;
  max-width: 720px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 36px;
  height: 36px;
  border: none;
  background: #f3f4f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s;
}

.close-btn:hover {
  background: #e5e7eb;
}

.modal-body {
  text-align: center;
}

.lock-badge {
  width: 64px;
  height: 64px;
  margin: 0 auto 16px;
  border-radius: 20px;
  background: #f5f3ff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-title {
  font-size: 24px;
  font-weight: 800;
  color: #111827;
  margin: 0 0 10px;
  letter-spacing: -0.3px;
}

.modal-desc {
  font-size: 14px;
  color: #6b7280;
  margin: 0 auto 8px;
  max-width: 420px;
  line-height: 1.6;
}

.suggested {
  font-size: 13px;
  color: #7c3aed;
  margin: 8px 0 24px;
}

.suggested strong {
  font-weight: 700;
}

.view-plans-btn {
  margin-top: 8px;
  padding: 12px 32px;
  background: #7c3aed;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}

.view-plans-btn:hover {
  background: #6d28d9;
}

.plans-comparison {
  display: flex;
  gap: 16px;
  margin-top: 20px;
  text-align: left;
}

.billing-toggle-wrap {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}

.plan-card {
  flex: 1;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px 20px;
  position: relative;
  display: flex;
  flex-direction: column;
  transition: border-color 0.2s;
}

.plan-card.featured {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.plan-card.current {
  border-color: #22c55e;
  background: #f0fdf4;
}

.popular-badge {
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  background: #2563eb;
  color: #fff;
  font-size: 11px;
  font-weight: 600;
  padding: 3px 12px;
  border-radius: 6px;
  white-space: nowrap;
}

.popular-badge.current-badge {
  background: #22c55e;
}

.plan-name {
  font-size: 16px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 8px;
}

.plan-price {
  margin-bottom: 16px;
}

.price {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
}

.period {
  font-size: 13px;
  color: #6b7280;
}

.plan-save {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.save-badge {
  font-size: 11px;
  font-weight: 600;
  color: #059669;
  background: #f0fdf4;
  padding: 3px 10px;
  border-radius: 6px;
}

.save-note {
  font-size: 11px;
  color: #9ca3af;
}

.plan-features {
  list-style: none;
  padding: 0;
  margin: 0 0 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #374151;
}

.select-plan-btn {
  padding: 10px;
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}

.select-plan-btn:hover:not(:disabled) {
  background: #1d4ed8;
}

.select-plan-btn:disabled {
  opacity: 0.6;
  cursor: default;
}

/* Responsive: planes en columna en pantallas pequenas */
@media (max-width: 767px) {
  .modal-card {
    padding: 24px 20px;
  }

  .plans-comparison {
    flex-direction: column;
    gap: 16px;
  }

  .plan-card {
    padding: 20px 18px;
  }

  .modal-title {
    font-size: 20px;
  }
}
</style>
