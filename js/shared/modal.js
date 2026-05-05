// Управление модальными окнами, 30 строк
import { events } from '../core/events.js';
export class Modal {
  constructor() { this.activeModal = null; this._bind(); console.log('[Modal] initialized'); }
  open(id) { const m = document.getElementById(id); if (!m) return; this.close(); m.style.display = 'flex'; m.setAttribute('aria-hidden','false'); m.hidden = false; this.activeModal = m; this._trapFocus(m); events.emit('modalOpened', { modalId: id }); }
  close() { if (!this.activeModal) return; this.activeModal.style.display = 'none'; this.activeModal.setAttribute('aria-hidden','true'); this.activeModal.hidden = true; this.activeModal = null; events.emit('modalClosed', {}); }
  _bind() { document.addEventListener('keydown', e => { if (e.key === 'Escape') this.close(); }); document.addEventListener('click', e => { if (e.target.classList.contains('modal-overlay')) this.close(); }); }
  _trapFocus(m) { const f = m.querySelectorAll('button,[href],input,select,textarea,[tabindex]'); if (!f.length) return; f[0].focus(); m.addEventListener('keydown', e => { if (e.key==='Tab') { if (e.shiftKey && document.activeElement===f[0]) { e.preventDefault(); f[f.length-1].focus(); } else if (!e.shiftKey && document.activeElement===f[f.length-1]) { e.preventDefault(); f[0].focus(); } } }); }
}
export const modal = new Modal();