'use strict';

/**
 * DrawLine — инструмент рисования линии
 * Обработчики pointerdown/pointermove/pointerup
 * Превью (зелёный пунктир), снап, фиксация через Actions.addLine()
 */

try {
  const DrawLine = {
    isDrawing: false,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,

    init() {
      const canvas = Grid.canvas;
      if (!canvas) {
        setTimeout(() => this.init(), 100);
        return;
      }

      canvas.addEventListener('pointerdown', (e) => this.onDown(e));
      canvas.addEventListener('pointermove', (e) => this.onMove(e));
      canvas.addEventListener('pointerup', (e) => this.onUp(e));

      canvas.addEventListener('touchstart', (e) => {
        if (e.target === canvas) e.preventDefault();
      }, { passive: false });

      canvas.addEventListener('touchmove', (e) => {
        if (e.target === canvas) e.preventDefault();
      }, { passive: false });
    },

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

    onDown(e) {
      if (Toolbar.getActiveTool() !== 'line') return;
      e.preventDefault();

      const coords = this.getCanvasCoords(e);
      const step = getCellSize('cm');
      const snapped = snap(coords.x, coords.y, step);

      this.isDrawing = true;
      this.startX = snapped.x;
      this.startY = snapped.y;
      this.currentX = snapped.x;
      this.currentY = snapped.y;
    },

    onMove(e) {
      if (!this.isDrawing || Toolbar.getActiveTool() !== 'line') return;
      e.preventDefault();

      const coords = this.getCanvasCoords(e);
      const step = getCellSize('cm');
      const snapped = snap(coords.x, coords.y, step);

      this.currentX = snapped.x;
      this.currentY = snapped.y;

      this.showPreview();
    },

    onUp(e) {
      if (!this.isDrawing || Toolbar.getActiveTool() !== 'line') return;
      e.preventDefault();

      const coords = this.getCanvasCoords(e);
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

  document.addEventListener('DOMContentLoaded', () => {
    const waitForGrid = setInterval(() => {
      if (Grid.canvas) {
        clearInterval(waitForGrid);
        DrawLine.init();
      }
    }, 50);
  });

  window.DrawLine = DrawLine;

} catch (error) {
  console.error('DrawLine init error:', error);
}