// Отрисовка карточек, 35 строк
import { store } from '../../core/store.js';
export class ContractView {
  constructor() { console.log('[ContractView] initialized'); }
  renderSummary(container) {
    const p = store.getState().projects.active.find(p => p.id === store.getState().currentProjectId);
    if (!p) { container.innerHTML = '<p style="color:var(--text-secondary);">Проект не найден</p>'; return; }
    container.innerHTML = `<dl>
      <div style="display:flex;justify-content:space-between;margin-bottom:8px;"><dt>Статус:</dt><dd><span class="card-status-badge">${p.status||'В работе'}</span></dd></div>
      <div style="display:flex;justify-content:space-between;margin-bottom:8px;"><dt>Сумма:</dt><dd><strong>${(p.estimate?.total||0).toLocaleString()} ₽</strong></dd></div>
      <div style="display:flex;justify-content:space-between;"><dt>Окончание:</dt><dd><time datetime="${p.deadline||''}">${p.deadline||'—'}</time></dd></div>
    </dl>`;
  }
}