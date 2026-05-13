'use strict';

/**
 * InfoBox — инженерное окошко с площадью пола, стен и периметром.
 * Позиционирование — CSS (абсолютное в #canvas-wrapper).
 * JS только обновляет текст в #room-info-box.
 */

try {
  const InfoBox = {
    box: null,
    heightInput: null,
    selectedRoomId: null,

    init() {
      this.box = document.getElementById('room-info-box');
      this.heightInput = document.getElementById('room-height');
      if (this.heightInput) {
        this.heightInput.addEventListener('input', () => this.update());
      }
      this.update();
    },

    selectRoom(roomId) {
      this.selectedRoomId = roomId;
      this.update();
    },

    deselectRoom() {
      this.selectedRoomId = null;
      this.update();
    },

    update() {
      if (!this.box) return;

      const rooms = TetrisState.shapes.filter(s => s.type === 'room');

      const getRoomData = (room) => {
        const walls = room.walls;
        const allHaveLength = walls.every(w => typeof w.realLength === 'number' && w.realLength > 0);
        if (!allHaveLength) {
          return { label: room.label, floorArea: 0, wallArea: 0, perimeter: 0 };
        }
        const lengthsM = walls.map(w => w.realLength);
        const perimeter = lengthsM.reduce((s, l) => s + l, 0);
        let floorArea = 0;
        if (lengthsM.length >= 2) {
          floorArea = lengthsM[0] * lengthsM[1];
        }
        let height = 2.5;
        if (this.heightInput) {
          const val = parseFloat(this.heightInput.value);
          if (!isNaN(val) && val > 0) height = val;
        }
        const wallArea = perimeter * height;
        return { label: room.label, floorArea, wallArea, perimeter };
      };

      let title = 'Общие размеры';
      let floorTotal = 0, wallTotal = 0, perimTotal = 0;

      if (rooms.length === 1) {
        const room = rooms[0];
        const d = getRoomData(room);
        title = room.label || 'Комната';
        floorTotal = d.floorArea;
        wallTotal = d.wallArea;
        perimTotal = d.perimeter;
      } else if (this.selectedRoomId) {
        const room = rooms.find(r => r.contourId === this.selectedRoomId);
        if (room) {
          const d = getRoomData(room);
          title = room.label || 'Комната';
          floorTotal = d.floorArea;
          wallTotal = d.wallArea;
          perimTotal = d.perimeter;
        }
      } else {
        rooms.forEach(room => {
          const d = getRoomData(room);
          floorTotal += d.floorArea;
          wallTotal += d.wallArea;
          perimTotal += d.perimeter;
        });
      }

      this.box.innerHTML =
        title + '<br>' +
        'Площадь пола: ' + floorTotal.toFixed(2) + ' м²<br>' +
        'Площадь стен: ' + wallTotal.toFixed(2) + ' м²<br>' +
        'Периметр: ' + perimTotal.toFixed(2) + ' м';
    }
  };

  document.addEventListener('DOMContentLoaded', () => InfoBox.init());
  window.InfoBox = InfoBox;

} catch (error) {
  console.error('InfoBox init error:', error);
}