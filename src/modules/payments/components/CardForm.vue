<template>
  <section class="settings-card">
    <h3 class="card-title">{{ t('payments.addCard') }}</h3>
    <p class="card-desc">{{ t('payments.gatewayPlaceholder') }}</p>

    <form class="card-form" novalidate @submit.prevent="submit">
      <div class="form-grid">
        <div class="field full">
          <label class="field-label" for="cardHolder">{{ t('payments.cardHolder') }}</label>
          <input
            id="cardHolder"
            v-model="form.cardHolder"
            type="text"
            class="field-input"
            :placeholder="t('payments.cardHolder')"
          />
          <span v-if="errors.cardHolder" class="field-error">{{ errors.cardHolder }}</span>
        </div>

        <div class="field">
          <label class="field-label" for="cardNumber">{{ t('payments.cardNumber') }}</label>
          <input
            id="cardNumber"
            v-model="form.cardNumber"
            type="text"
            inputmode="numeric"
            class="field-input"
            :placeholder="t('payments.cardNumberPlaceholder')"
            maxlength="19"
            @input="formatCardNumber"
          />
          <span v-if="errors.cardNumber" class="field-error">{{ errors.cardNumber }}</span>
        </div>

        <div class="field short">
          <label class="field-label" for="expiry">{{ t('payments.expiry') }}</label>
          <input
            id="expiry"
            v-model="form.expiry"
            type="text"
            inputmode="numeric"
            class="field-input"
            :placeholder="t('payments.expiryPlaceholder')"
            maxlength="5"
            @input="formatExpiry"
          />
          <span v-if="errors.expiry" class="field-error">{{ errors.expiry }}</span>
        </div>

        <div class="field short">
          <label class="field-label" for="cvv">{{ t('payments.cvv') }}</label>
          <input
            id="cvv"
            v-model="form.cvv"
            type="password"
            inputmode="numeric"
            class="field-input"
            :placeholder="t('payments.cvvPlaceholder')"
            maxlength="4"
            @input="formatCvv"
          />
          <span v-if="errors.cvv" class="field-error">{{ errors.cvv }}</span>
        </div>

        <div class="field">
          <label class="field-label" for="address">{{ t('payments.address') }}</label>
          <input
            id="address"
            v-model="form.address"
            type="text"
            class="field-input"
            :placeholder="t('payments.address')"
          />
          <span v-if="errors.address" class="field-error">{{ errors.address }}</span>
        </div>

        <div class="field short">
          <label class="field-label" for="postalCode">{{ t('payments.postalCode') }}</label>
          <input
            id="postalCode"
            v-model="form.postalCode"
            type="text"
            inputmode="numeric"
            class="field-input"
            placeholder="00000"
            maxlength="5"
            @input="formatPostalCode"
          />
          <span v-if="errors.postalCode" class="field-error">{{ errors.postalCode }}</span>
        </div>

        <div class="field short">
          <label class="field-label" for="country">{{ t('payments.country') }}</label>
          <select id="country" v-model="form.country" class="field-select">
            <option value="" disabled>{{ t('patients.select') }}</option>
            <option v-for="c in countries" :key="c.code" :value="c.code">{{ c.name }}</option>
          </select>
          <span v-if="errors.country" class="field-error">{{ errors.country }}</span>
        </div>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn-primary" :disabled="saving">
          <svg v-if="saving" class="spinner" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5" stroke-dasharray="28" stroke-linecap="round" />
          </svg>
          {{ saving ? t('payments.savingCard') : t('payments.saveCard') }}
        </button>
      </div>
    </form>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { paymentService } from '../../../services/payments/payment.service';

const emit = defineEmits(['saved']);

const { t } = useI18n();
const saving = ref(false);

const form = reactive({
  cardHolder: '',
  cardNumber: '',
  expiry: '',
  cvv: '',
  address: '',
  postalCode: '',
  country: '',
});

const errors = reactive({
  cardHolder: '',
  cardNumber: '',
  expiry: '',
  cvv: '',
  address: '',
  postalCode: '',
  country: '',
});

const countries = [
  { code: 'MX', name: 'México' },
  { code: 'US', name: 'Estados Unidos' },
  { code: 'AR', name: 'Argentina' },
  { code: 'CL', name: 'Chile' },
  { code: 'CO', name: 'Colombia' },
  { code: 'ES', name: 'España' },
];

function onlyDigits(str) {
  return (str || '').replace(/\D/g, '');
}

function formatCardNumber() {
  form.cardNumber = onlyDigits(form.cardNumber)
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, '$1 ');
}

function formatExpiry() {
  let digits = onlyDigits(form.expiry).slice(0, 4);
  if (digits.length >= 3) {
    digits = `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }
  form.expiry = digits;
}

function formatCvv() {
  form.cvv = onlyDigits(form.cvv).slice(0, 4);
}

function formatPostalCode() {
  form.postalCode = onlyDigits(form.postalCode).slice(0, 5);
}

function luhnValid(num) {
  const digits = onlyDigits(num);
  if (digits.length < 13) return false;
  let sum = 0;
  let double = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = Number(digits[i]);
    if (double) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    double = !double;
  }
  return sum % 10 === 0;
}

function expiryValid(value) {
  const match = /^(\d{2})\/(\d{2})$/.exec(value || '');
  if (!match) return false;
  const month = Number(match[1]);
  const year = 2000 + Number(match[2]);
  if (month < 1 || month > 12) return false;
  const now = new Date();
  const exp = new Date(year, month, 0);
  return exp >= new Date(now.getFullYear(), now.getMonth(), 1);
}

function detectBrand(number) {
  const digits = onlyDigits(number);
  if (/^4/.test(digits)) return 'Visa';
  if (/^5[1-5]/.test(digits) || /^2[2-7]/.test(digits)) return 'Mastercard';
  if (/^3[47]/.test(digits)) return 'American Express';
  return 'Tarjeta';
}

function validate() {
  errors.cardHolder = form.cardHolder.trim() ? '' : t('payments.cardHolderRequired');
  errors.cardNumber = !form.cardNumber.trim()
    ? t('payments.cardNumberRequired')
    : luhnValid(form.cardNumber)
      ? ''
      : t('payments.cardNumberInvalid');
  errors.expiry = !form.expiry.trim()
    ? t('payments.expiryRequired')
    : expiryValid(form.expiry)
      ? ''
      : t('payments.expiryInvalid');
  errors.cvv = !form.cvv.trim()
    ? t('payments.cvvRequired')
    : /^\d{3,4}$/.test(form.cvv)
      ? ''
      : t('payments.cvvInvalid');
  errors.address = form.address.trim() ? '' : t('payments.addressRequired');
  errors.postalCode = /^\d{5}$/.test(form.postalCode)
    ? ''
    : form.postalCode.trim()
      ? t('payments.postalCodeInvalid')
      : t('payments.postalCodeRequired');
  errors.country = form.country ? '' : t('payments.countryRequired');

  return !Object.values(errors).some(Boolean);
}

async function submit() {
  if (!validate()) return;

  saving.value = true;
  try {
    const card = await paymentService.addCard({
      cardHolder: form.cardHolder.trim(),
      cardNumber: form.cardNumber,
      cvv: form.cvv,
      address: form.address.trim(),
      postalCode: form.postalCode,
      country: form.country,
    });

    emit('saved', {
      id: card.id,
      brand: detectBrand(form.cardNumber),
      last4: card.last4,
      holder: card.cardHolder,
      country: form.country,
    });

    if (window.__toast) window.__toast.success(t('payments.cardSaved'));

    form.cardHolder = '';
    form.cardNumber = '';
    form.expiry = '';
    form.cvv = '';
    form.address = '';
    form.postalCode = '';
    form.country = '';
  } finally {
    saving.value = false;
  }
}
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

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field.full {
  grid-column: 1 / -1;
}

.field-label {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
}

.field-input,
.field-select {
  width: 100%;
  box-sizing: border-box;
  padding: 10px 14px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  font-size: 14px;
  color: #111827;
  background: #ffffff;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
  font-family: inherit;
}

.field-input::placeholder {
  color: #9ca3af;
}

.field-input:focus,
.field-select:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.field-error {
  font-size: 12px;
  color: #dc2626;
}

.form-actions {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 11px 28px;
  background: #2563eb;
  color: #ffffff;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}

.btn-primary:hover:not(:disabled) {
  background: #1d4ed8;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner {
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 767px) {
  .settings-card {
    padding: 20px;
  }

  .form-grid {
    grid-template-columns: 1fr;
    gap: 14px;
  }

  .form-actions {
    justify-content: stretch;
  }

  .btn-primary {
    width: 100%;
    justify-content: center;
  }
}
</style>
