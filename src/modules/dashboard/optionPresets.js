import { computed } from 'vue';
import { useChartTheme } from './theme';

/**
 * Shared ECharts option presets so every monitoring chart keeps the same
 * visual language (typography, axis colors, tooltips, legends).
 */
export function useChartPresets() {
  const { colors } = useChartTheme();

  const fontFamily = "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";

  const tooltip = computed(() => ({
    trigger: 'axis',
    backgroundColor: colors.value.tooltipBg,
    borderColor: colors.value.tooltipBorder,
    borderWidth: 1,
    padding: [8, 12],
    textStyle: { color: colors.value.textPrimary, fontSize: 12, fontFamily },
    shadowColor: colors.value.tooltipShadow,
    shadowBlur: 10,
    extraCssText: 'border-radius:8px;box-shadow:0 4px 14px rgba(0,0,0,0.06);',
  }));

  const axis = computed(() => ({
    axisLine: { lineStyle: { color: colors.value.axisLine } },
    axisTick: { show: false },
    axisLabel: { color: colors.value.textMuted, fontSize: 11, fontFamily },
  }));

  const grid = { left: 8, right: 12, top: 16, bottom: 8, containLabel: true };

  const legend = computed(() => ({
    textStyle: { color: colors.value.textSecondary, fontSize: 12, fontFamily },
    icon: 'circle',
    itemWidth: 8,
    itemHeight: 8,
    itemGap: 16,
  }));

  const valueAxis = computed(() => ({
    type: 'value',
    ...axis.value,
    splitLine: { lineStyle: { color: colors.value.splitLine } },
  }));

  const categoryAxis = computed(() => ({
    type: 'category',
    boundaryGap: true,
    ...axis.value,
    axisLine: { lineStyle: { color: colors.value.axisLine } },
  }));

  const insideZoom = computed(() => ({
    type: 'inside',
    zoomOnMouseWheel: true,
    moveOnMouseMove: true,
    moveOnMouseWheel: false,
  }));

  const sliderZoom = computed(() => ({
    type: 'slider',
    height: 16,
    bottom: 0,
    borderColor: colors.value.splitLine,
    backgroundColor: colors.value.tooltipBg,
    fillerColor: 'rgba(37, 99, 235, 0.15)',
    handleStyle: { color: '#2563eb' },
    textStyle: { color: colors.value.textMuted, fontSize: 10 },
  }));

  const palette = ['#2563eb', '#ef4444', '#f59e0b', '#22c55e', '#8b5cf6', '#06b6d4'];

  return { colors, tooltip, axis, grid, legend, valueAxis, categoryAxis, insideZoom, sliderZoom, palette, fontFamily };
}
