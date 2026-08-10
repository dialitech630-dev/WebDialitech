import { PLANS, PLAN_ORDER, ROLES } from '../config/plans';

const FALLBACK_PLAN = 'Standard';

const ALIAS_TO_BACKEND = {
  free: 'Standard',
  basic: 'Standard',
  standard: 'Standard',
  professional: 'Pro',
  pro: 'Pro',
  premium: 'Premium',
  enterprise: 'Premium',
};

export function normalizePlanId(id) {
  if (!id) return FALLBACK_PLAN;
  const key = String(id).toLowerCase();
  return ALIAS_TO_BACKEND[key] || (PLANS[String(id)] ? String(id) : FALLBACK_PLAN);
}

export function getPlanConfig(planId) {
  return PLANS[normalizePlanId(planId)] || PLANS[FALLBACK_PLAN];
}

export function normalizeRole(role) {
  const r = (role || 'caregiver').toLowerCase();
  return ROLES[r] ? r : 'caregiver';
}

export function getRoleConfig(role) {
  return ROLES[normalizeRole(role)] || ROLES.caregiver;
}

function moduleStatus(module) {
  if (typeof module === 'string') return module;
  if (module && typeof module === 'object') return module.status || 'locked';
  return 'locked';
}

/**
 * ¿El plan desbloquea la funcionalidad? (independiente del rol)
 * @param {string} planId
 * @param {string} feature
 * @returns {boolean}
 */
export function hasFeature(planId, feature) {
  const plan = getPlanConfig(planId);
  // Features declaradas únicamente en access.* (p. ej. 'ai') se resuelven
  // desde la matriz de acceso del plan. Esto mantiene consistente
  // hasFeature() con isFeatureUnlocked() sin duplicar la regla.
  if (Object.prototype.hasOwnProperty.call(plan.access, feature)) {
    return plan.access[feature] !== false;
  }
  const module = plan.modules[feature];
  if (!module) return false;
  return moduleStatus(module) !== 'locked';
}

/**
 * ¿El plan permite una feature de acceso (access.*)?
 * @param {string} planId
 * @param {string} feature
 * @returns {boolean}
 */
export function isFeatureUnlocked(planId, feature) {
  const plan = getPlanConfig(planId);
  if (Object.prototype.hasOwnProperty.call(plan.access, feature)) {
    return plan.access[feature] !== false;
  }
  return hasFeature(planId, feature);
}

/**
 * ¿El rol tiene permitido el módulo?
 * @param {string} role
 * @param {string} moduleName
 * @returns {boolean}
 */
export function roleAllows(role, moduleName) {
  const roleConfig = getRoleConfig(role);
  return !roleConfig.restrictedFrom.includes(moduleName);
}

/**
 * Acceso completo: rol Y plan deben permitirlo.
 * @param {string} planId
 * @param {string} role
 * @param {string} moduleName
 * @returns {boolean}
 */
export function canAccess(planId, role, moduleName) {
  return roleAllows(role, moduleName) && hasFeature(planId, moduleName);
}

/**
 * Acción granular (canEdit/canDelete/canView/...) sobre un módulo.
 * Actualmente la matriz de permisos es por módulo; las acciones granulares
 * se resuelven contra el acceso del plan. Nuevos roles/acciones deben
 * agregarse aquí en un único lugar (sin ifs esparcidos).
 *
 * @param {string} planId
 * @param {string} role
 * @param {string} action - 'access' | 'view' | 'edit' | 'delete' | 'create'
 * @param {string} moduleName
 * @returns {boolean}
 */
export function can(planId, role, action, moduleName) {
  if (action === 'access' || action === 'view') {
    return canAccess(planId, role, moduleName);
  }

  if (!canAccess(planId, role, moduleName)) return false;

  if (action === 'delete') {
    return hasFeature(planId, 'administration') || hasFeature(planId, 'settings');
  }

  return canAccess(planId, role, moduleName);
}

export function canEdit(planId, role, moduleName) {
  return can(planId, role, 'edit', moduleName);
}

export function canDelete(planId, role, moduleName) {
  return can(planId, role, 'delete', moduleName);
}

export function canView(planId, role, moduleName) {
  return can(planId, role, 'view', moduleName);
}

export function getUpgradeSuggestion(planId, feature) {
  const currentIndex = PLAN_ORDER.indexOf(normalizePlanId(planId));
  const start = currentIndex >= 0 ? currentIndex + 1 : 0;
  for (let i = start; i < PLAN_ORDER.length; i++) {
    const candidate = PLANS[PLAN_ORDER[i]];
    if (isFeatureUnlocked(candidate.id, feature)) {
      return candidate;
    }
  }
  return PLANS[PLAN_ORDER[PLAN_ORDER.length - 1]];
}

export const permissionService = {
  normalizePlanId,
  getPlanConfig,
  normalizeRole,
  getRoleConfig,
  hasFeature,
  isFeatureUnlocked,
  roleAllows,
  canAccess,
  can,
  canEdit,
  canDelete,
  canView,
  getUpgradeSuggestion,
};

export default permissionService;
