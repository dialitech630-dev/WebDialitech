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

export function isEmailOrPhone(value) {
  if (!required(value)) return false;
  if (isEmail(value)) return true;
  return isPhone(value);
}

export function sanitizeIdentifier(value) {
  if (typeof value !== 'string') return '';
  const trimmed = value.trim();
  if (!trimmed) return '';
  if (trimmed.includes('@')) return sanitizeEmail(trimmed);
  return sanitizePhone(trimmed);
}

export function sanitizeText(value, max = 500) {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, max);
}

export function validateLoginForm({ email, password }) {
  const errors = {};
  if (!required(email)) errors.email = 'Email is required.';
  else if (!isEmail(email)) errors.email = 'Enter a valid email address.';

  if (!required(password)) errors.password = 'Password is required.';
  else if (password.length < PASSWORD_POLICY.MIN_LENGTH) errors.password = `Password must be at least ${PASSWORD_POLICY.MIN_LENGTH} characters.`;
  else if (password.length > PASSWORD_POLICY.MAX_LENGTH) errors.password = `Password must be at most ${PASSWORD_POLICY.MAX_LENGTH} characters.`;

  return errors;
}

export function validateRegisterForm(form) {
  const errors = {};

  if (!required(form.name)) errors.name = 'First name is required.';
  else if (!maxLength(form.name, FIELD_LIMITS.NAME_MAX)) errors.name = 'First name is too long.';

  if (!required(form.lastname)) errors.lastname = 'Last name is required.';
  else if (!maxLength(form.lastname, FIELD_LIMITS.LASTNAME_MAX)) errors.lastname = 'Last name is too long.';

  if (!required(form.email)) errors.email = 'Email is required.';
  else if (!isEmail(form.email)) errors.email = 'Enter a valid email address.';

  if (!required(form.phone)) errors.phone = 'Phone number is required.';
  else if (!isPhone(form.phone)) errors.phone = 'Enter a valid phone number.';

  if (!required(form.password)) errors.password = 'Password is required.';
  else if (!isStrongPassword(form.password)) errors.password = `Password must be ${PASSWORD_POLICY.MIN_LENGTH}-${PASSWORD_POLICY.MAX_LENGTH} characters without spaces.`;

  if (!required(form.confirmPassword)) errors.confirmPassword = 'Please confirm your password.';
  else if (!matches(form.password, form.confirmPassword)) errors.confirmPassword = 'Passwords do not match.';

  return errors;
}

export function validateProfileForm(form) {
  const errors = {};

  if (!required(form.name)) errors.name = 'First name is required.';
  else if (!maxLength(form.name, FIELD_LIMITS.NAME_MAX)) errors.name = 'First name is too long.';

  if (!required(form.lastname)) errors.lastname = 'Last name is required.';
  else if (!maxLength(form.lastname, FIELD_LIMITS.LASTNAME_MAX)) errors.lastname = 'Last name is too long.';

  if (form.phone && !isPhone(form.phone)) errors.phone = 'Enter a valid phone number.';

  return errors;
}
