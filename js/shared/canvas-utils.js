'use strict';

/**
 * CanvasUtils — общие утилиты для работы с canvas
 * getCanvasCoords(e) — пересчёт координат события в пиксели canvas
 * distToSegment(px, py, x1, y1, x2, y2) — расстояние от точки до отрезка
 */

try {
  const CanvasUtils = {
    getCanvasCoords(e) {
      const canvas = Grid.canvas;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
      };
    },

    distToSegment(px, py, x1, y1, x2, y2) {
      const dx = x2 - x1;
      const dy = y2 - y1;
      const lenSq = dx * dx + dy * dy;

      if (lenSq === 0) {
        return Math.hypot(px - x1, py - y1);
      }

      let t = ((px - x1) * dx + (py - y1) * dy) / lenSq;
      t = Math.max(0, Math.min(1, t));

      const projX = x1 + t * dx;
      const projY = y1 + t * dy;

      return Math.hypot(px - projX, py - projY);
    }
  };

  window.CanvasUtils = CanvasUtils;

} catch (error) {
  console.error('CanvasUtils init error:', error);
}