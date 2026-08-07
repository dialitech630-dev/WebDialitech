import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { setLocale } from '../i18n';

const STORAGE_KEY = 'appearance_preferences';
const DEFAULT_THEME = 'light';
const DEFAULT_LANGUAGE = 'es';
const DEFAULT_FONT_SIZE = 'medium';
const DEFAULT_COMPACT_MODE = false;

let systemListenerRegistered = false;

function loadPrefs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function persist(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* almacenamiento no disponible */
  }
}

function resolveSystemTheme() {
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

export const useAppearanceStore = defineStore('appearance', () => {
  const saved = loadPrefs();

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

  function ensureSystemListener() {
    if (systemListenerRegistered || typeof window === 'undefined') return;
    systemListenerRegistered = true;
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (theme.value === 'system') {
        applyTheme('system');
      }
    });
  }

  function applyTheme(val) {
    const root = document.documentElement;
    root.classList.remove('theme-light', 'theme-dark');

    const resolved = val === 'system' ? resolveSystemTheme() : val;
    root.classList.add(`theme-${resolved}`);
    root.setAttribute('data-theme', resolved);
  }

  function applyFontSize(val) {
    const root = document.documentElement;
    root.setAttribute('data-font-size', val);
  }

  function applyCompactMode(val) {
    const root = document.documentElement;
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
    ensureSystemListener();
  }

  function snapshot() {
    return {
      theme: theme.value,
      language: language.value,
      fontSize: fontSize.value,
      compactMode: compactMode.value,
    };
  }

  function persistNow() {
    persist(snapshot());
  }

  function setTheme(val) { theme.value = val; applyTheme(val); persistNow(); }
  function setLanguage(val) { language.value = val; applyLanguage(val); persistNow(); }
  function setFontSize(val) { fontSize.value = val; applyFontSize(val); persistNow(); }
  function setCompactMode(val) { compactMode.value = val; applyCompactMode(val); persistNow(); }

  function save() {
    persist(snapshot());
    initial.theme = theme.value;
    initial.language = language.value;
    initial.fontSize = fontSize.value;
    initial.compactMode = compactMode.value;
  }

  function reset() {
    theme.value = DEFAULT_THEME;
    language.value = DEFAULT_LANGUAGE;
    fontSize.value = DEFAULT_FONT_SIZE;
    compactMode.value = DEFAULT_COMPACT_MODE;
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* almacenamiento no disponible */
    }
    applyAll();
    persistNow();
  }

  applyAll();

  return {
    theme, language, fontSize, compactMode,
    hasChanges,
    setTheme, setLanguage, setFontSize, setCompactMode,
    save, reset, applyAll,
  };
});
