<template>
  <div class="chart-wrap">
    <v-chart v-if="show" ref="chartEl" :option="option" autoresize class="chart" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { VChart } from '../../echarts';
import { useChartPresets } from '../../optionPresets';
import { useChartExportSink } from '../../exportBridge';
import { useMonitoringData } from '../../../../composables/useMonitoringData';

const monitoring = useMonitoringData();
const { colors, tooltip, grid, legend, valueAxis, categoryAxis, insideZoom, sliderZoom, fontFamily } = useChartPresets();

const chartEl = ref(null);
const { register, unregister } = useChartExportSink();

const show = computed(() => !monitoring.bloodPressure.loading && !!monitoring.bloodPressure.data);

const option = computed(() => {
  const d = monitoring.bloodPressure.data;
  if (!d) return {};
  const { labels, systolic, diastolic } = d;

  return {
    color: ['#2563eb', '#8b5cf6'],
    tooltip: { ...tooltip.value, trigger: 'axis' },
    legend: { ...legend.value, data: ['Systolic', 'Diastolic'], bottom: 0 },
    grid: { ...grid, top: 20, bottom: 28 },
    xAxis: { ...categoryAxis.value, boundaryGap: false, data: labels },
    yAxis: { ...valueAxis.value, name: 'mmHg', nameTextStyle: { color: colors.value.textMuted } },
    dataZoom: [insideZoom.value, sliderZoom.value],
    series: [
      {
        name: 'Systolic', type: 'line', data: systolic,
        smooth: true, symbol: 'circle', symbolSize: 5, lineStyle: { width: 2 },
        markLine: {
          symbol: 'none',
          silent: true,
          data: [
            {
              yAxis: 140,
              lineStyle: { color: '#ef4444', type: 'dashed', width: 1.5 },
              label: { formatter: 'Upper SYS 140', color: '#ef4444', fontSize: 10, position: 'insideEndTop' },
            },
          ],
        },
      },
      {
        name: 'Diastolic', type: 'line', data: diastolic,
        smooth: true, symbol: 'circle', symbolSize: 5, lineStyle: { width: 2 },
        markLine: {
          symbol: 'none',
          silent: true,
          data: [
            {
              yAxis: 90,
              lineStyle: { color: '#f59e0b', type: 'dashed', width: 1.5 },
              label: { formatter: 'Upper DIA 90', color: '#b45309', fontSize: 10, position: 'insideEndTop' },
            },
            {
              yAxis: 120,
              lineStyle: { color: '#22c55e', type: 'dashed', width: 1 },
              label: { formatter: 'Normal SYS 120', color: '#15803d', fontSize: 10, position: 'insideEndBottom' },
            },
          ],
        },
      },
    ],
    textStyle: { fontFamily },
  };
});

const csvPayload = computed(() => {
  const d = monitoring.bloodPressure.data;
  const labels = d?.labels || [];
  const systolic = d?.systolic || [];
  const diastolic = d?.diastolic || [];
  return {
    columns: ['Timestamp', 'Systolic (mmHg)', 'Diastolic (mmHg)'],
    rows: labels.map((label, i) => [label, systolic[i], diastolic[i]]),
  };
});

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
</style>
