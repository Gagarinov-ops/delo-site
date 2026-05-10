'use strict';

/**
 * Actions — управление фигурами и историей
 * Единственная точка добавления/удаления/перемещения фигур
 * После addLine вызывает проверку замкнутого контура
 */

try {
  const Actions = {
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

      // Проверка замкнутого контура
      const contour = DetectRoom.detect();
      if (contour) {
        RoomBuilder.build(contour);
      }
    },

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

    moveLine(id, from, to) {
      if (id < 0 || id >= TetrisState.shapes.length) return;
      if (from.x1 === to.x1 && from.y1 === to.y1 && from.x2 === to.x2 && from.y2 === to.y2) return;

      TetrisState.history.push({
        type: 'move',
        data: {
          id: id,
          from: { x1: from.x1, y1: from.y1, x2: from.x2, y2: from.y2 },
          to: { x1: to.x1, y1: to.y1, x2: to.x2, y2: to.y2 }
        }
      });

      Toolbar.updateUndoButton();
    },

    undo() {
      if (TetrisState.history.length === 0) return;

      const lastAction = TetrisState.history.pop();

      if (lastAction.type === 'move') {
        const idx = lastAction.data.id;
        if (idx >= 0 && idx < TetrisState.shapes.length) {
          const shape = TetrisState.shapes[idx];
          shape.x1 = lastAction.data.from.x1;
          shape.y1 = lastAction.data.from.y1;
          shape.x2 = lastAction.data.from.x2;
          shape.y2 = lastAction.data.from.y2;
        }
      } else {
        if (lastAction.index >= 0 && lastAction.index < TetrisState.shapes.length) {
          TetrisState.shapes.splice(lastAction.index, 1);

          TetrisState.history.forEach(action => {
            if (action.index > lastAction.index) {
              action.index--;
            }
            if (action.type === 'move' && action.data.id > lastAction.index) {
              action.data.id--;
            }
          });
        }
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