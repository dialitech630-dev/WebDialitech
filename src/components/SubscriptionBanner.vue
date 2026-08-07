<template>
  <div class="sub-banner" :class="bannerClass">
    <div class="banner-content">
      <div class="banner-text">
        <strong>{{ title }}</strong>
        <p>{{ description }}</p>
      </div>
      <button v-if="showUpgrade && !isPremium" class="upgrade-btn" @click="$emit('upgrade')">
        Cambiar plan
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  plan: { type: String, default: 'Standard' },
  showUpgrade: { type: Boolean, default: true },
});

defineEmits(['upgrade']);

const isPremium = computed(() => props.plan === 'Premium');

const title = computed(() => {
  if (props.plan === 'Standard') return 'Estás en el plan Standard';
  if (props.plan === 'Pro') return 'Estás en el plan Pro';
  return 'Estás en el plan Premium';
});

const description = computed(() => {
  if (props.plan === 'Standard') return 'Actualiza para desbloquear monitoreo avanzado, analíticas, información con IA y más.';
  if (props.plan === 'Pro') return 'Tienes acceso a funciones avanzadas. Actualiza a Premium para escala ilimitada y exportación de datos.';
  return 'Tienes acceso completo a todas las funciones sin límites prácticos.';
});

const bannerClass = computed(() => `sub-${String(props.plan).toLowerCase()}`);
</script>

<style scoped>
.sub-banner {
  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 24px;
}

.sub-standard {
  background: #eff6ff;
  border: 1px solid #bfdbfe;
}

.sub-pro {
  background: #eef2ff;
  border: 1px solid #c7d2fe;
}

.sub-premium {
  background: #f5f3ff;
  border: 1px solid #ddd6fe;
}

.banner-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.banner-text strong {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 4px;
}

.banner-text p {
  font-size: 13px;
  color: #6b7280;
  margin: 0;
  line-height: 1.4;
}

.upgrade-btn {
  flex-shrink: 0;
  padding: 8px 18px;
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
  white-space: nowrap;
}

.upgrade-btn:hover {
  background: #1d4ed8;
}

/* Responsive */
@media (max-width: 767px) {
  .banner-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .upgrade-btn {
    width: 100%;
  }
}
</style>
