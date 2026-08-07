/**
 * Single source of truth for subscription plans.
 *
 * Precios en pesos mexicanos (MXN). Para cargar precios desde el backend más
 * adelante, reemplaza PLANS / PLAN_ORDER con la respuesta de la API
 * manteniendo la misma forma — no se requieren cambios de UI.
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
    monthlyPrice: 199,
    yearlyPrice: 1982,
    monthlyLabel: '/ mes',
    yearlyLabel: '/ año',
    discount: 17,
    billingNote: 'Facturado anualmente',
    description: 'Herramientas esenciales para clínicas pequeñas que inician con la gestión de pacientes de diálisis.',
    featured: false,
    features: [
      'Hasta 20 pacientes',
      'Hasta 5 dispositivos conectados',
      'Perfiles básicos de pacientes',
      'Programación de sesiones',
      'Reportes básicos',
      'Notificaciones por correo',
      'Soporte por correo',
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
    monthlyPrice: 499,
    yearlyPrice: 4970,
    monthlyLabel: '/ mes',
    yearlyLabel: '/ año',
    discount: 17,
    billingNote: 'Facturado anualmente',
    description: 'Solución completa para prácticas en crecimiento con monitoreo avanzado y analíticas.',
    featured: true,
    features: [
      'Hasta 100 pacientes',
      'Hasta 20 dispositivos conectados',
      'Perfiles avanzados de pacientes',
      'Monitoreo de signos vitales en tiempo real',
      'Reportes avanzados',
      'Panel de analíticas',
      'Información con IA',
      'Alertas multicanal',
      'Acceso a la API',
      'Soporte prioritario',
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
    monthlyPrice: 999,
    yearlyPrice: 9950,
    monthlyLabel: '/ mes',
    yearlyLabel: '/ año',
    discount: 17,
    billingNote: 'Facturado anualmente',
    description: 'Plataforma a gran escala para hospitales y redes grandes de diálisis sin límites prácticos.',
    featured: false,
    features: [
      'Pacientes ilimitados',
      'Dispositivos ilimitados',
      'Colaboración multi-cuidador',
      'Campos personalizados de pacientes',
      'Suite de monitoreo avanzado',
      'Sistema de alertas críticas',
      'Reportes personalizados y BI',
      'Exportación de datos',
      'Gerente de soporte dedicado',
      'Opciones de marca blanca',
      'Despliegue on-premise',
      'Garantía SLA',
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
