import { reactive, computed } from 'vue';

const messages = {
  en: {
    settings: 'Settings',
    dashboard: 'Dashboard',
    patients: 'Patients',
    alerts: 'Alerts',
    profile: 'Profile',
    account: 'Account',
    notifications: 'Notifications',
    security: 'Security',
    appearance: 'Appearance',
    subscription: 'Subscription / Plan',
    system: 'System Information',
    saveChanges: 'Save Changes',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    create: 'Create',
    search: 'Search',
    noResults: 'No results found',
    loading: 'Loading...',
    error: 'An error occurred',
    retry: 'Retry',
    theme: 'Theme',
    language: 'Language',
    fontSize: 'Font Size',
    compactMode: 'Compact Mode',
    light: 'Light',
    dark: 'Dark',
    system: 'System',
    english: 'English',
    spanish: 'Español',
    small: 'Small',
    medium: 'Medium',
    large: 'Large',
    settingsUpdated: 'Settings updated successfully.',
    preferencesLoaded: 'Preferences loaded.',
  },
  es: {
    settings: 'Configuración',
    dashboard: 'Panel',
    patients: 'Pacientes',
    alerts: 'Alertas',
    profile: 'Perfil',
    account: 'Cuenta',
    notifications: 'Notificaciones',
    security: 'Seguridad',
    appearance: 'Apariencia',
    subscription: 'Suscripción / Plan',
    system: 'Información del Sistema',
    saveChanges: 'Guardar Cambios',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    edit: 'Editar',
    create: 'Crear',
    search: 'Buscar',
    noResults: 'Sin resultados',
    loading: 'Cargando...',
    error: 'Ocurrió un error',
    retry: 'Reintentar',
    theme: 'Tema',
    language: 'Idioma',
    fontSize: 'Tamaño de Fuente',
    compactMode: 'Modo Compacto',
    light: 'Claro',
    dark: 'Oscuro',
    system: 'Sistema',
    english: 'English',
    spanish: 'Español',
    small: 'Pequeño',
    medium: 'Mediano',
    large: 'Grande',
    settingsUpdated: 'Configuración actualizada exitosamente.',
    preferencesLoaded: 'Preferencias cargadas.',
  },
};

const currentLocale = reactive({ value: 'en' });

export function setLocale(locale) {
  if (messages[locale]) {
    currentLocale.value = locale;
  }
}

export function getLocale() {
  return currentLocale.value;
}

export function $t(key) {
  const locale = currentLocale.value;
  return messages[locale]?.[key] || messages.en[key] || key;
}

export const t = computed(() => $t);

export function useI18n() {
  return {
    locale: currentLocale,
    setLocale,
    t: (key) => messages[currentLocale.value]?.[key] || messages.en[key] || key,
  };
}

export { messages };
