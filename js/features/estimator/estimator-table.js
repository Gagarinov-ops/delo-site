// Таблица сметы, 60 строк
import { events } from '../../core/events.js';
import { isEstimateEmpty } from './estimator-calculations.js';

export class EstimatorTable {
  constructor(state) { this.state = state; this.onRemove = null; console.log('[EstimatorTable] initialized'); }
  render(container) {
    const items = this.state.getItems();
    if (isEstimateEmpty(items)) { container.innerHTML = '<p style="color:var(--text-secondary);text-align:center;padding:24px;">Нет добавленных работ</p>'; return; }
    container.innerHTML = items.map(item => this._row(item)).join('');
    container.querySelectorAll('.remove-item-btn').forEach(btn => {
      btn.addEventListener('click', e => { const id = e.target.dataset.itemId; if (id && this.onRemove) this.onRemove(id); });
    });
  }
  setOnRemove(cb) { this.onRemove = cb; }
  _row(item) {
    return `<div class="estimator-row" data-item-id="${item.id}" style="display:flex;align-items:center;gap:8px;padding:10px 0;border-bottom:1px solid var(--border-gray);">
      <span style="width:24px;height:24px;border-radius:50%;background:var(--bg-gray);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;color:var(--text-secondary);flex-shrink:0;">${item.rowNumber||''}</span>
      <div style="flex:1;min-width:0;"><div style="font-size:14px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${item.name}</div><div style="font-size:11px;color:var(--text-secondary);margin-top:2px;">${item.quantity} ${item.unit} × ${item.pricePerUnit.toLocaleString()} ₽</div></div>
      <div style="display:flex;align-items:center;gap:8px;flex-shrink:0;"><span style="font-weight:600;font-size:14px;white-space:nowrap;">${item.total.toLocaleString()} ₽</span><button class="remove-item-btn" data-item-id="${item.id}" style="background:none;border:none;color:var(--red-error);cursor:pointer;font-size:16px;padding:4px;" aria-label="Удалить: ${item.name}">✕</button></div>
    </div>`;
  }
}