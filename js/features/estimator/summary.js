'use strict';

/**
 * EstimatorSummary — блок итоговой суммы сметы
 * Автоматически пересчитывается при вызове render()
 */

try {
  const EstimatorSummary = {
    render() {
      const container = document.getElementById('estimator-summary');
      if (!container) return;

      const items = EstimatorState.items;
      const total = items.reduce((sum, item) => sum + (item.total || 0), 0);

      container.innerHTML = '<div style="font-weight: bold; font-size: 18px; margin-top: 16px;">Итого: ' + total.toFixed(2) + ' руб.</div>';
    }
  };

  window.EstimatorSummary = EstimatorSummary;

} catch (error) {
  console.error('EstimatorSummary init error:', error);
}