// Построитель актов, 35 строк
import { store } from '../../core/store.js';
export class ActBuilder {
  constructor() { console.log('[ActBuilder] initialized'); }
  buildCompletionTable(items) { return items.map((item, i) => `<tr><td>${i+1}</td><td>${item.name}</td><td>${item.unit}</td><td>${item.quantity}</td><td>${item.quantity}</td><td>—</td></tr>`).join(''); }
  buildHiddenTable(items) { return items.map((item, i) => `<tr><td>${i+1}</td><td>${item.name}</td><td>${item.unit}</td><td>${item.quantity}</td><td>${item.quantity}</td><td>${item.note||'—'}</td></tr>`).join(''); }
  _initials(name) { if (!name) return ''; const p = name.trim().split(' '); return p[0] + (p[1] ? ` ${p[1][0]}.` : ''); }
}