'use strict';

/**
 * EstimatorConnector — подхватывает итоговые площади из store.plan
 * и добавляет в смету две строки: стены и пол.
 * Если план не создан — смета остаётся пустой, без ошибок.
 */

try {
  const EstimatorConnector = {
    _initialized: false,
    _retries: 0,
    _maxRetries: 20,
    _intervalMs: 300,

    init() {
      if (this._initialized) return;

      if (!window.App || !window.App.store) {
        if (++this._retries > this._maxRetries) {
          console.warn('[EstimatorConnector] store не появился');
          return;
        }
        setTimeout(() => this.init(), this._intervalMs);
        return;
      }

      const state = window.App.store.getState();
      const plan = state.plan;
      if (!plan || !plan.rooms || !plan.rooms.length) {
        this._initialized = true;
        return;
      }

      const rooms = plan.rooms;
      let totalWallArea = 0;
      let totalFloorArea = 0;

      rooms.forEach(room => {
        room.walls.forEach(w => {
          totalWallArea += w.area || 0;
        });
        if (room.walls.length >= 2) {
          const lenA = room.walls[0].lengthM || 0;
          const lenB = room.walls[1].lengthM || 0;
          totalFloorArea += lenA * lenB;
        }
      });

      if (totalWallArea > 0) {
        EstimatorActions.addItem({
          name: 'Оштукатуривание стен',
          unit: 'м²',
          quantity: Math.round(totalWallArea * 100) / 100,
          price: 0,
          category: 'Отделка стен'
        });
      }
      if (totalFloorArea > 0) {
        EstimatorActions.addItem({
          name: 'Укладка плитки на пол',
          unit: 'м²',
          quantity: Math.round(totalFloorArea * 100) / 100,
          price: 0,
          category: 'Отделка пола'
        });
      }

      this._initialized = true;
      EstimatorTable.render();
      if (typeof EstimatorSummary !== 'undefined') EstimatorSummary.render();
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => EstimatorConnector.init(), 0);
  });

  window.EstimatorConnector = EstimatorConnector;

} catch (error) {
  console.error('EstimatorConnector init error:', error);
}