import { computed } from 'vue';
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
    ...store,
    themeOptions,
    languageOptions,
    fontSizeOptions,
    themeLabel,
    fontSizeLabel,
    hasChanges: computed(() => store.hasChanges),
  };
}
