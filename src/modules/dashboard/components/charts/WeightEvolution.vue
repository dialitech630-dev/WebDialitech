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
const { colors, tooltip, grid, valueAxis, categoryAxis, insideZoom, sliderZoom, fontFamily } = useChartPresets();

const chartEl = ref(null);
const { register, unregister } = useChartExportSink();

const show = computed(() => !monitoring.weight.loading && !!monitoring.weight.data);

const option = computed(() => {
  const d = monitoring.weight.data;
  if (!d) return {};
  const { labels, values, changes } = d;

  const markPoints = (changes || [])
    .filter((c) => labels[c.index] != null)
    .map((c) => ({
      coord: [labels[c.index], c.value],
      value: c.label,
      symbol: 'pin',
      symbolSize: 34,
      itemStyle: { color: c.value < 0 ? '#2563eb' : '#ef4444' },
      label: { formatter: c.label, fontSize: 9, color: '#ffffff', position: 'inside' },
    }));

  return {
    color: ['#2563eb'],
    tooltip: {
      ...tooltip.value,
      trigger: 'axis',
      formatter: (params) => {
        const p = params[0];
        return `${p?.axisValue}<br/><b>Weight</b>: ${p?.value} kg`;
      },
    },
    legend: { show: false },
    grid: { ...grid, top: 28, bottom: 40 },
    xAxis: { ...categoryAxis.value, boundaryGap: false, data: labels, axisLabel: { ...categoryAxis.value.axisLabel, hideOverlap: true } },
    yAxis: { ...valueAxis.value, name: 'kg', nameTextStyle: { color: colors.value.textMuted }, scale: true },
    dataZoom: [insideZoom.value, sliderZoom.value],
    series: [
      {
        name: 'Weight', type: 'line', data: values,
        smooth: true, symbol: 'circle', symbolSize: 4,
        lineStyle: { width: 2 },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(37, 99, 235, 0.22)' },
              { offset: 1, color: 'rgba(37, 99, 235, 0.02)' },
            ],
          },
        },
        markPoint: {
          symbol: 'pin',
          data: markPoints,
        },
      },
    ],
    textStyle: { fontFamily },
  };
});

const csvPayload = computed(() => {
  const d = monitoring.weight.data;
  const labels = d?.labels || [];
  const values = d?.values || [];
  return {
    columns: ['Date', 'Weight (kg)'],
    rows: labels.map((label, i) => [label, values[i]]),
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
