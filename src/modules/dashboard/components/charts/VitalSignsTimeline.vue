<template>
  <div class="chart-wrap">
    <v-chart v-if="show" ref="chartEl" :option="option" autoresize class="chart" />
    <div v-else class="chart-message">
      <span v-if="store.readingsLoading">Cargando lecturas…</span>
      <span v-else>No hay lecturas disponibles para el período seleccionado.</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { VChart } from '../../echarts';
import { useChartExportSink } from '../../exportBridge';
import { useVitalsTimeline } from '../../useVitalsTimeline';
import { useDashboardStore } from '../../../../stores/dashboardStore';

const store = useDashboardStore();
const chartEl = ref(null);
const { register, unregister } = useChartExportSink();
const { option, csvPayload } = useVitalsTimeline(store.readings, store.range);

const show = computed(() => store.readings.length > 0);

function getInstance() {
  return chartEl.value?.chart || null;
}

const handle = { getInstance, getCsv: () => csvPayload.value };

onMounted(() => register(handle));
onBeforeUnmount(() => unregister(handle));
</script>

<style scoped>
.chart-wrap {
  width: 100%;
  height: 100%;
}

.chart {
  width: 100%;
  height: 100%;
}

.chart-message {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #9ca3af;
  font-size: 14px;
}

:global(:root.theme-dark) .chart-message {
  color: #64748b;
}
</style>
