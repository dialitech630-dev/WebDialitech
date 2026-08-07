<template>
  <div class="payments-view">
    <PaymentsHeader />

    <div class="payments-content">
      <PlanSummaryCard :payment-method="paymentMethodLabel" />

      <PaymentMethodsCard v-model="selectedMethod" @select="onMethodSelect" />

      <CardForm @saved="onCardSaved" />

      <PaymentHistoryCard />

      <PlansCatalog />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import PaymentsHeader from '../components/PaymentsHeader.vue';
import PlanSummaryCard from '../components/PlanSummaryCard.vue';
import PaymentMethodsCard from '../components/PaymentMethodsCard.vue';
import CardForm from '../components/CardForm.vue';
import PaymentHistoryCard from '../components/PaymentHistoryCard.vue';
import PlansCatalog from '../components/PlansCatalog.vue';

const selectedMethod = ref('');
const selectedMethodName = ref('');
const savedCard = ref(null);

function onMethodSelect(method) {
  selectedMethodName.value = method.name;
}

function onCardSaved(card) {
  savedCard.value = card;
}

const paymentMethodLabel = computed(() => {
  if (savedCard.value) {
    return `${savedCard.value.brand} •••• ${savedCard.value.last4}`;
  }
  return selectedMethodName.value;
});
</script>

<style scoped>
.payments-view {
  padding: var(--page-padding);
  background: #f8f9fa;
  flex: 1;
}

.payments-content {
  display: flex;
  flex-direction: column;
  gap: var(--card-gap);
  max-width: 1200px;
}

@media (max-width: 1023px) {
  .payments-view {
    padding: 24px;
  }
}

@media (max-width: 767px) {
  .payments-view {
    padding: 16px;
  }
}
</style>
