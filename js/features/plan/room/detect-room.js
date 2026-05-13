'use strict';

/**
 * DetectRoom — поиск замкнутого контура
 * Проверяет TetrisState.shapes[] на наличие замкнутой цепочки линий
 * Возвращает массив линий, образующих комнату, или null
 */

try {
  const DetectRoom = {
    detect() {
      const lines = TetrisState.shapes.filter(s => s.type === 'line');
      if (lines.length < 3) return null;

      const walls = DFSUtils.findAnyCycle(lines);

      if (walls && walls.length >= 3 && DFSUtils.isClosed(walls)) {
        return {
          walls: walls,
          center: DFSUtils.getCenter(walls)
        };
      }

      return null;
    }
  };

  window.DetectRoom = DetectRoom;

} catch (error) {
  console.error('DetectRoom init error:', error);
}