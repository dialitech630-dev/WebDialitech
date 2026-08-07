import { PASSWORD_POLICY, FIELD_LIMITS } from '../config/security';

export function isEmail(value) {
  if (typeof value !== 'string') return false;
  const email = value.trim();
  if (!email || email.length > FIELD_LIMITS.EMAIL_MAX) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

export function isPhone(value) {
  if (typeof value !== 'string') return false;
  if (!value.trim()) return true;
  if (value.length > FIELD_LIMITS.PHONE_MAX) return false;
  return /^[+\d][\d\s().\-]{5,19}$/.test(value.trim());
}

export function isStrongPassword(value) {
  if (typeof value !== 'string') return false;
  if (value.length < PASSWORD_POLICY.MIN_LENGTH) return false;
  if (value.length > PASSWORD_POLICY.MAX_LENGTH) return false;
  if (/\s/.test(value)) return false;
  if (PASSWORD_POLICY.REQUIRE_DIGIT && !/\d/.test(value)) return false;
  if (PASSWORD_POLICY.REQUIRE_UPPERCASE && !/[A-Z]/.test(value)) return false;
  if (PASSWORD_POLICY.REQUIRE_LOWERCASE && !/[a-z]/.test(value)) return false;
  if (PASSWORD_POLICY.REQUIRE_SPECIAL && !/[^A-Za-z0-9]/.test(value)) return false;
  return true;
}

export function required(value) {
  return value !== null && value !== undefined && String(value).trim().length > 0;
}

export function minLength(value, min) {
  return typeof value === 'string' && value.trim().length >= min;
}

export function maxLength(value, max) {
  return typeof value !== 'string' || value.length <= max;
}

export function matches(a, b) {
  return String(a || '') === String(b || '');
}

export function sanitizeString(value, max = FIELD_LIMITS.NAME_MAX) {
  if (typeof value !== 'string') return '';
  const collapsed = value.replace(/\s+/g, ' ').trim();
  return collapsed.slice(0, max);
}

export function sanitizeEmail(value) {
  if (typeof value !== 'string') return '';
  return value.trim().toLowerCase().slice(0, FIELD_LIMITS.EMAIL_MAX);
}

export function sanitizePhone(value) {
  if (typeof value !== 'string') return '';
  return value.replace(/\s+/g, ' ').trim().slice(0, FIELD_LIMITS.PHONE_MAX);
}

export function sanitizeText(value, max = 500) {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, max);
}

export function validateLoginForm({ email, password }) {
  const errors = {};
  if (!required(email)) errors.email = 'El correo electrónico es obligatorio.';
  else if (!isEmail(email)) errors.email = 'Ingresa un correo electrónico válido.';

  if (!required(password)) errors.password = 'La contraseña es obligatoria.';
  else if (password.length < PASSWORD_POLICY.MIN_LENGTH) errors.password = `La contraseña debe tener al menos ${PASSWORD_POLICY.MIN_LENGTH} caracteres.`;
  else if (password.length > PASSWORD_POLICY.MAX_LENGTH) errors.password = `La contraseña debe tener como máximo ${PASSWORD_POLICY.MAX_LENGTH} caracteres.`;

  return errors;
}

export function validateRegisterForm(form) {
  const errors = {};

  if (!required(form.name)) errors.name = 'El nombre es obligatorio.';
  else if (!maxLength(form.name, FIELD_LIMITS.NAME_MAX)) errors.name = 'El nombre es demasiado largo.';

  if (!required(form.lastname)) errors.lastname = 'El apellido es obligatorio.';
  else if (!maxLength(form.lastname, FIELD_LIMITS.LASTNAME_MAX)) errors.lastname = 'El apellido es demasiado largo.';

  if (!required(form.email)) errors.email = 'El correo electrónico es obligatorio.';
  else if (!isEmail(form.email)) errors.email = 'Ingresa un correo electrónico válido.';

  if (!required(form.phone)) errors.phone = 'El teléfono es obligatorio.';
  else if (!isPhone(form.phone)) errors.phone = 'Ingresa un teléfono válido.';

  if (!required(form.password)) errors.password = 'La contraseña es obligatoria.';
  else if (!isStrongPassword(form.password)) errors.password = `La contraseña debe tener entre ${PASSWORD_POLICY.MIN_LENGTH} y ${PASSWORD_POLICY.MAX_LENGTH} caracteres sin espacios.`;

  if (!required(form.confirmPassword)) errors.confirmPassword = 'Confirma tu contraseña.';
  else if (!matches(form.password, form.confirmPassword)) errors.confirmPassword = 'Las contraseñas no coinciden.';

  return errors;
}

export function validateProfileForm(form) {
  const errors = {};

  if (!required(form.name)) errors.name = 'El nombre es obligatorio.';
  else if (!maxLength(form.name, FIELD_LIMITS.NAME_MAX)) errors.name = 'El nombre es demasiado largo.';

  if (!required(form.lastname)) errors.lastname = 'El apellido es obligatorio.';
  else if (!maxLength(form.lastname, FIELD_LIMITS.LASTNAME_MAX)) errors.lastname = 'El apellido es demasiado largo.';

  if (form.phone && !isPhone(form.phone)) errors.phone = 'Ingresa un teléfono válido.';

  return errors;
}
