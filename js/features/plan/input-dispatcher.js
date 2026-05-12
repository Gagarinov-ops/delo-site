'use strict';

/**
 * InputDispatcher — единая точка входа для событий canvas
 * Принимает pointerdown/pointermove/pointerup
 * Диспетчеризует события по активному инструменту
 */

try {
  const InputDispatcher = {
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

    onDown(e) {
      const tool = Toolbar.getActiveTool();

      switch (tool) {
        case 'line':
          DrawLine.onDown(e);
          break;
        case 'cursor':
          e.preventDefault();
          const coords = CanvasUtils.getCanvasCoords(e);
          const shape = DragShape.selectShape(coords.x, coords.y);
          if (shape) {
            DragShape.startDrag(shape, coords.x, coords.y);
          }
          break;
        default:
          break;
      }
    },

    onMove(e) {
      const tool = Toolbar.getActiveTool();

      switch (tool) {
        case 'line':
          DrawLine.onMove(e);
          break;
        case 'cursor':
          if (DragShape.isDragging) {
            e.preventDefault();
            const coords = CanvasUtils.getCanvasCoords(e);
            DragShape.moveDrag(coords.x, coords.y);
          }
          break;
        default:
          break;
      }
    },

    onUp(e) {
      const tool = Toolbar.getActiveTool();

      switch (tool) {
        case 'line':
          DrawLine.onUp(e);
          break;
        case 'cursor':
          if (DragShape.isDragging) {
            e.preventDefault();
            DragShape.endDrag();
          }
          break;
        default:
          break;
      }
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    const waitForGrid = setInterval(() => {
      if (Grid.canvas) {
        clearInterval(waitForGrid);
        InputDispatcher.init();
      }
    }, 50);
  });

  window.InputDispatcher = InputDispatcher;

} catch (error) {
  console.error('InputDispatcher init error:', error);
}