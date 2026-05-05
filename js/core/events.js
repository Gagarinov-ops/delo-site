// [AP-005] Шина событий, 28 строк
class Events {
  constructor() {
    this._listeners = {};
    console.log('[Events] initialized');
  }
  on(event, callback) {
    if (!this._listeners[event]) this._listeners[event] = [];
    this._listeners[event].push(callback);
    return () => this.off(event, callback);
  }
  off(event, callback) {
    if (!this._listeners[event]) return;
    this._listeners[event] = this._listeners[event].filter(cb => cb !== callback);
  }
  emit(event, data) {
    console.log(`[Event] ${event}`, data);
    if (!this._listeners[event]) return;
    this._listeners[event].forEach(cb => { try { cb(data); } catch (e) { console.error(e); } });
  }
}
export const events = new Events();