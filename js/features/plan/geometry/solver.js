'use strict';

/**
 * GeometrySolver — «мозг» геометрии
 * Пересчитывает координаты стены при изменении длины,
 * сдвигает начало соседней стены, сохраняя замкнутость контура.
 */

try {
  const GeometrySolver = {
    /**
     * @param {string} roomId — ключ комнаты в GeometryState.joints
     * @param {number} wallIndex — индекс стены (0..n-1)
     * @param {number} newLength — новая длина в пикселях
     * @returns {Array|null} обновлённый массив точек joints или null при ошибке
     */
    solve(roomId, wallIndex, newLength) {
      const joints = GeometryState.joints[roomId];
      if (!joints || !Array.isArray(joints) || joints.length < 3) {
        console.warn('GeometrySolver.solve: нет joints для roomId', roomId);
        return null;
      }
      if (typeof newLength !== 'number' || newLength <= 0 || isNaN(newLength)) {
        console.warn('GeometrySolver.solve: некорректная длина', newLength);
        return null;
      }

      const n = joints.length;
      const i = wallIndex % n;
      const start = joints[i];
      const end = joints[(i + 1) % n];

      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const oldLen = Math.hypot(dx, dy);
      if (oldLen === 0) {
        console.warn('GeometrySolver.solve: стена нулевой длины');
        return joints;
      }

      // новая конечная точка
      const scale = newLength / oldLen;
      joints[(i + 1) % n] = {
        x: start.x + dx * scale,
        y: start.y + dy * scale
      };

      GeometryState.joints[roomId] = joints;
      return joints;
    }
  };

  window.GeometrySolver = GeometrySolver;

} catch (error) {
  console.error('GeometrySolver init error:', error);
}