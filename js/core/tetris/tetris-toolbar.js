// Панель инструментов, 40 строк
import { events } from '../events.js';
export class TetrisToolbar {
  constructor() {
    this.tools = [
      { id: 'select', icon: '○', label: 'Выбрать' }, { id: 'circle', icon: '○', label: 'Кружок' },
      { id: 'square', icon: '□', label: 'Квадрат' }, { id: 'line', icon: '─', label: 'Линия' },
      { id: 'window', icon: '🪟', label: 'Окно' }, { id: 'door', icon: '🚪', label: 'Дверь' },
    ];
    this.activeTool = 'select'; this._render();
  }
  _render() {
    const panel = document.querySelector('.tools-panel'); if (!panel) return;
    panel.innerHTML = this.tools.map(t => `<button class="tool-icon btn-tool" data-tool="${t.id}" aria-label="${t.label}" style="min-width:48px;min-height:48px;padding:8px;border:2px solid ${t.id===this.activeTool?'var(--green-primary)':'transparent'};border-radius:8px;background:none;cursor:pointer;font-size:20px;">${t.icon}</button>`).join('');
    panel.querySelectorAll('.btn-tool').forEach(b => b.addEventListener('click', () => this.setActiveTool(b.dataset.tool)));
  }
  setActiveTool(id) { this.activeTool = id; document.querySelectorAll('.btn-tool').forEach(b => { b.style.border = b.dataset.tool === id ? '2px solid var(--green-primary)' : '2px solid transparent'; }); events.emit('toolChanged', { tool: id }); }
}