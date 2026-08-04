export const timeZones = ['(UTC-5) America/New_York', '(UTC-8) America/Los_Angeles', '(UTC+0) UTC', '(UTC+1) Europe/London', '(UTC+2) Europe/Berlin'];
export const languages = ['English', 'Spanish', 'French', 'German'];
export const dateFormats = ['YYYY-MM-DD', 'DD/MM/YYYY', 'MM/DD/YYYY'];
export const sessionTimeouts = ['15 minutes', '30 minutes', '1 hour', '2 hours', 'Never'];
export const passwordPolicies = ['Weak', 'Medium', 'Strong', 'Very Strong'];
export const themes = ['Light', 'Dark', 'System'];
export const primaryColors = ['Blue', 'Green', 'Purple', 'Orange', 'Red'];
export const fontSizes = ['Small', 'Medium', 'Large'];

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
    role: 'Administrator',
    status: 'Active',
  },
  notifications: {
    email: true,
    sms: false,
    push: true,
    criticalAlerts: true,
    weeklyReports: false,
  },
  security: {
    sessionTimeout: '30 minutes',
    passwordPolicy: 'Strong',
    twoFactorAuth: true,
    autoLogout: false,
  },
  appearance: {
    theme: 'Light',
    language: 'English',
    fontSize: 'Medium',
    compactMode: false,
  },
  system: {
    appVersion: 'v2.1.0',
    apiVersion: 'v3.0.0',
    dbVersion: 'PostgreSQL 15.3',
    environment: 'Production',
    serverStatus: 'Online',
    uptime: '99.98%',
    lastBackup: '2026-07-22 03:00 UTC',
  },
};
