<template>
  <section class="plans-hero">
    <h1 class="hero-title">Choose Your Plan</h1>
    <p class="hero-desc">Flexible pricing designed for clinics of all sizes. Start with a 14-day free trial — no credit card required.</p>
    <div class="hero-toggle">
      <span class="toggle-label" :class="{ active: !annual }">Monthly</span>
      <label class="toggle-switch">
        <input type="checkbox" v-model="annual" />
        <span class="toggle-slider" />
      </label>
      <span class="toggle-label" :class="{ active: annual }">Annual</span>
      <span v-if="annual" class="toggle-save">Save 20%</span>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';

const annual = ref(false);
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

.hero-toggle {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 6px 20px;
  background: #f3f4f6;
  border-radius: 40px;
}

.toggle-label {
  font-size: 14px;
  font-weight: 500;
  color: #9ca3af;
  transition: color 0.15s;
}

.toggle-label.active {
  color: #111827;
  font-weight: 600;
}

.toggle-switch {
  position: relative;
  width: 44px;
  height: 24px;
  background: #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.2s;
}

.toggle-switch:has(input:checked) {
  background: #2563eb;
}

.toggle-switch input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background: #ffffff;
  border-radius: 50%;
  transition: transform 0.2s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
}

.toggle-switch:has(input:checked) .toggle-slider {
  transform: translateX(20px);
}

.toggle-save {
  font-size: 12px;
  font-weight: 600;
  color: #059669;
  background: #f0fdf4;
  padding: 4px 10px;
  border-radius: 6px;
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
