'use strict';

const Window = {
  place(roomId, wallIndex, windowType, offset) {
    const room = TetrisState.shapes[roomId];
    if (!room || room.type !== 'room') {
      console.warn('Window.place: комната не найдена по индексу', roomId);
      return;
    }
    if (!room.walls || wallIndex < 0 || wallIndex >= room.walls.length) {
      console.warn('Window.place: неверный индекс стены', wallIndex);
      return;
    }
    const windowDef = ApertureLibrary.windows[windowType] || ApertureLibrary.windows[0];
    if (!windowDef) {
      console.warn('Window.place: каталог окон пуст');
      return;
    }

    if (!room.windows) room.windows = [];
    room.windows.push({
      type: 'window',
      wall: wallIndex,
      offset: offset,
      width: windowDef.width,
      height: windowDef.height,
      name: windowDef.name
    });

    console.log('Окно установлено: стена ' + wallIndex + ', offset ' + offset + ' см');
    Grid.draw();
    Render.drawAll();
  }
};