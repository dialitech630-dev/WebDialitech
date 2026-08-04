import { ref, computed } from 'vue';
import { useViewport } from './useViewport';

const sidebarOpen = ref(false);
const sidebarCollapsed = ref(false);

export function useLayout() {
  const viewport = useViewport();

  const isDrawerMode = computed(() => viewport.width.value < 1024);

  function openSidebar() {
    sidebarOpen.value = true;
  }

  function closeSidebar() {
    sidebarOpen.value = false;
  }

  function toggleSidebar() {
    sidebarOpen.value = !sidebarOpen.value;
  }

  function toggleCollapsed() {
    sidebarCollapsed.value = !sidebarCollapsed.value;
  }

  return {
    viewport,
    isDrawerMode,
    sidebarOpen,
    sidebarCollapsed,
    openSidebar,
    closeSidebar,
    toggleSidebar,
    toggleCollapsed,
  };
}
