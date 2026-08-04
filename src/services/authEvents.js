const listeners = new Map();

export const authEvents = {
  on(event, cb) {
    if (!listeners.has(event)) listeners.set(event, new Set());
    listeners.get(event).add(cb);
    return () => this.off(event, cb);
  },

  off(event, cb) {
    listeners.get(event)?.delete(cb);
  },

  emit(event, payload) {
    listeners.get(event)?.forEach((cb) => cb(payload));
  },
};

export default authEvents;
