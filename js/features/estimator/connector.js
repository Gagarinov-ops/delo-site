'use strict';

/**
 * EstimatorConnector — подхватывает данные из store.plan
 * и автоматически заполняет смету позициями стен комнат.
 * Если план не создан — смета остаётся пустой, без ошибок.
 */

try {
  const EstimatorConnector = {
    _initialized: false,
    _retries: 0,
    _maxRetries: 20,   // попыток с интервалом ~300мс
    _intervalMs: 300,

    init() {
      if (this._initialized) return;

      // ждём, пока store будет готов (модуль app.js может грузиться позже)
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
        return; // плана нет — просто остаёмся пустыми
      }

      const rooms = plan.rooms;
      rooms.forEach((room, roomIdx) => {
        const roomName = room.label || 'Комната ' + (roomIdx + 1);

        room.walls.forEach(wall => {
          // wall уже содержит lengthM и area из plan.js
          const area = wall.area || 0;
          EstimatorActions.addItem({
            name: `Стена ${wall.name} (${roomName})`,
            unit: 'м²',
            quantity: area,
            price: 0,
            category: roomName
          });
        });
      });

      this._initialized = true;
      EstimatorTable.render(); // на всякий случай принудительно
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