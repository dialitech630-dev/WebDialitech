import { ref, provide, inject } from 'vue';

/**
 * Bridge between ChartCard (which renders the download buttons) and the chart
 * component mounted inside it (which owns the ECharts instance + CSV rows).
 */
export const CHART_EXPORT_KEY = Symbol('chart-export');

export function useChartExportProvider() {
  const current = ref(null);
  provide(CHART_EXPORT_KEY, current);
  return current;
}

export function useChartExportSink() {
  const current = inject(CHART_EXPORT_KEY, null);
  function register(handle) {
    if (current) current.value = handle;
  }
  function unregister(handle) {
    if (current && current.value === handle) current.value = null;
  }
  return { register, unregister };
}
