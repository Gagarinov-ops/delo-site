'use strict';

/**
 * Render — отрисовка фигур на canvas
 * drawAll() перерисовывает все фигуры из TetrisState.shapes
 */

try {
  const Render = {
    drawAll() {
      const ctx = Grid.ctx;
      if (!ctx) return;

      const step = getCellSize('cm');

      // Сначала рисуем комнаты (заливка + стены)
      TetrisState.shapes.forEach(shape => {
        if (shape.type === 'room') {
          RenderRoom.drawRoom(ctx, shape);
        }
      });

      // Затем линии и элементы
      TetrisState.shapes.forEach(shape => {
        ctx.strokeStyle = '#2D2D2D';
        ctx.lineWidth = 2;
        ctx.setLineDash([]);

        switch (shape.type) {
          case 'line':
            ctx.beginPath();
            ctx.moveTo(shape.x1, shape.y1);
            ctx.lineTo(shape.x2, shape.y2);
            ctx.stroke();
            break;

          case 'hline':
            ctx.beginPath();
            ctx.moveTo(shape.x, shape.y);
            ctx.lineTo(shape.x + step * 2, shape.y);
            ctx.stroke();
            break;

          case 'vline':
            ctx.beginPath();
            ctx.moveTo(shape.x, shape.y);
            ctx.lineTo(shape.x, shape.y + step * 2);
            ctx.stroke();
            break;

          case 'corner':
            ctx.beginPath();
            ctx.moveTo(shape.x, shape.y);
            ctx.lineTo(shape.x + step * 2, shape.y);
            ctx.lineTo(shape.x + step * 2, shape.y + step * 2);
            ctx.stroke();
            break;
        }
      });

      // Подписи сторон
      TetrisState.shapes.forEach(shape => {
        if (shape.type === 'room') {
          RenderRoom.drawLabels(ctx, shape);
        }
      });
    }
  };

  window.Render = Render;

} catch (error) {
  console.error('Render init error:', error);
}