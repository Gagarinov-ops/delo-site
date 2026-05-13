'use strict';

/**
 * RoomLabel — поле ввода названия комнаты (всегда видимо после создания комнаты)
 * Сохраняет имя по Enter, не скрывается автоматически.
 */

try {
  const RoomLabel = {
    _currentRoomId: null,

    init() {
      const container = document.getElementById('room-label-container');
      if (!container) return;

      const input = document.createElement('input');
      input.type = 'text';
      input.id = 'room-label-input';
      input.className = 'input-field';
      input.placeholder = 'Название комнаты';
      input.style.width = '200px';
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.save();
        }
      });
      container.appendChild(input);
    },

    show(roomId) {
      this._currentRoomId = roomId;
      const input = document.getElementById('room-label-input');
      if (!input) return;

      const room = TetrisState.shapes.find(s => s.type === 'room' && s.contourId === roomId);
      input.value = (room && room.label) || '';
      const container = document.getElementById('room-label-container');
      if (container) container.style.display = 'block';
      input.focus();
    },

    save() {
      const input = document.getElementById('room-label-input');
      if (!input || !this._currentRoomId) return;

      const name = input.value.trim() || 'Новая комната';

      const room = TetrisState.shapes.find(s => s.type === 'room' && s.contourId === this._currentRoomId);
      if (room) {
        room.label = name;
      }

      if (window.App && window.App.store) {
        const state = window.App.store.getState();
        if (state.plan && state.plan.rooms) {
          const planRoom = state.plan.rooms.find(r => r.contourId === this._currentRoomId);
          if (planRoom) planRoom.label = name;
          window.App.store.dispatch('SET_PLAN', state.plan);
        }
      }

      Grid.draw();
      Render.drawAll();

      if (typeof InfoBox !== 'undefined') InfoBox.update();
    }
  };

  document.addEventListener('DOMContentLoaded', () => RoomLabel.init());
  window.RoomLabel = RoomLabel;

} catch (error) {
  console.error('RoomLabel init error:', error);
}