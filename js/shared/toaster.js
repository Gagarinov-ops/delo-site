// Тост-уведомления, 35 строк
import { events } from '../core/events.js';
export class Toaster {
  constructor() { this._createContainer(); console.log('[Toaster] initialized'); }
  _createContainer() { this.container = document.createElement('div'); this.container.id = 'toast-container'; this.container.style.cssText = 'position:fixed;top:16px;left:50%;transform:translateX(-50%);z-index:2000;width:calc(100%-32px);max-width:375px;display:flex;flex-direction:column;gap:8px;'; document.body.appendChild(this.container); }
  show(message, type='info', duration=4000, action=null) {
    const toast = document.createElement('div'); toast.className = 'toast';
    toast.style.cssText = `background:${this._bg(type)};color:${this._fg(type)};border-radius:8px;padding:12px 16px;display:flex;align-items:center;justify-content:space-between;font-size:14px;box-shadow:0 2px 8px rgba(0,0,0,.15);`;
    const span = document.createElement('span'); span.textContent = message; toast.appendChild(span);
    if (action) { const btn = document.createElement('button'); btn.textContent = action.label; btn.style.cssText = 'background:none;border:1px solid currentColor;border-radius:4px;padding:4px 12px;color:inherit;font-size:12px;cursor:pointer;margin-left:12px;'; btn.addEventListener('click', () => { action.cb(); this._remove(toast); }); toast.appendChild(btn); }
    this.container.appendChild(toast); if (duration > 0) setTimeout(() => this._remove(toast), duration);
  }
  showSmetaChanged(cb) { this.show('Смета изменена. Создать Доп. соглашение?', 'warning', 0, { label: 'Создать', cb }); }
  _remove(t) { t.style.animation = 'slideOut .3s ease'; setTimeout(() => { if (t.parentNode) t.parentNode.removeChild(t); }, 300); }
  _bg(t) { return { warning: '#FFF9E6', error: '#FFEBEE', info: '#E3F2FD', success: '#E8F5E9' }[t] || '#E3F2FD'; }
  _fg(t) { return { warning: '#7A6A00', error: '#D32F2F', info: '#1565C0', success: '#2E7D32' }[t] || '#1565C0'; }
}
export const toaster = new Toaster();