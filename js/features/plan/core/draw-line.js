'use strict';

/**
 * DrawLine — инструмент рисования линий
 * Превью (зелёный пунктир), снап, фиксация через Actions.addLine()
 * Обработчики вызываются из InputDispatcher
 */

try {
  const DrawLine = {
    isDrawing: false,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,

    onDown(e) {
      e.preventDefault();
      const coords = CanvasUtils.getCanvasCoords(e);
      const step = getCellSize('cm');
      const snapped = snap(coords.x, coords.y, step);

      this.isDrawing = true;
      this.startX = snapped.x;
      this.startY = snapped.y;
      this.currentX = snapped.x;
      this.currentY = snapped.y;
    },

    onMove(e) {
      if (!this.isDrawing) return;
      e.preventDefault();

      const coords = CanvasUtils.getCanvasCoords(e);
      const step = getCellSize('cm');
      const snapped = snap(coords.x, coords.y, step);

      this.currentX = snapped.x;
      this.currentY = snapped.y;
      this.showPreview();
    },

    onUp(e) {
      if (!this.isDrawing) return;
      e.preventDefault();

      const coords = CanvasUtils.getCanvasCoords(e);
      const step = getCellSize('cm');
      const snapped = snap(coords.x, coords.y, step);

      this.currentX = snapped.x;
      this.currentY = snapped.y;

      Actions.addLine(this.startX, this.startY, this.currentX, this.currentY);

      this.isDrawing = false;
      Grid.draw();
      Render.drawAll();
    },

    showPreview() {
      Grid.draw();
      Render.drawAll();

      const ctx = Grid.ctx;
      if (!ctx || !this.isDrawing) return;

      ctx.strokeStyle = '#00A651';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 3]);
      ctx.beginPath();
      ctx.moveTo(this.startX, this.startY);
      ctx.lineTo(this.currentX, this.currentY);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  };

  window.DrawLine = DrawLine;

} catch (error) {
  console.error('DrawLine init error:', error);
}