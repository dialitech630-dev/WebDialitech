import { SESSION_CONFIG } from '../config/security';

function getConfiguredTimeout() {
  try {
    const raw = localStorage.getItem(SESSION_CONFIG.OVERRIDE_KEY);
    const ms = raw ? Number(raw) : NaN;
    if (Number.isFinite(ms) && ms > 0) return ms;
  } catch {
    /* sin override */
  }
  return SESSION_CONFIG.INACTIVITY_TIMEOUT_MS;
}

class SessionService {
  constructor() {
    this.timeoutMs = getConfiguredTimeout();
    this.warningMs = SESSION_CONFIG.WARNING_BEFORE_MS;
    this.active = false;
    this.lastActivity = 0;
    this.warningTimer = null;
    this.expiryTimer = null;
    this.handlers = { warning: null, expired: null };
    this.boundReset = this.reset.bind(this);
  }

  start() {
    if (this.active) return;
    this.active = true;
    this.lastActivity = Date.now();

    SESSION_CONFIG.ACTIVITY_EVENTS.forEach((eventName) => {
      window.addEventListener(eventName, this.boundReset, { passive: true });
    });
    document.addEventListener('visibilitychange', this.boundReset);

    this.schedule();
  }

  stop() {
    if (!this.active) return;
    this.active = false;

    SESSION_CONFIG.ACTIVITY_EVENTS.forEach((eventName) => {
      window.removeEventListener(eventName, this.boundReset);
    });
    document.removeEventListener('visibilitychange', this.boundReset);

    clearTimeout(this.warningTimer);
    clearTimeout(this.expiryTimer);
    this.warningTimer = null;
    this.expiryTimer = null;
  }

  reset() {
    if (!this.active) return;
    if (document.visibilityState === 'hidden') return;

    this.lastActivity = Date.now();
    clearTimeout(this.warningTimer);
    clearTimeout(this.expiryTimer);

    this.warningTimer = setTimeout(() => {
      if (this.active) this.handlers.warning?.();
    }, Math.max(this.timeoutMs - this.warningMs, 0));

    this.expiryTimer = setTimeout(() => {
      if (this.active) {
        this.stop();
        this.handlers.expired?.();
      }
    }, this.timeoutMs);
  }

  schedule() {
    this.reset();
  }

  onWarning(cb) {
    this.handlers.warning = cb;
  }

  onExpired(cb) {
    this.handlers.expired = cb;
  }
}

export const sessionService = new SessionService();
export default sessionService;
