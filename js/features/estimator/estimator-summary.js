// Итоговый блок, 50 строк
import { events } from '../../core/events.js';
import { getTotal, isEstimateEmpty } from './estimator-calculations.js';

export class EstimatorSummary {
  constructor(state, validation) { this.state = state; this.validation = validation; this.coefficient = 1.0; console.log('[EstimatorSummary] initialized'); }
  render(container) {
    const items = this.state.getItems(); const total = getTotal(items); const adj = total * this.coefficient; const empty = isEstimateEmpty(items);
    container.innerHTML = `<div style="background:var(--bg-gray);border-radius:var(--radius-md);padding:16px;position:sticky;top:16px;">
      <h3 style="font-size:14px;margin:0 0 12px;font-weight:600;">Итого</h3>
      <p style="font-weight:700;font-size:20px;margin:0 0 4px;">${adj.toLocaleString()} ₽</p>
      ${this.coefficient!==1?`<p style="font-size:11px;color:var(--text-secondary);margin:0 0 8px;">Коэфф: ${this.coefficient}</p>`:''}
      <p style="font-size:11px;color:var(--text-secondary);margin:0 0 16px;">${items.length} позиций</p>
      <button id="calc-btn" class="btn-primary" style="font-size:14px;padding:10px 12px;width:100%;" ${empty?'disabled':''} aria-label="Перейти к документам">К документам</button>
      ${empty?'<p style="color:var(--text-secondary);font-size:10px;margin-top:8px;text-align:center;">Добавьте позиции</p>':''}
    </div>`;
    container.querySelector('#calc-btn')?.addEventListener('click', () => {
      const result = this.validation.canProceed(items);
      if (result.canProceed) events.emit('estimateCalculated', { items, total: adj, coefficient: this.coefficient });
      else events.emit('validationError', result);
    });
  }
  setCoefficient(v) { const c = parseFloat(v); if (!isNaN(c) && c > 0) { this.coefficient = c; events.emit('estimatorSummaryUpdated'); } }
}