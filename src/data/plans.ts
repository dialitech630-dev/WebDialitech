/**
 * Single source of truth for subscription plans.
 *
 * To load prices from the backend later, replace PLANS / PLAN_ORDER with the
 * API response while keeping the same shape — no UI changes are required.
 */

export type BillingCycle = 'monthly' | 'yearly';

export interface PlanLimits {
  patients: number;
  caregivers: number;
  devices: number;
  alertsPerDay: number;
}

export interface PlanAccess {
  reports: string | false;
  analytics: boolean;
  ai: boolean;
  exports: boolean;
  advancedMonitoring: boolean;
  apiAccess: boolean;
  multiCaregiver: boolean;
  administration: boolean;
}

export interface PlanModules {
  dashboard: string | { status: string; max: number };
  patients: string | { status: string; max: number };
  alerts: string | { status: string; max: number };
  reports: string;
  statistics: string;
  settings: string;
  administration: string;
  advancedMonitoring: string;
  apiAccess: string;
}

export interface Plan {
  id: string;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  monthlyLabel: string;
  yearlyLabel: string;
  discount: number;
  billingNote: string;
  description: string;
  featured: boolean;
  features: string[];
  limits: PlanLimits;
  access: PlanAccess;
  modules: PlanModules;
}

export const PLAN_ORDER = ['Standard', 'Pro', 'Premium'];

export const PLANS: Record<string, Plan> = {
  Standard: {
    id: 'Standard',
    name: 'Standard',
    monthlyPrice: 29,
    yearlyPrice: 289,
    monthlyLabel: '/month',
    yearlyLabel: '/year',
    discount: 17,
    billingNote: 'Billed annually',
    description: 'Essential tools for small clinics starting with dialysis patient management.',
    featured: false,
    features: [
      'Up to 20 patients',
      'Up to 5 connected devices',
      'Basic patient profiles',
      'Session scheduling',
      'Basic reports',
      'Email notifications',
      'Email support',
    ],
    limits: {
      patients: 20,
      caregivers: 2,
      devices: 5,
      alertsPerDay: 50,
    },
    access: {
      reports: 'basic',
      analytics: false,
      ai: false,
      exports: false,
      advancedMonitoring: false,
      apiAccess: false,
      multiCaregiver: false,
      administration: false,
    },
    modules: {
      dashboard: 'available',
      patients: { status: 'available', max: 20 },
      alerts: { status: 'available', max: 50 },
      reports: 'basic',
      statistics: 'locked',
      settings: 'available',
      administration: 'locked',
      advancedMonitoring: 'locked',
      apiAccess: 'locked',
    },
  },
  Pro: {
    id: 'Pro',
    name: 'Pro',
    monthlyPrice: 79,
    yearlyPrice: 787,
    monthlyLabel: '/month',
    yearlyLabel: '/year',
    discount: 17,
    billingNote: 'Billed annually',
    description: 'Complete solution for growing practices with advanced monitoring and analytics.',
    featured: true,
    features: [
      'Up to 100 patients',
      'Up to 20 connected devices',
      'Advanced patient profiles',
      'Real-time vital monitoring',
      'Advanced reports',
      'Analytics dashboard',
      'AI-powered insights',
      'Multi-channel alerts',
      'API access',
      'Priority support',
    ],
    limits: {
      patients: 100,
      caregivers: 5,
      devices: 20,
      alertsPerDay: -1,
    },
    access: {
      reports: 'advanced',
      analytics: true,
      ai: true,
      exports: false,
      advancedMonitoring: true,
      apiAccess: true,
      multiCaregiver: false,
      administration: true,
    },
    modules: {
      dashboard: 'available',
      patients: { status: 'available', max: 100 },
      alerts: 'available',
      reports: 'advanced',
      statistics: 'available',
      settings: 'available',
      administration: 'available',
      advancedMonitoring: 'available',
      apiAccess: 'available',
    },
  },
  Premium: {
    id: 'Premium',
    name: 'Premium',
    monthlyPrice: 199,
    yearlyPrice: 1982,
    monthlyLabel: '/month',
    yearlyLabel: '/year',
    discount: 17,
    billingNote: 'Billed annually',
    description: 'Full-scale platform for hospitals and large dialysis networks with no practical limits.',
    featured: false,
    features: [
      'Unlimited patients',
      'Unlimited devices',
      'Multi-caregiver collaboration',
      'Custom patient fields',
      'Advanced monitoring suite',
      'Critical alert system',
      'Custom reports & BI',
      'Data exports',
      'Dedicated support manager',
      'White-label options',
      'On-premise deployment',
      'SLA guarantee',
    ],
    limits: {
      patients: -1,
      caregivers: -1,
      devices: -1,
      alertsPerDay: -1,
    },
    access: {
      reports: 'all',
      analytics: true,
      ai: true,
      exports: true,
      advancedMonitoring: true,
      apiAccess: true,
      multiCaregiver: true,
      administration: true,
    },
    modules: {
      dashboard: 'available',
      patients: { status: 'available', max: -1 },
      alerts: 'available',
      reports: 'available',
      statistics: 'available',
      settings: 'available',
      administration: 'available',
      advancedMonitoring: 'available',
      apiAccess: 'available',
    },
  },
};
