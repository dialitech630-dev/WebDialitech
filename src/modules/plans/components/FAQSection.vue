<template>
  <section class="faq-section">
    <h2 class="faq-title">{{ t('plans.faq') }}</h2>
    <p class="faq-desc">{{ t('plans.faqSubtitle') }}</p>
    <div class="faq-list">
      <div v-for="(faq, i) in faqs" :key="i" class="faq-item">
        <div class="faq-question">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="8" stroke="#2563eb" stroke-width="1.3" />
            <path d="M10 8v5" stroke="#2563eb" stroke-width="1.5" stroke-linecap="round" />
            <circle cx="10" cy="6" r="1" fill="#2563eb" />
          </svg>
          <span>{{ faq.question }}</span>
        </div>
        <p class="faq-answer">{{ faq.answer }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

defineProps({
  faqs: { type: Array, required: true },
});

const { t } = useI18n();
</script>

<style scoped>
.faq-section {
  padding: 80px 32px;
  max-width: 800px;
  margin: 0 auto;
}

.faq-title {
  font-size: 36px;
  font-weight: 700;
  color: #111827;
  text-align: center;
  margin: 0 0 12px 0;
  letter-spacing: -0.5px;
}

.faq-desc {
  font-size: 16px;
  color: #6b7280;
  text-align: center;
  margin: 0 0 48px 0;
  line-height: 1.6;
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.faq-item {
  background: #ffffff;
  border-radius: 14px;
  border: 1px solid #f3f4f6;
  padding: var(--card-padding) var(--card-padding-h);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  transition: box-shadow 0.2s;
}

.faq-item:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}

.faq-question {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 10px;
}

.faq-answer {
  font-size: 15px;
  color: #6b7280;
  line-height: 1.7;
  margin: 0 0 0 32px;
}

/* Responsive */
@media (max-width: 767px) {
  .faq-section {
    padding: 48px 16px;
  }

  .faq-title {
    font-size: 28px;
  }

  .faq-item {
    padding: 20px;
  }

  .faq-answer {
    margin-left: 0;
  }
}
</style>
