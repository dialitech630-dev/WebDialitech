import { PLANS } from '../../../config/plans';

const order = ['Standard', 'Pro', 'Premium'];

export const plans = order.map((id) => {
  const plan = PLANS[id];
  return {
    id: plan.id,
    name: plan.name,
    price: plan.price,
    period: plan.period,
    description: plan.description,
    featured: plan.featured,
    features: plan.features,
  };
});

export const faqs = [
  {
    question: 'What is DiaMonitor and how does it work?',
    answer: 'DiaMonitor is a comprehensive platform for managing and monitoring hemodialysis patients. It provides real-time vital sign tracking, session scheduling, alert management, and detailed analytics — all from a single dashboard accessible on any device.',
  },
  {
    question: 'Is my patient data secure?',
    answer: 'Yes. DiaMonitor is HIPAA-compliant and uses end-to-end encryption for all patient data. We follow industry best practices for security, including regular audits, role-based access control, and secure data centers with high availability.',
  },
  {
    question: 'Can I try DiaMonitor before purchasing?',
    answer: 'Yes. You can create a free account and start with the Standard plan. You can upgrade to Pro or Premium at any time from your subscription settings.',
  },
  {
    question: 'What kind of support do you offer?',
    answer: 'All plans include email support. Pro and Premium plans include priority support with faster response times, and Premium customers also receive a dedicated support manager.',
  },
  {
    question: 'Can I upgrade or downgrade my plan?',
    answer: 'Yes, you can change your plan at any time from your subscription settings. Your data is always preserved.',
  },
  {
    question: 'Do you offer discounts for annual billing?',
    answer: 'Contact our sales team for more information about customized enterprise pricing and annual billing options.',
  },
];
