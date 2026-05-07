'use strict';

/**
 * Actions — управление фигурами и историей
 * Единственная точка добавления/удаления фигур
 */

try {
  const Actions = {
    /**
     * Добавить линию в shapes и записать в history
     */
    addLine(x1, y1, x2, y2) {
      const step = getCellSize('cm');
      const start = snap(x1, y1, step);
      const end = snap(x2, y2, step);

      if (start.x === end.x && start.y === end.y) return;

      const shape = {
        type: 'line',
        x1: start.x,
        y1: start.y,
        x2: end.x,
        y2: end.y
      };

      TetrisState.shapes.push(shape);

      TetrisState.history.push({
        type: 'line',
        data: { x1: start.x, y1: start.y, x2: end.x, y2: end.y },
        index: TetrisState.shapes.length - 1
      });

      Grid.draw();
      Render.drawAll();
      Toolbar.updateUndoButton();
    },

    /**
     * Добавить готовый элемент в shapes и записать в history
     */
    addElement(elementType, x, y) {
      const step = getCellSize('cm');
      const snapped = snap(x, y, step);

      const shape = {
        type: elementType,
        x: snapped.x,
        y: snapped.y
      };

      TetrisState.shapes.push(shape);

      TetrisState.history.push({
        type: elementType,
        data: { x: snapped.x, y: snapped.y },
        index: TetrisState.shapes.length - 1
      });

      Grid.draw();
      Render.drawAll();
      Toolbar.updateUndoButton();
    },

    /**
     * Отменить последнее действие
     */
    undo() {
      if (TetrisState.history.length === 0) return;

      const lastAction = TetrisState.history.pop();

      if (lastAction.index >= 0 && lastAction.index < TetrisState.shapes.length) {
        TetrisState.shapes.splice(lastAction.index, 1);

        TetrisState.history.forEach(action => {
          if (action.index > lastAction.index) {
            action.index--;
          }
        });
      }

      Grid.draw();
      Render.drawAll();
      Toolbar.updateUndoButton();
    }
  };

  window.Actions = Actions;

} catch (error) {
  console.error('Actions init error:', error);
}