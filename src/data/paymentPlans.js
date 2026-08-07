/**
 * Catálogo de planes para la pantalla de Pagos (/pagos).
 *
 * Muestra 5 niveles: Free, Básico, Standard, Pro y Enterprise.
 * Cada nivel tiene un `backendPlan` que es el plan real aceptado por el
 * backend (PUT /auth/plan): free/básico/standard → Standard, pro → Pro,
 * enterprise → Premium. Así la pasarela de pago (aún no conectada) puede
 * cobrar un monto distinto por nivel sin tocar la lógica de permisos.
 *
 * `monthlyPrice` y `yearlyPrice` están en pesos mexicanos (MXN).
 */

export const PAYMENT_PLANS = [
  {
    id: 'free',
    name: 'Free',
    backendPlan: 'Standard',
    monthlyPrice: 0,
    yearlyPrice: 0,
    discount: 0,
    description: 'Para empezar a conocer la plataforma sin costo.',
    features: [
      'Hasta 5 pacientes',
      '1 dispositivo conectado',
      'Perfiles básicos de pacientes',
      'Notificaciones por correo',
    ],
    limits: { patients: 5, caregivers: 1, devices: 1, alertsPerDay: 10 },
  },
  {
    id: 'basico',
    name: 'Básico',
    backendPlan: 'Standard',
    monthlyPrice: 99,
    yearlyPrice: 950,
    discount: 20,
    description: 'Para clínicas pequeñas que inician con la gestión de pacientes.',
    features: [
      'Hasta 20 pacientes',
      'Hasta 5 dispositivos conectados',
      'Perfiles básicos de pacientes',
      'Programación de sesiones',
      'Reportes básicos',
      'Soporte por correo',
    ],
    limits: { patients: 20, caregivers: 2, devices: 5, alertsPerDay: 50 },
  },
  {
    id: 'standard',
    name: 'Standard',
    backendPlan: 'Standard',
    monthlyPrice: 199,
    yearlyPrice: 1982,
    discount: 17,
    description: 'Herramientas esenciales para la gestión de pacientes de diálisis.',
    features: [
      'Hasta 20 pacientes',
      'Hasta 5 dispositivos conectados',
      'Perfiles básicos de pacientes',
      'Programación de sesiones',
      'Reportes básicos',
      'Notificaciones por correo',
      'Soporte por correo',
    ],
    limits: { patients: 20, caregivers: 2, devices: 5, alertsPerDay: 50 },
  },
  {
    id: 'pro',
    name: 'Pro',
    backendPlan: 'Pro',
    monthlyPrice: 499,
    yearlyPrice: 4970,
    discount: 17,
    description: 'Solución completa con monitoreo avanzado y analíticas.',
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
    limits: { patients: 100, caregivers: 5, devices: 20, alertsPerDay: -1 },
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    backendPlan: 'Premium',
    monthlyPrice: 999,
    yearlyPrice: 9950,
    discount: 17,
    description: 'Plataforma a gran escala para hospitales y redes de diálisis.',
    features: [
      'Pacientes ilimitados',
      'Dispositivos ilimitados',
      'Colaboración multi-cuidador',
      'Suite de monitoreo avanzado',
      'Sistema de alertas críticas',
      'Reportes personalizados y BI',
      'Exportación de datos',
      'Gerente de soporte dedicado',
      'Garantía SLA',
    ],
    limits: { patients: -1, caregivers: -1, devices: -1, alertsPerDay: -1 },
  },
];
