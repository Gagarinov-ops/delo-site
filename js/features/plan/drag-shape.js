'use strict';

/**
 * DragShape — модуль перетаскивания фигур
 * Получает события от input-dispatcher.js при активном инструменте «Курсор»
 * selectShape / startDrag / moveDrag / endDrag
 */

try {
  const DragShape = {
    isDragging: false,
    dragShape: null,
    dragShapeId: null,
    dragOffsetX: 0,
    dragOffsetY: 0,
    dragStartCoords: null,

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

    /**
     * Проверяет попадание точки (x, y) в линию из shapes
     */
    selectShape(x, y) {
      const threshold = 6;
      const shapes = TetrisState.shapes;

      for (let i = shapes.length - 1; i >= 0; i--) {
        const shape = shapes[i];
        if (shape.type !== 'line') continue;

        const dist = this._distToSegment(x, y, shape.x1, shape.y1, shape.x2, shape.y2);
        if (dist <= threshold) {
          return shape;
        }
      }
      return null;
    },

    /**
     * Начать перетаскивание
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
     * Расстояние от точки до отрезка
     */
    _distToSegment(px, py, x1, y1, x2, y2) {
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

  window.DragShape = DragShape;

} catch (error) {
  console.error('DragShape init error:', error);
}