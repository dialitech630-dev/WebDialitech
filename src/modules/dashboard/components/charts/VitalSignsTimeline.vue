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

const show = computed(() => !monitoring.vitals.loading && !!monitoring.vitals.data);

const option = computed(() => {
  const d = monitoring.vitals.data;
  if (!d) return {};
  const { labels, heartRate, oxygen, temperature } = d;

  return {
    color: ['#ef4444', '#2563eb', '#f59e0b'],
    tooltip: { ...tooltip.value, trigger: 'axis' },
    legend: { ...legend.value, data: ['Heart Rate', 'SpO2', 'Temperature'], bottom: 0 },
    grid: { ...grid, top: 20, bottom: 28 },
    xAxis: { ...categoryAxis.value, boundaryGap: false, data: labels },
    yAxis: [
      { ...valueAxis.value, name: 'bpm', nameTextStyle: { color: colors.value.textMuted, padding: [0, 0, 0, -4] } },
      { ...valueAxis.value, name: '%', min: 90, max: 100, nameTextStyle: { color: colors.value.textMuted } },
      { ...valueAxis.value, name: '°C', min: 35, max: 39, nameTextStyle: { color: colors.value.textMuted } },
    ],
    dataZoom: [insideZoom.value, sliderZoom.value],
    series: [
      {
        name: 'Heart Rate', type: 'line', yAxisIndex: 0, data: heartRate,
        smooth: true, symbol: 'circle', symbolSize: 5,
        lineStyle: { width: 2 }, itemStyle: { borderRadius: 10 },
      },
      {
        name: 'SpO2', type: 'line', yAxisIndex: 1, data: oxygen,
        smooth: true, symbol: 'circle', symbolSize: 5, lineStyle: { width: 2 },
      },
      {
        name: 'Temperature', type: 'line', yAxisIndex: 2, data: temperature,
        smooth: true, symbol: 'circle', symbolSize: 5, lineStyle: { width: 2 },
      },
    ],
    textStyle: { fontFamily },
  };
});

const csvPayload = computed(() => {
  const d = monitoring.vitals.data;
  const labels = d?.labels || [];
  const hr = d?.heartRate || [];
  const ox = d?.oxygen || [];
  const temp = d?.temperature || [];
  return {
    columns: ['Timestamp', 'Heart Rate (bpm)', 'SpO2 (%)', 'Temperature (°C)'],
    rows: labels.map((label, i) => [label, hr[i], ox[i], temp[i]]),
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
