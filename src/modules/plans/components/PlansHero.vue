<template>
  <section class="plans-hero">
    <h1 class="hero-title">Choose Your Plan</h1>
    <p class="hero-desc">Flexible pricing designed for clinics of all sizes. Start with a 14-day free trial — no credit card required.</p>
    <BillingToggle />
  </section>
</template>

<script setup>
import BillingToggle from '../../../components/BillingToggle.vue';
</script>

<style scoped>
.plans-hero {
  text-align: center;
  padding: 120px 32px 56px;
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-size: clamp(30px, 5vw, 44px);
  font-weight: 800;
  color: #111827;
  margin: 0 0 16px 0;
  letter-spacing: -1px;
}

.hero-desc {
  font-size: 18px;
  color: #6b7280;
  line-height: 1.7;
  margin: 0 0 36px 0;
}

/* Responsive */
@media (max-width: 767px) {
  .plans-hero {
    padding: 104px 16px 40px;
  }

  .hero-desc {
    font-size: 16px;
  }
}
</style>
