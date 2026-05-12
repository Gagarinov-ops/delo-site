'use strict';

/**
 * EstimatorTable — отрисовка таблицы сметы
 * Использует семантический HTML (<table>, <thead>, <tbody>)
 * В каждой строке — кнопка удаления
 */

try {
  const EstimatorTable = {
    render() {
      const container = document.getElementById('estimator-table');
      if (!container) return;

      const items = EstimatorState.items;

      if (items.length === 0) {
        container.innerHTML = '<p>Смета пуста. Добавьте первую позицию.</p>';
        if (typeof EstimatorSummary !== 'undefined') EstimatorSummary.render();
        return;
      }

      let html = '<table><thead><tr>';
      html += '<th>№</th>';
      html += '<th>Название</th>';
      html += '<th>Ед.</th>';
      html += '<th>Кол-во</th>';
      html += '<th>Цена</th>';
      html += '<th>Сумма</th>';
      html += '<th></th>';
      html += '</tr></thead><tbody>';

      items.forEach((item, index) => {
        html += '<tr>';
        html += `<td>${index + 1}</td>`;
        html += `<td>${item.name}</td>`;
        html += `<td>${item.unit}</td>`;
        html += `<td>${item.quantity}</td>`;
        html += `<td>${item.price}</td>`;
        html += `<td>${item.total}</td>`;
        html += `<td><button type="button" class="btn-delete" onclick="EstimatorActions.removeItem(${item.id})">✕</button></td>`;
        html += '</tr>';
      });

      html += '</tbody></table>';
      container.innerHTML = html;

      if (typeof EstimatorSummary !== 'undefined') EstimatorSummary.render();
    }
  };

  window.EstimatorTable = EstimatorTable;

} catch (error) {
  console.error('EstimatorTable init error:', error);
}