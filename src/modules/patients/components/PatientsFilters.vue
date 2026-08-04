<template>
  <div class="filters">
    <div class="filter-group">
      <label class="filter-label">Status</label>
      <select class="filter-select">
        <option>All Status</option>
        <option>Normal</option>
        <option>Warning</option>
        <option>Critical</option>
      </select>
    </div>
    <div class="filter-group">
      <label class="filter-label">Age</label>
      <select class="filter-select">
        <option>All Ages</option>
        <option>18-30</option>
        <option>31-45</option>
        <option>46-60</option>
        <option>60+</option>
      </select>
    </div>
    <div class="filter-group">
      <label class="filter-label">Doctor</label>
      <select class="filter-select">
        <option>All Doctors</option>
        <option>Dr. Sarah Wilson</option>
        <option>Dr. James Brown</option>
        <option>Dr. Emily Chen</option>
      </select>
    </div>
  </div>
</template>

<style scoped>
.filters {
  display: flex;
  align-items: center;
  gap: 12px;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-label {
  font-size: 13px;
  font-weight: 500;
  color: #6b7280;
  white-space: nowrap;
}

.filter-select {
  padding: 8px 32px 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 13px;
  color: #374151;
  background: #ffffff;
  outline: none;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%236b7280' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  min-width: 130px;
  transition: border-color 0.15s;
}

.filter-select:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}
</style>
