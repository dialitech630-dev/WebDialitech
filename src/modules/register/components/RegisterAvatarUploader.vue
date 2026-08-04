<template>
  <div class="avatar-uploader">
    <div class="avatar-preview">
      <img v-if="previewUrl" :src="previewUrl" alt="Profile photo" class="avatar-img" />
      <div v-else class="avatar-placeholder">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="9" r="4" stroke="#9ca3af" stroke-width="1.5" />
          <path d="M4 20C4 16.686 7.582 14 12 14C16.418 14 20 16.686 20 20" stroke="#9ca3af" stroke-width="1.5" stroke-linecap="round" />
        </svg>
      </div>
    </div>
    <button class="upload-btn" @click="triggerUpload">
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
        <path d="M8 2V10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        <path d="M4 6L8 2L12 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M2 12V13.5C2 14.328 2.672 15 3.5 15H12.5C13.328 15 14 14.328 14 13.5V12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      </svg>
      Upload Profile Photo
    </button>
    <input ref="fileInput" type="file" accept="image/*" class="file-input" @change="onFileSelected" />
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  imageUrl: { type: String, default: '' },
});

const emit = defineEmits(['update:imageUrl']);

const previewUrl = ref(props.imageUrl);
const fileInput = ref(null);

function triggerUpload() {
  fileInput.value?.click();
}

function onFileSelected(e) {
  const file = e.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    previewUrl.value = ev.target.result;
    emit('update:imageUrl', ev.target.result);
  };
  reader.readAsDataURL(file);
}
</script>

<style scoped>
.avatar-uploader {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-bottom: 28px;
}

.avatar-preview {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  overflow: hidden;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid #e5e7eb;
  flex-shrink: 0;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  color: #9ca3af;
}

.upload-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 0;
  background: none;
  border: none;
  font-size: 13px;
  font-weight: 600;
  color: #2563eb;
  cursor: pointer;
  transition: color 0.15s;
}

.upload-btn:hover {
  color: #1d4ed8;
}

.file-input {
  display: none;
}
</style>
