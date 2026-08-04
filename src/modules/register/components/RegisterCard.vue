<template>
  <div class="register-card">
    <slot />
  </div>
</template>

<style scoped>
.register-card {
  width: 100%;
  max-width: 520px;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04);
  border: 1px solid #f3f4f6;
  padding: 36px 36px 32px;
}

/* Responsive */
@media (max-width: 767px) {
  .register-card {
    padding: 24px 20px 24px;
    border-radius: 16px;
  }
}
</style>
