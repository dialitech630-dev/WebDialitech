<template>
  <div class="dashboard-layout" :class="{ 'drawer-mode': layout.isDrawerMode.value }">
    <Sidebar />
    <div class="main-area">
      <TopNavbar />
      <div class="content">
        <router-view />
      </div>
      <Footer />
    </div>
    <div
      v-if="layout.isDrawerMode.value && layout.sidebarOpen.value"
      class="sidebar-backdrop"
      @click="layout.closeSidebar()"
    />
  </div>
</template>

<script setup>
import { watch, onMounted, onUnmounted } from 'vue';
import Sidebar from '../components/Sidebar.vue';
import TopNavbar from '../components/TopNavbar.vue';
import Footer from '../components/Footer.vue';
import { useLayout } from '../composables/useLayout';
import { useRoute } from 'vue-router';

const layout = useLayout();
const route = useRoute();

watch(
  () => route.fullPath,
  () => {
    if (layout.isDrawerMode.value) {
      layout.closeSidebar();
    }
  },
);

function onKeydown(e) {
  if (e.key === 'Escape' && layout.isDrawerMode.value) {
    layout.closeSidebar();
  }
}

onMounted(() => document.addEventListener('keydown', onKeydown));
onUnmounted(() => document.removeEventListener('keydown', onKeydown));
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  min-height: 100vh;
  background: #f8f9fa;
}

.main-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  max-width: 100%;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.sidebar-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 55;
  opacity: 1;
  transition: opacity 0.25s ease;
}

@media (min-width: 1024px) {
  .sidebar-backdrop {
    display: none;
  }
}
</style>
