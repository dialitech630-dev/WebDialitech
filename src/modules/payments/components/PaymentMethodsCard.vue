<template>
  <section class="settings-card">
    <h3 class="card-title">{{ t('payments.paymentMethods') }}</h3>
    <p class="card-desc">{{ t('payments.paymentMethodsDesc') }}</p>

    <div class="methods-grid">
      <button
        v-for="method in methods"
        :key="method.id"
        class="method-tile"
        :class="{ selected: selected === method.id }"
        type="button"
        @click="select(method)"
      >
        <span class="method-brand" :class="`brand-${method.id}`">
          <svg v-if="method.id === 'visa'" width="26" height="18" viewBox="0 0 26 18" fill="none">
            <text x="0" y="15" font-size="14" font-weight="800" font-style="italic" fill="#1a1f71" font-family="Arial, sans-serif">VISA</text>
          </svg>
          <svg v-else-if="method.id === 'mastercard'" width="26" height="18" viewBox="0 0 26 18" fill="none">
            <circle cx="9" cy="9" r="7" fill="#eb001b" opacity="0.9" />
            <circle cx="17" cy="9" r="7" fill="#f79e1b" opacity="0.9" />
          </svg>
          <svg v-else-if="method.id === 'amex'" width="26" height="18" viewBox="0 0 26 18" fill="none">
            <text x="0" y="14" font-size="10" font-weight="800" fill="#2e77bc" font-family="Arial, sans-serif">AMEX</text>
          </svg>
          <svg v-else-if="method.id === 'mercadopago'" width="26" height="18" viewBox="0 0 26 18" fill="none">
            <path d="M13 3C8 3 4 7 4 11.5v2.5h4v-2.5C8 9 10 7 13 7s5 2 5 4.5V14h4v-2.5C22 7 18 3 13 3Z" fill="#009ee3" />
          </svg>
          <svg v-else-if="method.id === 'paypal'" width="26" height="18" viewBox="0 0 26 18" fill="none">
            <text x="0" y="15" font-size="13" font-weight="800" font-style="italic" fill="#003087" font-family="Arial, sans-serif">PayPal</text>
          </svg>
          <svg v-else width="26" height="18" viewBox="0 0 26 18" fill="none">
            <rect x="1" y="2" width="24" height="14" rx="2" fill="#2563eb" />
            <rect x="11" y="2" width="4" height="14" fill="#fff" />
          </svg>
        </span>
        <span class="method-name">{{ method.name }}</span>
        <span v-if="selected === method.id" class="method-check">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 8.5L6.5 11L12 5" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </span>
      </button>
    </div>

    <p class="gateway-note">{{ t('payments.gatewayPlaceholder') }}</p>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { paymentService } from '../../../services/payments/payment.service';

const props = defineProps({
  modelValue: { type: String, default: '' },
});

const emit = defineEmits(['update:modelValue', 'select']);

const { t } = useI18n();
const methods = ref([]);
const selected = ref(props.modelValue || '');

function select(method) {
  selected.value = method.id;
  emit('update:modelValue', method.id);
  emit('select', method);
}

onMounted(async () => {
  const list = await paymentService.getPaymentMethods();
  methods.value = list;
  if (props.modelValue && list.some((m) => m.id === props.modelValue)) {
    selected.value = props.modelValue;
  }
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

.methods-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.method-tile {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  padding: 18px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #ffffff;
  cursor: pointer;
  transition: all 0.15s;
  text-align: left;
}

.method-tile:hover {
  border-color: #2563eb;
  box-shadow: 0 4px 16px rgba(37, 99, 235, 0.1);
}

.method-tile.selected {
  border-color: #2563eb;
  background: #eff6ff;
  box-shadow: 0 0 0 1px #2563eb;
}

.method-brand {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 40px;
  background: #ffffff;
  border: 1px solid #f3f4f6;
  border-radius: 8px;
  color: #111827;
}

.method-name {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}

.method-check {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #2563eb;
  display: flex;
  align-items: center;
  justify-content: center;
}

.gateway-note {
  margin: 16px 0 0;
  font-size: 12px;
  color: #9ca3af;
  background: #f9fafb;
  border: 1px dashed #e5e7eb;
  border-radius: 8px;
  padding: 10px 14px;
}

@media (max-width: 1023px) {
  .methods-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 767px) {
  .settings-card {
    padding: 20px;
  }

  .methods-grid {
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .method-tile {
    padding: 14px;
  }
}

@media (max-width: 479px) {
  .methods-grid {
    grid-template-columns: 1fr;
  }
}
</style>
