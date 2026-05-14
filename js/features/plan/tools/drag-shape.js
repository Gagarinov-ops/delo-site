'use strict';

/**
 * DragShape — модуль перетаскивания фигур и размещения элементов
 * Получает события от input-dispatcher.js при активном инструменте «Курсор»
 * selectShape / startDrag / moveDrag / endDrag / placeElement
 */

try {
  const DragShape = {
    isDragging: false,
    dragShape: null,
    dragShapeId: null,
    dragOffsetX: 0,
    dragOffsetY: 0,
    dragStartCoords: null,

    /**
     * Проверяет попадание точки (x, y) в линию из shapes
     */
    selectShape(x, y) {
      const threshold = 6;
      const shapes = TetrisState.shapes;

      for (let i = shapes.length - 1; i >= 0; i--) {
        const shape = shapes[i];
        if (shape.type !== 'line') continue;

        const dist = CanvasUtils.distToSegment(x, y, shape.x1, shape.y1, shape.x2, shape.y2);
        if (dist <= threshold) {
          return shape;
        }
      }
      return null;
    },

    /**
     * Начать перетаскивание линии
     */
    startDrag(shape, pointerX, pointerY) {
      this.isDragging = true;
      this.dragShape = shape;
      this.dragShapeId = TetrisState.shapes.indexOf(shape);
      this.dragOffsetX = pointerX - shape.x1;
      this.dragOffsetY = pointerY - shape.y1;
      this.dragStartCoords = {
        x1: shape.x1,
        y1: shape.y1,
        x2: shape.x2,
        y2: shape.y2
      };
    },

    /**
     * Сдвинуть линию за указателем с прилипанием
     */
    moveDrag(pointerX, pointerY) {
      if (!this.isDragging || !this.dragShape) return;

      const step = getCellSize('cm');
      const snapped = snap(pointerX, pointerY, step);

      const newX1 = snapped.x - this.dragOffsetX;
      const newY1 = snapped.y - this.dragOffsetY;
      const dx = newX1 - this.dragShape.x1;
      const dy = newY1 - this.dragShape.y1;

      this.dragShape.x1 += dx;
      this.dragShape.y1 += dy;
      this.dragShape.x2 += dx;
      this.dragShape.y2 += dy;

      Grid.draw();
      Render.drawAll();
    },

    /**
     * Завершить перетаскивание, записать в историю
     */
    endDrag() {
      if (!this.isDragging || !this.dragShape) return;

      const newCoords = {
        x1: this.dragShape.x1,
        y1: this.dragShape.y1,
        x2: this.dragShape.x2,
        y2: this.dragShape.y2
      };

      Actions.moveLine(
        this.dragShapeId,
        this.dragStartCoords,
        newCoords
      );

      this.isDragging = false;
      this.dragShape = null;
      this.dragShapeId = null;
      this.dragStartCoords = null;
      Grid.draw();
      Render.drawAll();
      Toolbar.updateUndoButton();
    },

    /**
     * Разместить элемент (door-block / window-block) на ближайшей стене
     * @param {string} elementType - 'door-block' или 'window-block'
     * @param {number} x - координата X на canvas
     * @param {number} y - координата Y на canvas
     * @returns {boolean} успешно ли размещён элемент
     */
    placeElement(elementType, x, y) {
      if (elementType !== 'door-block' && elementType !== 'window-block') return false;

      const threshold = 20;                    // px
      const step = getCellSize('cm');          // 20px
      const rooms = TetrisState.shapes.filter(s => s.type === 'room');
      let bestWall = null, bestDist = Infinity;

      for (const room of rooms) {
        for (const w of room.walls) {
          const d = CanvasUtils.distToSegment(x, y, w.x1, w.y1, w.x2, w.y2);
          if (d < bestDist && d <= threshold) {
            bestDist = d;
            bestWall = w;
          }
        }
      }

      if (bestWall) {
        const midX = (bestWall.x1 + bestWall.x2) / 2;
        const midY = (bestWall.y1 + bestWall.y2) / 2;
        const dx = bestWall.x2 - bestWall.x1;
        const dy = bestWall.y2 - bestWall.y1;
        const len = Math.hypot(dx, dy);
        const angle = Math.atan2(dy, dx);
        const width = elementType === 'door-block' ? 2 * step : 2 * step;   // 2 клетки
        const height = elementType === 'door-block' ? 1 * step : 0.5 * step; // 1 или 0.5 клетки

        let posX = midX, posY = midY;
        if (elementType === 'window-block') {
          // смещаем наружу на 0.5 клетки
          const nx = -dy / len;
          const ny = dx / len;
          posX = midX + nx * 10;
          posY = midY + ny * 10;
        }

        const newObj = {
          type: elementType,
          x: posX,
          y: posY,
          angle,
          width,
          height
        };

        TetrisState.shapes.push(newObj);
        Grid.draw();
        Render.drawAll();
        return true;
      }
      return false;
    }
  };

  window.DragShape = DragShape;

} catch (error) {
  console.error('DragShape init error:', error);
}