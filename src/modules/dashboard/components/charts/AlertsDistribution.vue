<template>
  <div class="chart-wrap">
    <v-chart v-if="show" ref="chartEl" :option="option" autoresize class="chart" @click="handleClick" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { VChart } from '../../echarts';
import { useChartPresets } from '../../optionPresets';
import { useChartExportSink } from '../../exportBridge';
import { useMonitoringData } from '../../../../composables/useMonitoringData';

const emit = defineEmits(['select']);

const monitoring = useMonitoringData();
const { colors, tooltip, legend, fontFamily } = useChartPresets();

const chartEl = ref(null);
const { register, unregister } = useChartExportSink();

const show = computed(() => !monitoring.alertsDistribution.loading && !!monitoring.alertsDistribution.data);

const total = computed(() => (monitoring.alertsDistribution.data || []).reduce((acc, item) => acc + item.value, 0));

const option = computed(() => {
  const data = monitoring.alertsDistribution.data || [];
  const colorMap = { Critical: '#ef4444', High: '#f97316', Medium: '#eab308', Low: '#22c55e' };

  return {
    color: data.map((item) => colorMap[item.name] || '#2563eb'),
    tooltip: {
      ...tooltip.value,
      trigger: 'item',
      formatter: (p) => `${p.name}<br/><b>${p.value}</b> alerts (${p.percent}%)`,
    },
    legend: { ...legend.value, orient: 'horizontal', bottom: 0 },
    title: {
      text: String(total.value),
      subtext: 'alerts',
      left: 'center',
      top: '38%',
      textStyle: { fontSize: 24, fontWeight: 700, color: colors.value.textPrimary, fontFamily },
      subtextStyle: { fontSize: 11, color: colors.value.textMuted, fontFamily },
    },
    grid: { top: 8, bottom: 8 },
    series: [
      {
        name: 'Alerts',
        type: 'pie',
        radius: ['58%', '78%'],
        center: ['50%', '44%'],
        avoidLabelOverlap: true,
        itemStyle: { borderRadius: 6, borderColor: colors.value.tooltipBg, borderWidth: 2 },
        label: { show: true, formatter: '{b}: {c}', color: colors.value.textSecondary, fontSize: 11, fontFamily },
        labelLine: { length: 8, length2: 8 },
        emphasis: { scale: true, scaleSize: 6 },
        data,
      },
    ],
  };
});

function handleClick(params) {
  if (params?.componentType === 'series' && params?.data?.name) {
    emit('select', params.data.name);
  }
}

const csvPayload = computed(() => ({
  columns: ['Severity', 'Count'],
  rows: (monitoring.alertsDistribution.data || []).map((item) => [item.name, item.value]),
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
