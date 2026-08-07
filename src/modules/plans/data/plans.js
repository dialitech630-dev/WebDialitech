import { PLANS, PLAN_ORDER } from '../../../data/plans';

export const plans = PLAN_ORDER.map((id) => PLANS[id]);

export const faqs = [
  {
    question: '¿Qué es DiaMonitor y cómo funciona?',
    answer: 'DiaMonitor es una plataforma integral para gestionar y monitorear pacientes de hemodiálisis. Proporciona seguimiento de signos vitales en tiempo real, programación de sesiones, gestión de alertas y analíticas detalladas, todo desde un solo panel accesible en cualquier dispositivo.',
  },
  {
    question: '¿Mis datos de pacientes están seguros?',
    answer: 'Sí. DiaMonitor es compatible con HIPAA y utiliza cifrado de extremo a extremo para todos los datos de los pacientes. Seguimos las mejores prácticas de seguridad, incluyendo auditorías periódicas, control de acceso basado en roles y centros de datos seguros con alta disponibilidad.',
  },
  {
    question: '¿Puedo probar DiaMonitor antes de comprar?',
    answer: 'Sí. Puedes crear una cuenta gratuita y comenzar con el plan Standard. Puedes actualizar a Pro o Premium en cualquier momento desde la configuración de tu suscripción.',
  },
  {
    question: '¿Qué tipo de soporte ofrecen?',
    answer: 'Todos los planes incluyen soporte por correo electrónico. Los planes Pro y Premium incluyen soporte prioritario con tiempos de respuesta más rápidos, y los clientes Premium también reciben un administrador de soporte dedicado.',
  },
  {
    question: '¿Puedo actualizar o degradar mi plan?',
    answer: 'Sí, puedes cambiar tu plan en cualquier momento desde la configuración de tu suscripción. Tus datos siempre se conservan.',
  },
  {
    question: '¿Ofrecen descuentos por facturación anual?',
    answer: 'Contacta a nuestro equipo de ventas para obtener más información sobre precios empresariales personalizados y opciones de facturación anual.',
  },
];
