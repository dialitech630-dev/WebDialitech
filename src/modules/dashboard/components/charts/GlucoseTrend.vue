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

const show = computed(() => !monitoring.glucose.loading && !!monitoring.glucose.data);

const option = computed(() => {
  const d = monitoring.glucose.data;
  if (!d) return {};
  const { labels, values } = d;

  return {
    color: ['#22c55e'],
    tooltip: {
      ...tooltip.value,
      trigger: 'axis',
      formatter: (params) => {
        const p = params[0];
        const v = p?.value;
        const state = v < 70 || v > 180 ? 'Out of range' : v >= 140 ? 'Caution' : 'Normal';
        return `${p?.axisValue}<br/><b>Glucose</b>: ${v} mg/dL<br/><span style="opacity:.75">${state}</span>`;
      },
    },
    legend: { show: false },
    grid: { ...grid, top: 16, bottom: 56 },
    xAxis: { ...categoryAxis.value, boundaryGap: false, data: labels },
    yAxis: { ...valueAxis.value, name: 'mg/dL', nameTextStyle: { color: colors.value.textMuted } },
    dataZoom: [insideZoom.value, sliderZoom.value],
    visualMap: {
      type: 'piecewise',
      seriesIndex: 0,
      dimension: 1,
      show: true,
      left: 8,
      bottom: 0,
      orient: 'horizontal',
      itemWidth: 14,
      itemHeight: 8,
      textStyle: { color: colors.value.textSecondary, fontSize: 11, fontFamily },
      pieces: [
        { gte: 0, lt: 70, label: 'Below range', color: '#ef4444' },
        { gte: 70, lt: 140, label: 'Normal', color: '#22c55e' },
        { gte: 140, lt: 180, label: 'Caution', color: '#eab308' },
        { gte: 180, label: 'Out of range', color: '#ef4444' },
      ],
    },
    series: [
      {
        name: 'Glucose', type: 'line', data: values,
        smooth: false, symbol: 'circle', symbolSize: 7, showSymbol: true,
        lineStyle: { width: 2 },
      },
    ],
    textStyle: { fontFamily },
  };
});

const csvPayload = computed(() => {
  const d = monitoring.glucose.data;
  const labels = d?.labels || [];
  const values = d?.values || [];
  return {
    columns: ['Date', 'Glucose (mg/dL)'],
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
