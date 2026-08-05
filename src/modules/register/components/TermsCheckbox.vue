<template>
  <label class="terms-checkbox">
    <div class="checkbox-box" :class="{ checked }" @click="checked = !checked">
      <svg v-if="checked" width="11" height="11" viewBox="0 0 12 12" fill="none">
        <path d="M2.5 6L5 8.5L9.5 3.5" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </div>
    <span class="terms-text">
      I agree to the
      <a href="#" class="terms-link" @click.prevent>Terms and Conditions</a>
    </span>
  </label>
</template>

<script setup>
import { ref } from 'vue';
const checked = ref(false);

defineExpose({ checked });
</script>

<style scoped>
.terms-checkbox {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  margin-top: 20px;
  user-select: none;
}

.checkbox-box {
  width: 18px;
  height: 18px;
  border: 1.5px solid #d1d5db;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.15s;
}

.checkbox-box.checked {
  background: #2563eb;
  border-color: #2563eb;
}

.terms-text {
  font-size: 13px;
  color: #6b7280;
}

.terms-link {
  color: #2563eb;
  font-weight: 600;
  text-decoration: none;
}

.terms-link:hover {
  text-decoration: underline;
}
</style>
