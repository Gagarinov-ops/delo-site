'use strict';

/**
 * RoomBuilder — создание комнаты из замкнутого контура
 * Присваивает сторонам имена, заливает цветом, отображает подписи
 * Удаляет линии контура из shapes, добавляет комнату, пишет в history
 * Вызывает RoomLabel.show(contourId) для ввода названия
 * Сохраняет joints в GeometryState для геометрического ядра
 */

try {
  const RoomBuilder = {
    build(contour) {
      if (!contour || !contour.walls || contour.walls.length < 3) return;

      const contourId = this._contourId(contour.walls);

      const alreadyRoom = TetrisState.shapes.some(s => s.type === 'room' && s.contourId === contourId);
      if (alreadyRoom) return;

      const walls = contour.walls.map((wall, i) => ({
        x1: wall.x1, y1: wall.y1,
        x2: wall.x2, y2: wall.y2,
        name: getSideName(i)
      }));

      const room = {
        type: 'room',
        contourId: contourId,
        walls: walls,
        center: contour.center,
        label: ''
      };

      const linesData = contour.walls.map(w => ({
        type: 'line',
        x1: w.x1, y1: w.y1,
        x2: w.x2, y2: w.y2
      }));

      contour.walls.forEach(wall => {
        const idx = TetrisState.shapes.indexOf(wall);
        if (idx !== -1) {
          TetrisState.shapes.splice(idx, 1);
        }
      });

      TetrisState.shapes.push(room);

      TetrisState.history.push({
        type: 'create-room',
        data: {
          lines: linesData,
          room: {
            type: 'room',
            contourId: contourId,
            walls: walls,
            center: contour.center,
            label: ''
          }
        },
        index: TetrisState.shapes.length - 1
      });

      // Сохраняем joints в GeometryState (точки соединения стен)
      if (typeof GeometryState !== 'undefined') {
        GeometryState.joints[contourId] = contour.walls.map(w => ({ x: w.x1, y: w.y1 }));
      }

      Grid.draw();
      Render.drawAll();
      Toolbar.updateUndoButton();

      // Показать поле ввода названия комнаты (используем RoomLabel)
      if (typeof RoomLabel !== 'undefined') {
        RoomLabel.show(contourId);
      }
    },

    _contourId(walls) {
      return walls.map(w => `${w.x1},${w.y1}-${w.x2},${w.y2}`).sort().join('|');
    }
  };

  window.RoomBuilder = RoomBuilder;

} catch (error) {
  console.error('RoomBuilder init error:', error);
}