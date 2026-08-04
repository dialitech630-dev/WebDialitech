<template>
  <footer class="app-footer">
    <span class="copyright">© 2026 DiaMonitor</span>
    <span class="version">v2.1.0</span>
  </footer>
</template>

<script setup>
</script>

<style scoped>
.app-footer {
  background: #ffffff;
  border-top: 1px solid #e5e7eb;
  padding: 14px 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}

.copyright {
  font-size: 13px;
  color: #6b7280;
}

.version {
  font-size: 12px;
  color: #9ca3af;
  background: #f3f4f6;
  padding: 3px 8px;
  border-radius: 4px;
  font-family: ui-monospace, monospace;
}
</style>