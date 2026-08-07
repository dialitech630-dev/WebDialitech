<template>
  <SettingsSection :title="t('settings.appearanceTitle')" :description="t('settings.appearanceDescription')">
    <div class="appearance-list">
      <div class="appearance-row">
        <div class="appearance-info">
          <span class="appearance-label">{{ t('settings.theme') }}</span>
          <span class="appearance-desc">{{ t('settings.themeDesc') }}</span>
        </div>
        <select class="field-select" :value="theme" @change="setTheme($event.target.value)">
          <option v-for="topt in themeOptions" :key="topt" :value="topt">{{ t(`settings.${topt}`) }}</option>
        </select>
      </div>
      <div class="appearance-row">
        <div class="appearance-info">
          <span class="appearance-label">{{ t('settings.language') }}</span>
          <span class="appearance-desc">{{ t('settings.languageDesc') }}</span>
        </div>
        <select class="field-select" :value="language" @change="setLanguage($event.target.value)">
          <option v-for="opt in languageOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
        </select>
      </div>
      <div class="appearance-row">
        <div class="appearance-info">
          <span class="appearance-label">{{ t('settings.fontSize') }}</span>
          <span class="appearance-desc">{{ t('settings.fontSizeDesc') }}</span>
        </div>
        <select class="field-select" :value="fontSize" @change="setFontSize($event.target.value)">
          <option v-for="f in fontSizeOptions" :key="f" :value="f">{{ t(`settings.${f}`) }}</option>
        </select>
      </div>
      <div class="appearance-row">
        <div class="appearance-info">
          <span class="appearance-label">{{ t('settings.compactMode') }}</span>
          <span class="appearance-desc">{{ t('settings.compactModeDesc') }}</span>
        </div>
        <label class="toggle" :class="{ active: compactMode }" @click="setCompactMode(!compactMode)">
          <input type="checkbox" :checked="compactMode" />
          <span class="toggle-slider" />
        </label>
      </div>
    </div>
  </SettingsSection>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { useAppearance } from '../../../composables/useAppearance';
import SettingsSection from './SettingsSection.vue';

const { t } = useI18n();

const {
  theme, setTheme, themeOptions,
  language, setLanguage, languageOptions,
  fontSize, setFontSize, fontSizeOptions,
  compactMode, setCompactMode,
} = useAppearance();
</script>

<style scoped>
.appearance-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.appearance-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #f3f4f6;
}

.appearance-row:last-child {
  border-bottom: none;
}

.appearance-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.appearance-label {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}

.appearance-desc {
  font-size: 12px;
  color: #9ca3af;
}

.field-select {
  padding: 6px 28px 6px 10px;
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
  background-position: right 8px center;
  min-width: 130px;
}

.toggle {
  position: relative;
  width: 44px;
  height: 24px;
  background: #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.2s;
  flex-shrink: 0;
}

.toggle.active {
  background: #2563eb;
}

.toggle input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background: #ffffff;
  border-radius: 50%;
  transition: transform 0.2s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
}

.toggle.active .toggle-slider {
  transform: translateX(20px);
}

/* Responsive */
@media (max-width: 767px) {
  .appearance-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .field-select {
    width: 100%;
    min-width: 0;
  }
}
</style>
