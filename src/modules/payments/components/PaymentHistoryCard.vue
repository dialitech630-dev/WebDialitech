<template>
  <section class="settings-card">
    <h3 class="card-title">{{ t('payments.paymentHistory') }}</h3>
    <p class="card-desc">{{ t('payments.paymentHistoryDesc') }}</p>

    <div v-if="loading" class="empty-state">
      <p class="empty-title">{{ t('common.loading') }}</p>
    </div>

    <div v-else-if="!rows.length" class="empty-state">
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        <rect x="4" y="8" width="36" height="28" rx="6" stroke="#d1d5db" stroke-width="1.5" />
        <path d="M4 16h36" stroke="#d1d5db" stroke-width="1.5" />
        <circle cx="12" cy="22" r="1.5" fill="#d1d5db" />
        <circle cx="12" cy="28" r="1.5" fill="#d1d5db" />
      </svg>
      <p class="empty-title">{{ t('payments.noPayments') }}</p>
    </div>

    <div v-else class="history-table">
      <div class="table-head">
        <span class="col concept">{{ t('payments.invoice') }}</span>
        <span class="col date">{{ t('payments.nextCharge') }}</span>
        <span class="col amount">{{ t('payments.monthlyPrice') }}</span>
        <span class="col status">{{ t('payments.status') }}</span>
        <span class="col action" />
      </div>
      <div v-for="row in rows" :key="row.id" class="table-row">
        <span class="col concept">{{ row.concept }}</span>
        <span class="col date">{{ row.date }}</span>
        <span class="col amount">{{ row.amount }}</span>
        <span class="col status"><span class="paid-badge">{{ t('common.active') }}</span></span>
        <span class="col action">
          <button class="invoice-btn" type="button" @click="downloadInvoice">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1v10M4.5 7.5L8 11l3.5-3.5M2 14h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            {{ t('payments.downloadInvoice') }}
          </button>
        </span>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { paymentService } from '../../../services/payments/payment.service';
import { useSubscriptionStore } from '../../../stores/subscriptionStore';
import { useBillingCycle, formatMXN } from '../../../composables/useBillingCycle';

const { t } = useI18n();
const loading = ref(true);
const history = ref([]);
const sub = useSubscriptionStore();
const { isYearly } = useBillingCycle();

const rows = computed(() => {
  if (!history.value.length) return [];
  const plan = sub.currentPlan;
  const price = isYearly.value ? plan.yearlyPrice : plan.monthlyPrice;
  const amount = `${formatMXN(price)} ${isYearly.value ? t('billing.perYear') : t('billing.perMonth')}`;
  const date = new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date());

  return history.value.map((row) => ({
    id: row.id,
    concept: isYearly.value ? `${t('plans.annual')} · ${plan.name}` : `${t('billing.monthly')} · ${plan.name}`,
    date,
    amount,
  }));
});

function downloadInvoice() {
  if (window.__toast) window.__toast.info(t('payments.invoiceComingSoon'));
}

onMounted(async () => {
  const list = await paymentService.getPaymentHistory();
  history.value = list;
  loading.value = false;
});
</script>

<style scoped>
.settings-card {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
  border: 1px solid #f3f4f6;
  padding: 24px 28px;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 4px 0;
}

.card-desc {
  font-size: 13px;
  color: #6b7280;
  margin: 0 0 20px 0;
}

.history-table {
  border: 1px solid #f3f4f6;
  border-radius: 12px;
  overflow: hidden;
}

.table-head,
.table-row {
  display: grid;
  grid-template-columns: 2fr 1.4fr 1.2fr 0.8fr 1.6fr;
  gap: 12px;
  align-items: center;
  padding: 12px 18px;
}

.table-head {
  background: #f9fafb;
  border-bottom: 1px solid #f3f4f6;
}

.table-head .col {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  color: #9ca3af;
}

.table-row {
  border-bottom: 1px solid #f3f4f6;
  font-size: 14px;
  color: #374151;
}

.table-row:last-child {
  border-bottom: none;
}

.concept {
  font-weight: 600;
  color: #111827;
}

.date {
  color: #6b7280;
}

.amount {
  font-weight: 600;
  color: #111827;
}

.paid-badge {
  display: inline-flex;
  align-items: center;
  font-size: 12px;
  font-weight: 600;
  color: #059669;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  padding: 3px 10px;
  border-radius: 20px;
}

.invoice-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  color: #2563eb;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 8px;
  padding: 6px 12px;
  cursor: pointer;
  transition: all 0.15s;
}

.invoice-btn:hover {
  background: #dbeafe;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 36px 20px;
  text-align: center;
}

.empty-title {
  font-size: 14px;
  font-weight: 600;
  color: #6b7280;
  margin: 0;
}

@media (max-width: 1023px) {
  .table-head {
    display: none;
  }

  .table-row {
    grid-template-columns: 1fr;
    gap: 6px;
    padding: 16px 18px;
  }

  .col.amount,
  .col.status,
  .col.action {
    margin-top: 2px;
  }
}

@media (max-width: 767px) {
  .settings-card {
    padding: 20px;
  }
}
</style>
