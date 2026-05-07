'use strict';

/**
 * CanvasController — обработчик событий на canvas
 * Диспетчеризация по активному инструменту
 */

try {
  const CanvasController = {
    init() {
      if (!Grid.canvas) {
        console.warn('CanvasController: Grid.canvas не готов, повтор через 100ms');
        setTimeout(() => this.init(), 100);
        return;
      }

      Grid.canvas.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        DrawLine.onPointerDown(e);
      });

      Grid.canvas.addEventListener('pointermove', (e) => {
        e.preventDefault();
        DrawLine.onPointerMove(e);
      });

      Grid.canvas.addEventListener('pointerup', (e) => {
        e.preventDefault();
        DrawLine.onPointerUp(e);
      });

      // Не даём скроллить страницу при касании canvas
      Grid.canvas.addEventListener('touchstart', (e) => {
        if (e.target === Grid.canvas) {
          e.preventDefault();
        }
      }, { passive: false });

      Grid.canvas.addEventListener('touchmove', (e) => {
        if (e.target === Grid.canvas) {
          e.preventDefault();
        }
      }, { passive: false });

      // Отрисовываем сохранённые фигуры при загрузке
      if (TetrisState.shapes.length > 0) {
        Grid.draw();
        DrawLine.drawAllShapes();
      }
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    // Ждём инициализации Grid
    const waitForGrid = setInterval(() => {
      if (Grid.canvas) {
        clearInterval(waitForGrid);
        CanvasController.init();
      }
    }, 50);
  });

  window.CanvasController = CanvasController;

} catch (error) {
  console.error('CanvasController init error:', error);
}