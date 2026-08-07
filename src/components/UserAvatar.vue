<template>
  <span class="user-avatar" :class="sizeClass">
    <img
      v-if="resolvedPhoto && !imageFailed"
      :src="resolvedPhoto"
      :alt="resolvedName || 'Avatar'"
      class="avatar-img"
      @error="onImageError"
    />
    <span v-else class="avatar-placeholder" :class="toneClass">
      <svg v-if="!initialsText" width="60%" height="60%" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="8" r="4.5" stroke="currentColor" stroke-width="1.6" />
        <path d="M4 21C4 17.134 7.582 14 12 14C16.418 14 20 17.134 20 21" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
      </svg>
      <span v-else class="avatar-initials">{{ initialsText }}</span>
    </span>
  </span>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useAuthStore } from '../stores/authStore';

const props = defineProps({
  size: { type: String, default: 'md' },
  photo: { type: String, default: '' },
  name: { type: String, default: '' },
});

const authStore = useAuthStore();
const imageFailed = ref(false);

watch(
  () => props.photo || authStore.photo,
  () => {
    imageFailed.value = false;
  },
);

const resolvedPhoto = computed(() => props.photo || authStore.photo || '');
const resolvedName = computed(() => props.name || authStore.fullName || authStore.userName || '');

const initialsText = computed(() => {
  return resolvedName.value
    .split(' ')
    .map((n) => n[0])
    .filter(Boolean)
    .join('')
    .toUpperCase()
    .slice(0, 2);
});

const sizeClass = computed(() => `size-${props.size}`);
const toneClass = computed(() => {
  const tones = ['tone-1', 'tone-2', 'tone-3', 'tone-4', 'tone-5', 'tone-6'];
  let hash = 0;
  for (let i = 0; i < resolvedName.value.length; i++) {
    hash = (hash * 31 + resolvedName.value.charCodeAt(i)) >>> 0;
  }
  return tones[hash % tones.length];
});

function onImageError() {
  imageFailed.value = true;
}
</script>

<style scoped>
.user-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  position: relative;
  background: #e5e7eb;
}

.size-sm {
  width: 32px;
  height: 32px;
}

.size-md {
  width: 40px;
  height: 40px;
}

.size-lg {
  width: 48px;
  height: 48px;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
}

.avatar-initials {
  font-weight: 700;
  letter-spacing: 0.3px;
  font-size: 1.05em;
}

.tone-1 { background: linear-gradient(135deg, #3b82f6, #2563eb); }
.tone-2 { background: linear-gradient(135deg, #8b5cf6, #6d28d9); }
.tone-3 { background: linear-gradient(135deg, #ec4899, #db2777); }
.tone-4 { background: linear-gradient(135deg, #f59e0b, #d97706); }
.tone-5 { background: linear-gradient(135deg, #10b981, #059669); }
.tone-6 { background: linear-gradient(135deg, #06b6d4, #0891b2); }
</style>
