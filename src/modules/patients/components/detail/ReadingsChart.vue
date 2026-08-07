<template>
  <div class="readings-chart">
    <div v-if="loading" class="chart-state">
      <p>Cargando lecturas...</p>
    </div>
    <div v-else-if="error" class="chart-state error">
      <p>{{ error }}</p>
      <button class="retry-btn" @click="$emit('retry')">Reintentar</button>
    </div>
    <div v-else-if="!readings.length" class="chart-state">
      <p>No hay lecturas disponibles para el período seleccionado.</p>
    </div>
    <div v-else class="chart-wrap">
      <v-chart :option="option" autoresize class="chart" />
      <div class="chart-meta">
        <span v-for="m in seriesMeta" :key="m.name" class="meta-item">
          <span class="meta-dot" :style="{ background: m.color }" />
          {{ m.name }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { VChart } from '../../../../modules/dashboard/echarts';
import { useVitalsTimeline } from '../../../../modules/dashboard/useVitalsTimeline';

const props = defineProps({
  readings: { type: Array, default: () => [] },
  range: { type: String, default: '7d' },
  loading: { type: Boolean, default: false },
  error: { type: String, default: '' },
});

defineEmits(['retry']);

const readings = computed(() => props.readings);
const range = computed(() => props.range);
const { option, seriesMeta } = useVitalsTimeline(readings, range);
</script>

<style scoped>
.readings-chart {
  width: 100%;
}

.chart-wrap {
  width: 100%;
}

.chart {
  width: 100%;
  height: 260px;
}

.chart-meta {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-top: 10px;
  font-size: 13px;
  color: #6b7280;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.meta-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.chart-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  height: 200px;
  color: #9ca3af;
  font-size: 14px;
}

.chart-state.error {
  color: #dc2626;
}

.chart-state p {
  margin: 0;
}

.retry-btn {
  padding: 6px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: #ffffff;
  color: #374151;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}

.retry-btn:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}
</style>
