export const timeZones = ['(UTC-5) América/Nueva York', '(UTC-8) América/Los Ángeles', '(UTC+0) UTC', '(UTC+1) Europa/Londres', '(UTC+2) Europa/Berlín'];
export const languages = ['Español', 'Inglés', 'Francés', 'Alemán'];
export const dateFormats = ['YYYY-MM-DD', 'DD/MM/YYYY', 'MM/DD/YYYY'];
export const sessionTimeouts = ['15 minutos', '30 minutos', '1 hora', '2 horas', 'Nunca'];
export const passwordPolicies = ['Débil', 'Media', 'Fuerte', 'Muy fuerte'];
export const themes = ['Claro', 'Oscuro', 'Sistema'];
export const primaryColors = ['Azul', 'Verde', 'Púrpura', 'Naranja', 'Rojo'];
export const fontSizes = ['Pequeño', 'Mediano', 'Grande'];

export const settings = {
  profile: {
    name: 'Dr. Andrés Mendoza',
    email: 'andres.mendoza@diahealth.com',
    phone: '+1 (555) 234-5678',
    dob: '1984-06-15',
    address: '123 Medical Center Blvd, Suite 200, New York, NY 10001',
  },
  account: {
    username: 'dr.mendoza',
    email: 'andres.mendoza@diahealth.com',
    role: 'Administrador',
    status: 'Activo',
  },
  notifications: {
    email: true,
    sms: false,
    push: true,
    criticalAlerts: true,
    weeklyReports: false,
  },
  security: {
    sessionTimeout: '30 minutos',
    passwordPolicy: 'Fuerte',
    twoFactorAuth: true,
    autoLogout: false,
  },
  appearance: {
    theme: 'Claro',
    language: 'Español',
    fontSize: 'Mediano',
    compactMode: false,
  },
  system: {
    appVersion: 'v2.1.0',
    apiVersion: 'v3.0.0',
    dbVersion: 'PostgreSQL 15.3',
    environment: 'Producción',
    serverStatus: 'En línea',
    uptime: '99.98%',
    lastBackup: '2026-07-22 03:00 UTC',
  },
};
