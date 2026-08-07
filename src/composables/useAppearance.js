import { computed, toRef } from 'vue';
import { useAppearanceStore } from '../stores/appearanceStore';

export function useAppearance() {
  const store = useAppearanceStore();

  const themeOptions = ['light', 'dark', 'system'];
  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Español' },
  ];
  const fontSizeOptions = ['small', 'medium', 'large'];

  const themeLabel = computed(() => {
    const labels = { light: 'Light', dark: 'Dark', system: 'System' };
    return labels[store.theme] || store.theme;
  });

  const fontSizeLabel = computed(() => {
    const labels = { small: 'Small', medium: 'Medium', large: 'Large' };
    return labels[store.fontSize] || store.fontSize;
  });

  return {
    theme: toRef(store, 'theme'),
    language: toRef(store, 'language'),
    fontSize: toRef(store, 'fontSize'),
    compactMode: toRef(store, 'compactMode'),
    setTheme: store.setTheme,
    setLanguage: store.setLanguage,
    setFontSize: store.setFontSize,
    setCompactMode: store.setCompactMode,
    themeOptions,
    languageOptions,
    fontSizeOptions,
    themeLabel,
    fontSizeLabel,
    hasChanges: computed(() => store.hasChanges),
  };
}
