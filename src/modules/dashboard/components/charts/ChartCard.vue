<template>
  <section ref="cardEl" class="chart-card" :style="{ minHeight: `${height}px` }">
    <header class="chart-card__header">
      <div class="chart-card__heading">
        <h3 class="chart-card__title">{{ title }}</h3>
        <p v-if="subtitle" class="chart-card__subtitle">{{ subtitle }}</p>
      </div>

      <div class="chart-card__actions">
        <slot name="actions" />

        <button
          class="chart-btn"
          type="button"
          title="Descargar gráfica como imagen PNG"
          :disabled="!exportHandle || !exportHandle.getInstance"
          @click="onDownloadImage"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <rect x="1.5" y="2.5" width="13" height="11" rx="2" stroke="currentColor" stroke-width="1.4" />
            <circle cx="5.5" cy="6" r="1.4" fill="currentColor" />
            <path d="M3 12.5L6.5 9l2.5 2.5L11 9.5l2 2.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <span>PNG</span>
        </button>

        <button
          class="chart-btn"
          type="button"
          title="Descargar datos de la gráfica como CSV"
          :disabled="!exportHandle || !exportHandle.getCsv"
          @click="onDownloadCsv"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M8 1.5V11M8 11L4.5 7.5M8 11l3.5-3.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M2 12.5h12v2H2z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round" />
          </svg>
          <span>CSV</span>
        </button>
      </div>
    </header>

    <div v-if="loading" class="chart-state">
      <div class="chart-skeleton" :style="{ height: `${height - 12}px` }" />
    </div>

    <div v-else-if="error" class="chart-state chart-state--error">
      <p>{{ error }}</p>
      <slot name="error-actions" />
    </div>

    <div v-else class="chart-card__body" :style="{ height: `${height - 12}px` }">
      <div v-if="inView" class="chart-card__mount">
        <slot />
      </div>
      <div v-else class="chart-skeleton" :style="{ height: `${height - 12}px` }" />
    </div>
  </section>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useChartExportProvider } from '../../exportBridge';
import { downloadCsv, downloadChartImage } from '../../utils/download';
import { useChartTheme } from '../../theme';

export default {
  name: 'ChartCard',
  props: {
    title: { type: String, required: true },
    subtitle: { type: String, default: '' },
    height: { type: Number, default: 300 },
    loading: { type: Boolean, default: false },
    error: { type: String, default: '' },
  },
  setup(props) {
    const exportHandle = useChartExportProvider();
    const { colors } = useChartTheme();

    const cardEl = ref(null);
    const inView = ref(false);
    let observer = null;

    onMounted(() => {
      if (!('IntersectionObserver' in window)) {
        inView.value = true;
        return;
      }
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            inView.value = true;
            observer.disconnect();
          }
        },
        { rootMargin: '300px 0px' },
      );
      if (cardEl.value) observer.observe(cardEl.value);
    });

    onBeforeUnmount(() => observer?.disconnect());

    function slug() {
      return props.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    }

    function onDownloadImage() {
      const handle = exportHandle.value;
      if (!handle?.getInstance) return;
      downloadChartImage(handle.getInstance(), slug(), colors.value.tooltipBg);
    }

    function onDownloadCsv() {
      const handle = exportHandle.value;
      if (!handle?.getCsv) return;
      downloadCsv(handle.getCsv(), `${slug()}.csv`);
    }

    return { exportHandle, cardEl, inView, onDownloadImage, onDownloadCsv };
  },
};
</script>

<style scoped>
.chart-card {
  background: #ffffff;
  border: 1px solid #f3f4f6;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
  padding: var(--card-padding-chart);
  overflow: hidden;
}

.chart-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
  flex-wrap: wrap;
}

.chart-card__heading {
  min-width: 0;
}

.chart-card__title {
  font-size: 15px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 2px 0;
}

.chart-card__subtitle {
  font-size: 12px;
  color: #9ca3af;
  margin: 0;
}

.chart-card__actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.chart-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 9px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #ffffff;
  color: #6b7280;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}

.chart-btn:hover:not(:disabled) {
  border-color: #9ca3af;
  color: #111827;
}

.chart-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.chart-card__body {
  position: relative;
  width: 100%;
}

.chart-card__mount {
  width: 100%;
  height: 100%;
}

.chart-state {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  font-size: 14px;
  min-height: 220px;
}

.chart-state--error {
  flex-direction: column;
  gap: 10px;
  color: #dc2626;
}

.chart-state--error p {
  margin: 0;
}

.chart-skeleton {
  width: 100%;
  border-radius: 8px;
  background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 37%, #f3f4f6 63%);
  background-size: 400% 100%;
  animation: chart-shimmer 1.4s ease infinite;
}

@keyframes chart-shimmer {
  0% {
    background-position: 100% 0;
  }
  100% {
    background-position: -100% 0;
  }
}

:global(:root.theme-dark) .chart-card {
  background: #1e293b;
  border-color: #334155;
  box-shadow: none;
}

:global(:root.theme-dark) .chart-card__title {
  color: #f1f5f9;
}

:global(:root.theme-dark) .chart-card__subtitle {
  color: #64748b;
}

:global(:root.theme-dark) .chart-btn {
  background: #1e293b;
  border-color: #334155;
  color: #94a3b8;
}

:global(:root.theme-dark) .chart-btn:hover:not(:disabled) {
  border-color: #64748b;
  color: #f1f5f9;
}

:global(:root.theme-dark) .chart-skeleton {
  background: linear-gradient(90deg, #334155 25%, #475569 37%, #334155 63%);
  background-size: 400% 100%;
}
</style>
