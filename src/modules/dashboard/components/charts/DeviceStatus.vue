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
const { colors, tooltip, legend, fontFamily } = useChartPresets();

const chartEl = ref(null);
const { register, unregister } = useChartExportSink();

const show = computed(() => !monitoring.deviceStatus.loading && !!monitoring.deviceStatus.data);

const total = computed(() => (monitoring.deviceStatus.data || []).reduce((acc, item) => acc + item.value, 0));

const option = computed(() => {
  const data = monitoring.deviceStatus.data || [];
  const colorMap = { Connected: '#22c55e', Disconnected: '#ef4444', 'Low battery': '#f59e0b', 'Not synced': '#94a3b8' };

  return {
    color: data.map((item) => colorMap[item.name] || '#2563eb'),
    tooltip: {
      ...tooltip.value,
      trigger: 'item',
      formatter: (p) => `${p.name}<br/><b>${p.value}</b> devices (${p.percent}%)`,
    },
    legend: { ...legend.value, orient: 'horizontal', bottom: 0 },
    title: {
      text: String(total.value),
      subtext: 'devices',
      left: 'center',
      top: '38%',
      textStyle: { fontSize: 24, fontWeight: 700, color: colors.value.textPrimary, fontFamily },
      subtextStyle: { fontSize: 11, color: colors.value.textMuted, fontFamily },
    },
    series: [
      {
        name: 'Devices',
        type: 'pie',
        radius: ['58%', '78%'],
        center: ['50%', '44%'],
        itemStyle: { borderRadius: 6, borderColor: colors.value.tooltipBg, borderWidth: 2 },
        label: { show: true, formatter: '{b}: {c}', color: colors.value.textSecondary, fontSize: 11, fontFamily },
        labelLine: { length: 8, length2: 8 },
        emphasis: { scale: true, scaleSize: 6 },
        data,
      },
    ],
  };
});

const csvPayload = computed(() => ({
  columns: ['Status', 'Count'],
  rows: (monitoring.deviceStatus.data || []).map((item) => [item.name, item.value]),
}));

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
