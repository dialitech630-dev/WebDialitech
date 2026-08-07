import { computed } from 'vue';
import { useChartPresets } from './optionPresets';

/**
 * Builds a multi-series ECharts option for the vital signs timeline
 * (Heart Rate, SpO₂ and Activity) from an array of readings, keeping the
 * same visual language used across the monitoring module.
 *
 * @param {import('vue').Ref<Array>} readings - readings ({ timestamp, heartRate, oxygen, activity })
 * @param {import('vue').Ref<string>} range - active time range ('today' | '24h' | '7d' | '30d')
 */
export function useVitalsTimeline(readings, range) {
  const { colors, tooltip, grid, legend, valueAxis, fontFamily } = useChartPresets();

  const seriesMeta = [
    { name: 'Frecuencia cardíaca', key: 'heartRate', unit: 'lpm', color: '#ef4444', axis: 0 },
    { name: 'SpO₂', key: 'oxygen', unit: '%', color: '#2563eb', axis: 1 },
    { name: 'Actividad', key: 'activity', unit: '', color: '#f59e0b', axis: 2 },
  ];

  function formatAxisTime(value) {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '';
    const r = range?.value;
    if (r === 'today' || r === '24h') {
      return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    }
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }

  function compactNumber(v) {
    if (Math.abs(v) >= 1000) return `${(v / 1000).toFixed(1)}k`;
    return String(Math.round(v));
  }

  const option = computed(() => {
    const rows = readings.value || [];
    if (!rows.length) return {};

    return {
      color: seriesMeta.map((m) => m.color),
      tooltip: { ...tooltip.value, trigger: 'axis' },
      legend: { ...legend.value, data: seriesMeta.map((m) => m.name), bottom: 0 },
      grid: { ...grid, top: 24, bottom: 28, left: 8, right: 64 },
      xAxis: {
        type: 'time',
        axisLine: { lineStyle: { color: colors.value.axisLine } },
        axisTick: { show: false },
        axisLabel: { color: colors.value.textMuted, fontSize: 11, fontFamily, formatter: formatAxisTime },
      },
      yAxis: [
        {
          ...valueAxis.value,
          name: 'lpm',
          nameTextStyle: { color: colors.value.textMuted },
          position: 'left',
        },
        {
          ...valueAxis.value,
          name: 'SpO₂ %',
          nameTextStyle: { color: colors.value.textMuted },
          position: 'left',
          offset: 52,
          splitLine: { show: false },
        },
        {
          ...valueAxis.value,
          name: 'Actividad',
          nameTextStyle: { color: colors.value.textMuted },
          position: 'right',
          splitLine: { show: false },
          axisLabel: { color: colors.value.textMuted, fontSize: 11, fontFamily, formatter: compactNumber },
        },
      ],
      series: seriesMeta.map((m) => ({
        name: m.name,
        type: 'line',
        data: rows.map((r) => [r.timestamp, r[m.key]]),
        smooth: true,
        symbol: 'circle',
        symbolSize: 4,
        lineStyle: { width: 2 },
        yAxisIndex: m.axis,
        emphasis: { focus: 'series' },
      })),
      textStyle: { fontFamily },
    };
  });

  const csvPayload = computed(() => ({
    columns: ['Marca de tiempo', 'Frecuencia cardíaca (lpm)', 'SpO₂ (%)', 'Actividad'],
    rows: (readings.value || []).map((r) => [r.timestamp, r.heartRate, r.oxygen, r.activity]),
  }));

  return { option, csvPayload, seriesMeta };
}
