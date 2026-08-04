import { ref, computed, onMounted, onUnmounted } from 'vue';

const BREAKPOINTS = { MOBILE: 768, TABLET: 1024, DESKTOP: 1280, XL: 1536 };

const width = ref(typeof window !== 'undefined' ? window.innerWidth : 1280);
const height = ref(typeof window !== 'undefined' ? window.innerHeight : 800);

function update() {
  width.value = window.innerWidth;
  height.value = window.innerHeight;
}

export function useViewport() {
  onMounted(() => {
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    update();
  });

  onUnmounted(() => {
    window.removeEventListener('resize', update);
    window.removeEventListener('orientationchange', update);
  });

  return {
    width,
    height,
    isMobile: computed(() => width.value < BREAKPOINTS.MOBILE),
    isTablet: computed(() => width.value >= BREAKPOINTS.MOBILE && width.value < BREAKPOINTS.TABLET),
    isDesktop: computed(() => width.value >= BREAKPOINTS.TABLET),
    isXl: computed(() => width.value >= BREAKPOINTS.DESKTOP),
    isXxl: computed(() => width.value >= BREAKPOINTS.XL),
    isTouch: computed(() => typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches),
  };
}
