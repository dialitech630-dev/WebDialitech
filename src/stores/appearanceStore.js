import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { appearanceService } from '../services/settings/appearance.service';
import { setLocale } from '../i18n';

const DEFAULT_THEME = 'light';
const DEFAULT_LANGUAGE = 'es';
const DEFAULT_FONT_SIZE = 'medium';
const DEFAULT_COMPACT_MODE = false;

export const useAppearanceStore = defineStore('appearance', () => {
  const saved = appearanceService.load();

  const theme = ref(saved?.theme || DEFAULT_THEME);
  const language = ref(saved?.language || DEFAULT_LANGUAGE);
  const fontSize = ref(saved?.fontSize || DEFAULT_FONT_SIZE);
  const compactMode = ref(saved?.compactMode ?? DEFAULT_COMPACT_MODE);

  const initial = {
    theme: theme.value,
    language: language.value,
    fontSize: fontSize.value,
    compactMode: compactMode.value,
  };

  const hasChanges = computed(() =>
    theme.value !== initial.theme ||
    language.value !== initial.language ||
    fontSize.value !== initial.fontSize ||
    compactMode.value !== initial.compactMode
  );

  function applyTheme(val) {
    const root = document.documentElement;
    root.classList.remove('theme-light', 'theme-dark');

    if (val === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.add(prefersDark ? 'theme-dark' : 'theme-light');
      root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    } else {
      root.classList.add(`theme-${val}`);
      root.setAttribute('data-theme', val);
    }
  }

  function applyFontSize(val) {
    const root = document.documentElement;
    root.classList.remove('font-small', 'font-medium', 'font-large');
    root.classList.add(`font-${val}`);
    root.setAttribute('data-font-size', val);
  }

  function applyCompactMode(val) {
    const root = document.documentElement;
    root.classList.toggle('compact-mode', val);
    root.setAttribute('data-compact', val ? 'true' : 'false');
  }

  function applyLanguage(val) {
    setLocale(val);
    document.documentElement.setAttribute('lang', val === 'es' ? 'es' : 'en');
  }

  function applyAll() {
    applyTheme(theme.value);
    applyFontSize(fontSize.value);
    applyCompactMode(compactMode.value);
    applyLanguage(language.value);
  }

  function setTheme(val) { theme.value = val; applyTheme(val); }
  function setLanguage(val) { language.value = val; applyLanguage(val); }
  function setFontSize(val) { fontSize.value = val; applyFontSize(val); }
  function setCompactMode(val) { compactMode.value = val; applyCompactMode(val); }

  function save() {
    const data = {
      theme: theme.value,
      language: language.value,
      fontSize: fontSize.value,
      compactMode: compactMode.value,
    };

    appearanceService.save(data);

    initial.theme = theme.value;
    initial.language = language.value;
    initial.fontSize = fontSize.value;
    initial.compactMode = compactMode.value;

    appearanceService.syncToApi(data).catch(() => {});
  }

  function reset() {
    theme.value = DEFAULT_THEME;
    language.value = DEFAULT_LANGUAGE;
    fontSize.value = DEFAULT_FONT_SIZE;
    compactMode.value = DEFAULT_COMPACT_MODE;
    appearanceService.reset();
    applyAll();
  }

  applyAll();

  return {
    theme, language, fontSize, compactMode,
    hasChanges,
    setTheme, setLanguage, setFontSize, setCompactMode,
    save, reset, applyAll,
  };
});
