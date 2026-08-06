/**
 * Plan catalog lives in src/data/plans.ts (single source of truth).
 * This file re-exports it so services and legacy consumers keep working.
 */
export { PLANS, PLAN_ORDER } from '../data/plans';

export const ROLES = {
  patient: {
    label: 'Patient',
    modules: ['dashboard', 'patients', 'alerts'],
    restrictedFrom: ['settings', 'administration', 'users'],
  },
  caregiver: {
    label: 'Caregiver',
    modules: ['dashboard', 'patients', 'alerts', 'reports', 'settings', 'administration', 'users'],
    restrictedFrom: [],
  },
  admin: {
    label: 'Administrator',
    modules: ['dashboard', 'patients', 'alerts', 'reports', 'statistics', 'settings', 'administration', 'users'],
    restrictedFrom: [],
  },
};

export const MODULE_LABELS = {
  dashboard: 'Dashboard',
  patients: 'Patients',
  alerts: 'Alerts',
  reports: 'Reports',
  statistics: 'Statistics',
  settings: 'Settings',
  administration: 'User Management',
  advancedMonitoring: 'Advanced Monitoring',
  apiAccess: 'API Access',
};
