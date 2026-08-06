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
const { tooltip, grid, legend, valueAxis, categoryAxis, sliderZoom, fontFamily } = useChartPresets();

const chartEl = ref(null);
const { register, unregister } = useChartExportSink();

const show = computed(() => !monitoring.dialysis.loading && !!monitoring.dialysis.data);

const option = computed(() => {
  const d = monitoring.dialysis.data;
  if (!d) return {};
  const { labels, sessions } = d;
  const average = sessions.length ? (sessions.reduce((a, b) => a + b, 0) / sessions.length).toFixed(1) : '--';

  return {
    tooltip: {
      ...tooltip.value,
      trigger: 'axis',
      formatter: (params) => {
        const p = params[0];
        return `${p?.axisValue}<br/><b>Sessions</b>: ${p?.value}`;
      },
    },
    legend: { ...legend.value, data: ['Sessions'], bottom: 0 },
    grid: { ...grid, top: 20, bottom: 32 },
    xAxis: { ...categoryAxis.value, data: labels },
    yAxis: { ...valueAxis.value, name: 'Sessions', nameTextStyle: { color: '#9ca3af' }, minInterval: 1 },
    dataZoom: [sliderZoom.value],
    series: [
      {
        name: 'Sessions', type: 'bar', data: sessions,
        barWidth: '46%',
        itemStyle: { color: '#2563eb', borderRadius: [4, 4, 0, 0] },
        markLine: {
          symbol: 'none',
          silent: true,
          lineStyle: { color: '#9ca3af', type: 'dashed', width: 1 },
          label: { formatter: `Avg ${average}`, color: '#6b7280', fontSize: 10, position: 'insideEndTop' },
          data: [{ type: 'average', name: 'Average' }],
        },
      },
    ],
    textStyle: { fontFamily },
  };
});

const csvPayload = computed(() => {
  const d = monitoring.dialysis.data;
  const labels = d?.labels || [];
  const sessions = d?.sessions || [];
  return {
    columns: ['Week', 'Sessions'],
    rows: labels.map((label, i) => [label, sessions[i]]),
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
