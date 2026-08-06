import { ref, computed, onMounted, onUnmounted } from 'vue';

/**
 * Reactive chart palette that follows the app theme (`data-theme` on <html>).
 * Keeps the ECharts visuals aligned with the project's light/dark design
 * without touching the existing styling system.
 */
export function useChartTheme() {
  const dark = ref(false);
  let observer = null;

  function read() {
    const theme = document.documentElement.getAttribute('data-theme');
    dark.value = theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches);
  }

  onMounted(() => {
    read();
    observer = new MutationObserver(read);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  });

  onUnmounted(() => {
    observer?.disconnect();
  });

  const colors = computed(() => ({
    textPrimary: dark.value ? '#f1f5f9' : '#111827',
    textSecondary: dark.value ? '#94a3b8' : '#6b7280',
    textMuted: dark.value ? '#64748b' : '#9ca3af',
    axisLine: dark.value ? '#334155' : '#e5e7eb',
    splitLine: dark.value ? '#1e293b' : '#f3f4f6',
    tooltipBg: dark.value ? '#1e293b' : '#ffffff',
    tooltipBorder: dark.value ? '#334155' : '#e5e7eb',
    tooltipShadow: dark.value ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.08)',
  }));

  return { dark, colors };
}
