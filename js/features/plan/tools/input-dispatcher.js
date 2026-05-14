'use strict';

/**
 * InputDispatcher — единая точка входа для событий canvas
 * Принимает pointerdown/pointermove/pointerup
 * Диспетчеризует события по активному инструменту
 * Добавлена обработка element (дверь, окно) — размещение через Door.place / Window.place
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
        case 'element':
          e.preventDefault();
          this._placeElement(e);
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
    },

    _placeElement(e) {
      const coords = CanvasUtils.getCanvasCoords(e);
      const element = Toolbar.currentElement;
      if (!element) return;

      if (element.type === 'door-block' || element.type === 'window-block') {
        const threshold = 20;
        const rooms = TetrisState.shapes.filter(s => s.type === 'room');
        let bestWall = null, bestRoom = null, bestIndex = -1, bestDist = Infinity, bestOffsetPx = 0;

        for (const room of rooms) {
          for (let i = 0; i < room.walls.length; i++) {
            const w = room.walls[i];
            const d = CanvasUtils.distToSegment(coords.x, coords.y, w.x1, w.y1, w.x2, w.y2);
            if (d < bestDist && d <= threshold) {
              bestDist = d;
              bestWall = w;
              bestRoom = room;
              bestIndex = i;
              // вычисляем проекцию точки на стену для offset
              const dx = w.x2 - w.x1, dy = w.y2 - w.y1;
              const len = Math.hypot(dx, dy);
              if (len > 0) {
                const t = ((coords.x - w.x1) * dx + (coords.y - w.y1) * dy) / (len * len);
                const clampedT = Math.max(0, Math.min(1, t));
                bestOffsetPx = clampedT * len; // пиксели
              }
            }
          }
        }

        if (bestRoom && bestWall) {
          const offsetCm = Math.round(bestOffsetPx / 2); // переводим в см (1 см = 2 px)
          const roomIndex = TetrisState.shapes.indexOf(bestRoom);
          if (element.type === 'door-block') {
            Door.place(roomIndex, bestIndex, offsetCm);
          } else if (element.type === 'window-block') {
            // Window.place принимает windowType = 0 (стандартное окно)
            if (typeof Window !== 'undefined') {
              Window.place(roomIndex, bestIndex, 0, offsetCm);
            } else {
              console.warn('Window.place не найден');
            }
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