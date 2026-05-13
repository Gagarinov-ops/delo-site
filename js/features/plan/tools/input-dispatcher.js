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
      if (WallInput.active) return;
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
          } else {
            this._tryEditWall(coords);
          }
          break;
        default:
          break;
      }
    },

    onMove(e) {
      if (WallInput.active) return;
      const tool = Toolbar.getActiveTool();
      switch (tool) {
        case 'line': DrawLine.onMove(e); break;
        case 'cursor':
          if (DragShape.isDragging) {
            e.preventDefault();
            const coords = CanvasUtils.getCanvasCoords(e);
            DragShape.moveDrag(coords.x, coords.y);
          }
          break;
        default: break;
      }
    },

    onUp(e) {
      if (WallInput.active) return;
      const tool = Toolbar.getActiveTool();
      switch (tool) {
        case 'line': DrawLine.onUp(e); break;
        case 'cursor':
          if (DragShape.isDragging) {
            e.preventDefault();
            DragShape.endDrag();
          }
          break;
        default: break;
      }
    },

    _tryEditWall(coords) {
      const threshold = 6;
      const shapes = TetrisState.shapes;
      for (const shape of shapes) {
        if (shape.type !== 'room') continue;
        for (let i = 0; i < shape.walls.length; i++) {
          const wall = shape.walls[i];
          const d = CanvasUtils.distToSegment(coords.x, coords.y, wall.x1, wall.y1, wall.x2, wall.y2);
          if (d <= threshold) {
            WallInput.show(shape, wall, i);
            return;
          }
        }
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