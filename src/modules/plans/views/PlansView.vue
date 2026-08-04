<template>
  <div class="plans-page">
    <header class="plans-header">
      <div class="header-inner">
        <router-link to="/" class="brand">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="#2563eb" />
            <path d="M8 16C8 11.5817 11.5817 8 16 8V24C11.5817 24 8 20.4183 8 16Z" fill="#fff" fill-opacity="0.9" />
            <path d="M16 8C20.4183 8 24 11.5817 24 16S20.4183 24 16 24" stroke="#fff" stroke-width="1.5" stroke-linecap="round" />
            <circle cx="16" cy="16" r="3" fill="#fff" />
          </svg>
          <span class="brand-name">DiaMonitor</span>
        </router-link>
        <nav class="header-nav">
          <router-link to="/login" class="nav-btn btn-outline">Sign In</router-link>
          <router-link to="/register" class="nav-btn btn-primary">Register</router-link>
        </nav>
      </div>
    </header>

    <PlansHero v-model:annual="annual" />

    <PricingSection :plans="plans" :annual="annual" />

    <div class="divider" />

    <FAQSection :faqs="faqs" />

    <footer class="plans-footer">
      <div class="footer-inner">
        <div class="footer-brand">
          <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="#2563eb" />
            <path d="M8 16C8 11.5817 11.5817 8 16 8V24C11.5817 24 8 20.4183 8 16Z" fill="#fff" fill-opacity="0.9" />
            <path d="M16 8C20.4183 8 24 11.5817 24 16S20.4183 24 16 24" stroke="#fff" stroke-width="1.5" stroke-linecap="round" />
            <circle cx="16" cy="16" r="3" fill="#fff" />
          </svg>
          <span>DiaMonitor</span>
        </div>
        <p class="footer-copy">&copy; 2026 DiaMonitor. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { plans, faqs } from '../data/plans.js';
import PlansHero from '../components/PlansHero.vue';
import PricingSection from '../components/PricingSection.vue';
import FAQSection from '../components/FAQSection.vue';

const annual = ref(false);
</script>

<style scoped>
.plans-page {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  background: #ffffff;
  min-height: 100vh;
}

.plans-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid #f3f4f6;
  z-index: 100;
}

.header-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
}

.brand-name {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
}

.header-nav {
  display: flex;
  align-items: center;
  gap: 12px;
}

.nav-btn {
  padding: 8px 20px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.15s;
}

.btn-outline {
  border: 1px solid #e5e7eb;
  color: #374151;
  background: transparent;
}

.btn-outline:hover {
  background: #f3f4f6;
  border-color: #d1d5db;
}

.btn-primary {
  background: #2563eb;
  color: #ffffff;
  border: 1px solid transparent;
}

.btn-primary:hover {
  background: #1d4ed8;
}

.divider {
  max-width: 800px;
  margin: 0 auto;
  height: 1px;
  background: #f3f4f6;
}

.plans-footer {
  border-top: 1px solid #f3f4f6;
  padding: 20px 32px;
}

.footer-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}

.footer-copy {
  font-size: 13px;
  color: #9ca3af;
  margin: 0;
}

/* Responsive */
@media (max-width: 767px) {
  .header-inner {
    padding: 12px 16px;
  }

  .header-nav {
    gap: 8px;
  }

  .nav-btn {
    padding: 8px 14px;
    font-size: 13px;
  }

  .plans-footer {
    padding: 16px;
  }

  .footer-inner {
    flex-direction: column;
    gap: 8px;
    text-align: center;
  }
}
</style>
