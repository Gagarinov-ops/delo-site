// Кнопки панели, 65 строк
import { LibraryStore } from './library-store.js';
export class LibraryButtons {
  constructor() { this.store = new LibraryStore(); this.selectedItem = null; console.log('[LibraryButtons] initialized'); }
  render(panel) {
    const items = this.store.getItems(); const cats = this.store.getCategories(); let html = '';
    cats.forEach(cat => {
      const catItems = items.filter(i => i.category === cat); if (!catItems.length) return;
      html += `<div style="width:100%;padding:8px 0 4px;font-size:11px;color:var(--text-secondary);text-transform:uppercase;letter-spacing:.5px;border-top:1px solid var(--border-gray);">${this._label(cat)}</div>`;
      html += catItems.map(item => `<button class="library-item btn-tool" data-item-id="${item.id}" aria-label="Выбрать: ${item.name}" style="display:flex;flex-direction:column;align-items:center;min-width:48px;min-height:48px;padding:6px 4px;border:2px solid transparent;border-radius:8px;background:none;cursor:pointer;font-size:10px;color:var(--text-primary);"><span style="font-size:22px;margin-bottom:2px;">${item.icon}</span><span>${item.name}</span></button>`).join('');
    });
    panel.innerHTML = html;
  }
  highlight(panel, itemId) {
    panel.querySelectorAll('.library-item').forEach(b => { b.style.border = '2px solid transparent'; b.style.background = 'none'; });
    const active = panel.querySelector(`[data-item-id="${itemId}"]`); if (active) { active.style.border = '2px solid var(--green-primary)'; active.style.background = 'rgba(0,166,81,.05)'; }
  }
  setSelectedItem(item) { this.selectedItem = item; }
  getSelectedItem() { return this.selectedItem; }
  _label(id) { const m = { 'фигуры':'Фигуры','проёмы':'Проёмы','соединения':'Соединения','освещение':'Освещение' }; return m[id]||id; }
}