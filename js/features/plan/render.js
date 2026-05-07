'use strict';

/**
 * Render — отрисовка фигур на canvas
 * addLine() добавляет линию со снапом
 * drawAll() перерисовывает все фигуры из TetrisState.shapes
 */

try {
  const Render = {
    /**
     * Добавить линию с прилипанием к сетке
     */
    addLine(x1, y1, x2, y2) {
      const step = getCellSize('cm');
      const start = snap(x1, y1, step);
      const end = snap(x2, y2, step);

      if (start.x === end.x && start.y === end.y) return;

      TetrisState.shapes.push({
        type: 'line',
        x1: start.x,
        y1: start.y,
        x2: end.x,
        y2: end.y
      });

      Grid.draw();
      this.drawAll();

      if (window.Toolbar && Toolbar.updateUndoButton) {
        Toolbar.updateUndoButton();
      }
    },

    /**
     * Отрисовать все фигуры
     */
    drawAll() {
      const ctx = Grid.ctx;
      if (!ctx) return;

      TetrisState.shapes.forEach(shape => {
        if (shape.type === 'line') {
          ctx.strokeStyle = '#2D2D2D';
          ctx.lineWidth = 2;
          ctx.setLineDash([]);
          ctx.beginPath();
          ctx.moveTo(shape.x1, shape.y1);
          ctx.lineTo(shape.x2, shape.y2);
          ctx.stroke();
        }
      });
    }
  };

  window.Render = Render;

} catch (error) {
  console.error('Render init error:', error);
}