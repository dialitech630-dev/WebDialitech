<template>
  <div class="pagination">
    <div class="pagination-info">
      Showing 1 to {{ totalItems }} of {{ totalItems }} patients
    </div>
    <div class="pagination-controls">
      <button class="page-btn nav-btn" disabled>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M9 3L5 7L9 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        Prev
      </button>
      <button class="page-btn active">1</button>
      <button class="page-btn nav-btn">
        Next
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M5 3L9 7L5 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  totalItems: { type: Number, default: 10 },
});
</script>

<style scoped>
.pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-top: 1px solid #f3f4f6;
}

.pagination-info {
  font-size: 13px;
  color: #6b7280;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 4px;
}

.page-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  color: #6b7280;
  background: #ffffff;
  cursor: pointer;
  transition: all 0.15s;
}

.page-btn:hover:not(.active):not(:disabled) {
  background: #f3f4f6;
  border-color: #d1d5db;
}

.page-btn.active {
  background: #2563eb;
  color: #ffffff;
  border-color: #2563eb;
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.nav-btn {
  font-weight: 500;
}

/* Responsive */
@media (max-width: 767px) {
  .pagination {
    flex-direction: column;
    gap: 12px;
    padding: 16px;
  }
}
</style>
