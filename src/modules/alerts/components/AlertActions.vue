<template>
  <div class="actions">
    <button class="action-btn" title="View alert details">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 3C4.5 3 1.5 8 1.5 8C1.5 8 4.5 13 8 13C11.5 13 14.5 8 14.5 8C14.5 8 11.5 3 8 3Z" stroke="#6b7280" stroke-width="1.3" />
        <circle cx="8" cy="8" r="2.5" stroke="#6b7280" stroke-width="1.3" />
      </svg>
    </button>
    <button class="action-btn" title="Resolve alert">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6.5" stroke="#6b7280" stroke-width="1.3" />
        <path d="M5.5 8L7.5 10L10.5 6" stroke="#6b7280" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>
    <button class="action-btn danger" title="Dismiss alert">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6.5" stroke="#6b7280" stroke-width="1.3" />
        <path d="M5.5 5.5L10.5 10.5M10.5 5.5L5.5 10.5" stroke="#6b7280" stroke-width="1.3" stroke-linecap="round" />
      </svg>
    </button>
    <button class="action-btn" title="More options">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="3" r="1.5" fill="#9ca3af" />
        <circle cx="8" cy="8" r="1.5" fill="#9ca3af" />
        <circle cx="8" cy="13" r="1.5" fill="#9ca3af" />
      </svg>
    </button>
  </div>
</template>

<style scoped>
.actions {
  display: flex;
  align-items: center;
  gap: 2px;
}

.action-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s;
}

.action-btn:hover {
  background: #f3f4f6;
}

.action-btn:hover svg path,
.action-btn:hover svg circle {
  stroke: #2563eb;
}

.action-btn.danger:hover svg path {
  stroke: #dc2626;
}

.action-btn.danger:hover svg circle[fill] {
  fill: #dc2626;
}
</style>
