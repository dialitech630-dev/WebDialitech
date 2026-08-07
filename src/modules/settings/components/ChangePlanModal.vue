<template>
  <Teleport to="body">
    <div class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-card">
        <div class="modal-header">
          <h3 class="modal-title">Cambiar suscripción</h3>
          <button class="modal-close" @click="$emit('close')">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M4 4l10 10M14 4l-10 10" stroke="#9ca3af" stroke-width="1.5" stroke-linecap="round" />
            </svg>
          </button>
        </div>

        <div class="modal-body">
          <p class="modal-text">¿Estás seguro de que deseas cambiar tu suscripción?</p>

          <div class="plan-switch">
            <div class="plan-card current">
              <span class="plan-label">Plan actual</span>
              <span class="plan-name">{{ currentPlanName }}</span>
              <span class="plan-price">{{ currentPlanPrice }}</span>
              <span v-if="showsDiscount(currentPlanConfig)" class="plan-billing-note">{{ currentPlanConfig.billingNote }} · Ahorra {{ currentPlanConfig.discount }}%</span>
            </div>
            <div class="arrow-down">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M5 12l7 7 7-7" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
            <div class="plan-card new">
              <span class="plan-label">Nuevo plan</span>
              <span class="plan-name">{{ newPlan.name }}</span>
              <span class="plan-price">{{ formatPrice(newPlan) }}</span>
              <span v-if="showsDiscount(newPlan)" class="plan-billing-note">{{ newPlan.billingNote }} · Ahorra {{ newPlan.discount }}%</span>
            </div>
          </div>

          <div class="feature-comparison">
            <div v-for="(feat, idx) in planFeatures" :key="idx" class="feature-row">
              <span class="feature-name">{{ feat.label }}</span>
              <div class="feature-values">
                <span class="feature-value old" :class="{ missing: !feat.current }">
                  <svg v-if="feat.current" width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7l3 3 5-5" stroke="#22c55e" stroke-width="1.5" stroke-linecap="round"/></svg>
                  <svg v-else width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M4 4l6 6M10 4l-6 6" stroke="#d1d5db" stroke-width="1.5" stroke-linecap="round"/></svg>
                </span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" class="arrow-feat">
                  <path d="M6 4l4 4-4 4" stroke="#9ca3af" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
                <span class="feature-value new" :class="{ missing: !feat.newPlan }">
                  <svg v-if="feat.newPlan" width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7l3 3 5-5" stroke="#22c55e" stroke-width="1.5" stroke-linecap="round"/></svg>
                  <svg v-else width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M4 4l6 6M10 4l-6 6" stroke="#d1d5db" stroke-width="1.5" stroke-linecap="round"/></svg>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-cancel" @click="$emit('close')">Cancelar</button>
          <button class="btn-confirm" :disabled="saving" @click="confirm">
            <svg v-if="saving" class="spinner" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5" stroke-dasharray="28" stroke-linecap="round"/>
            </svg>
            {{ saving ? 'Cambiando...' : 'Confirmar cambio' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useSubscriptionStore } from '../../../stores/subscriptionStore';
import { useBillingCycle } from '../../../composables/useBillingCycle';

const props = defineProps({
  newPlan: { type: Object, required: true },
});

const emit = defineEmits(['close', 'changed']);

const store = useSubscriptionStore();
const { formatPrice, showsDiscount } = useBillingCycle();
const saving = ref(false);

const currentPlanName = computed(() => store.planName);
const currentPlanPrice = computed(() => formatPrice(store.currentPlan));

const currentFeatures = computed(() => store.currentPlan?.features || []);
const newFeatures = computed(() => props.newPlan?.features || []);

const allFeatureLabels = computed(() => {
  const set = new Set([...currentFeatures.value, ...newFeatures.value]);
  return Array.from(set);
});

const currentPlanConfig = computed(() => store.currentPlan);

const planFeatures = computed(() => {
  const currentMods = currentPlanConfig.value?.modules || {};
  const newMods = props.newPlan?.modules || {};
  const currentAccess = currentPlanConfig.value?.access || {};
  const newAccess = props.newPlan?.access || {};

  const featureList = [
    { label: 'Inicio', key: 'dashboard', type: 'module' },
    { label: 'Pacientes', key: 'patients', type: 'module' },
    { label: 'Alertas', key: 'alerts', type: 'module' },
    { label: 'Reportes', key: 'reports', type: 'module' },
    { label: 'Analíticas', key: 'statistics', type: 'module' },
    { label: 'Configuración', key: 'settings', type: 'module' },
    { label: 'Administración', key: 'administration', type: 'module' },
    { label: 'Monitoreo avanzado', key: 'advancedMonitoring', type: 'module' },
    { label: 'Acceso a la API', key: 'apiAccess', type: 'module' },
    { label: 'Información con IA', key: 'ai', type: 'access' },
    { label: 'Exportación de datos', key: 'exports', type: 'access' },
    { label: 'Multi-cuidador', key: 'multiCaregiver', type: 'access' },
  ];

  return featureList.map((f) => {
    const currentAvail = f.type === 'access'
      ? currentAccess[f.key] === true
      : (() => {
          const m = currentMods[f.key];
          return m === 'available' || m?.status === 'available';
        })();
    const newAvail = f.type === 'access'
      ? newAccess[f.key] === true
      : (() => {
          const m = newMods[f.key];
          return m === 'available' || m?.status === 'available';
        })();
    return { label: f.label, current: currentAvail, newPlan: newAvail };
  });
});

async function confirm() {
  saving.value = true;
  try {
    const result = await store.changePlan(props.newPlan.id);
    if (result.success) {
      if (window.__toast) window.__toast.success('Suscripción actualizada exitosamente.');
      emit('changed');
      emit('close');
    } else {
      if (window.__toast) window.__toast.error(result.error);
    }
  } finally {
    saving.value = false;
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-card {
  background: #ffffff;
  border-radius: 16px;
  width: 100%;
  max-width: 520px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px 0;
}

.modal-title {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.modal-close {
  width: 32px;
  height: 32px;
  border: none;
  background: #f3f4f6;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  transition: background 0.15s;
}

.modal-close:hover {
  background: #e5e7eb;
}

.modal-body {
  padding: 20px 24px;
}

.modal-text {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 20px;
}

.plan-switch {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
}

.plan-card {
  width: 100%;
  padding: 14px 18px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.plan-card.current {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
}

.plan-card.new {
  background: #eff6ff;
  border: 1px solid #bfdbfe;
}

.plan-label {
  font-size: 11px;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.plan-name {
  font-size: 16px;
  font-weight: 700;
  color: #111827;
}

.plan-price {
  font-size: 13px;
  color: #6b7280;
}

.plan-billing-note {
  font-size: 11px;
  font-weight: 600;
  color: #059669;
  background: #f0fdf4;
  padding: 2px 8px;
  border-radius: 6px;
  width: fit-content;
}

.arrow-down {
  color: #2563eb;
}

.feature-comparison {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.feature-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #f3f4f6;
}

.feature-row:last-child {
  border-bottom: none;
}

.feature-name {
  font-size: 13px;
  color: #374151;
}

.feature-values {
  display: flex;
  align-items: center;
  gap: 8px;
}

.feature-value {
  display: flex;
  align-items: center;
  width: 20px;
  justify-content: center;
}

.feature-value.missing {
  opacity: 0.4;
}

.arrow-feat {
  flex-shrink: 0;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px 20px;
  border-top: 1px solid #f3f4f6;
}

.btn-cancel {
  padding: 10px 20px;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  transition: background 0.15s;
}

.btn-cancel:hover {
  background: #e5e7eb;
}

.btn-confirm {
  display: inline-flex;
  align-items: center;
  gap: 8px;
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

.btn-confirm:hover:not(:disabled) {
  background: #1d4ed8;
}

.btn-confirm:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner {
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Responsive */
@media (max-width: 767px) {
  .modal-header {
    padding: 16px 20px 0;
  }

  .modal-body {
    padding: 16px 20px;
  }

  .modal-footer {
    padding: 12px 20px 16px;
    flex-wrap: wrap;
  }

  .btn-cancel,
  .btn-confirm {
    flex: 1;
    justify-content: center;
  }
}
</style>
