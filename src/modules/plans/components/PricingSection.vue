<template>
  <section class="pricing-section">
    <div class="pricing-grid">
      <PlanCard
        v-for="plan in plans"
        :key="plan.id"
        :plan="plan"
        :annual="annual"
      />
    </div>
  </section>
</template>

<script setup>
import PlanCard from './PlanCard.vue';

defineProps({
  plans: { type: Array, required: true },
  annual: { type: Boolean, default: false },
});
</script>

<style scoped>
.pricing-section {
  padding: 0 32px 80px;
  max-width: 1200px;
  margin: 0 auto;
}

.pricing-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
  align-items: start;
}

@media (max-width: 1023px) {
  .pricing-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 767px) {
  .pricing-section {
    padding: 0 16px 48px;
  }

  .pricing-grid {
    grid-template-columns: 1fr;
    max-width: 420px;
    margin: 0 auto;
    gap: 20px;
  }
}
</style>
