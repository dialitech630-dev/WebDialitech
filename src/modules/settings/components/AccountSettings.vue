<template>
  <SettingsSection title="Account" description="View your account information and status">
    <div v-if="loading" class="skeleton-grid">
      <div v-for="n in 4" :key="n" class="skeleton-row">
        <div class="skeleton skeleton-label"></div>
        <div class="skeleton skeleton-value"></div>
      </div>
    </div>
    <div v-else-if="error" class="error-banner">
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="8" stroke="#ef4444" stroke-width="1.5"/>
        <path d="M9 5.5V9.5" stroke="#ef4444" stroke-width="1.5" stroke-linecap="round"/>
        <circle cx="9" cy="12" r="0.75" fill="#ef4444"/>
      </svg>
      <span>{{ error }}</span>
      <button class="retry-btn" @click="fetch">Retry</button>
    </div>
    <div v-else class="account-wrap">
      <div class="account-grid">
        <div class="account-row">
          <span class="account-label">Name</span>
          <span class="account-value">{{ account.name }} {{ account.lastname }}</span>
        </div>
        <div class="account-row">
          <span class="account-label">Email</span>
          <span class="account-value">{{ account.email }}</span>
        </div>
        <div class="account-row">
          <span class="account-label">Phone</span>
          <span class="account-value">{{ account.phone || '—' }}</span>
        </div>
        <div class="account-row">
          <span class="account-label">Role</span>
          <span class="account-value">
            <RoleBadge :role="account.role" />
          </span>
        </div>
        <div class="account-row">
          <span class="account-label">Status</span>
          <span class="account-value">
            <UserStatusBadge :status="account.status" />
          </span>
        </div>
      </div>

      <div class="danger-zone">
        <h4 class="danger-title">Danger Zone</h4>
        <p class="danger-desc">Permanently deletes your account and all associated patients, devices and alerts. This action cannot be undone.</p>
        <button class="danger-btn" :disabled="deleting" @click="showDeleteModal = true">
          {{ deleting ? 'Deleting...' : 'Delete Account' }}
        </button>
      </div>
    </div>

    <DeleteAccountModal
      :visible="showDeleteModal"
      :deleting="deleting"
      :error="deleteError"
      @close="showDeleteModal = false"
      @confirm="confirmDelete"
    />
  </SettingsSection>
</template>

<script setup>
import { ref } from 'vue';
import { useAccount } from '../../../composables/useAccount';
import SettingsSection from './SettingsSection.vue';
import DeleteAccountModal from './DeleteAccountModal.vue';
import RoleBadge from '../../user-management/components/RoleBadge.vue';
import UserStatusBadge from '../../user-management/components/UserStatusBadge.vue';

const { account, loading, error, deleting, deleteError, fetch, deleteAccount } = useAccount();
const showDeleteModal = ref(false);

async function confirmDelete() {
  const { success } = await deleteAccount();
  if (success) showDeleteModal.value = false;
}
</script>

<style scoped>
.account-wrap {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.account-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.account-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  background: #f9fafb;
  border-radius: 10px;
}

.account-label {
  font-size: 13px;
  font-weight: 500;
  color: #6b7280;
  min-width: 100px;
  flex-shrink: 0;
}

.account-value {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}

.danger-zone {
  border: 1px solid #fecaca;
  background: #fef2f2;
  border-radius: 12px;
  padding: 20px;
}

.danger-title {
  font-size: 15px;
  font-weight: 700;
  color: #b91c1c;
  margin: 0 0 6px;
}

.danger-desc {
  font-size: 13px;
  color: #7f1d1d;
  margin: 0 0 16px;
  max-width: 520px;
  line-height: 1.5;
}

.danger-btn {
  padding: 10px 20px;
  background: #dc2626;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}

.danger-btn:hover:not(:disabled) {
  background: #b91c1c;
}

.danger-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.skeleton-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skeleton-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
}

.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 6px;
}

.skeleton-label {
  width: 100px;
  height: 14px;
}

.skeleton-value {
  width: 180px;
  height: 14px;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.error-banner {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: #fef2f2;
  border-radius: 10px;
  color: #dc2626;
  font-size: 14px;
}

.retry-btn {
  margin-left: auto;
  padding: 4px 12px;
  background: #dc2626;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}

.retry-btn:hover {
  background: #b91c1c;
}

/* Responsive */
@media (max-width: 767px) {
  .account-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .account-label {
    min-width: 0;
  }
}
</style>
