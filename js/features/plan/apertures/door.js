'use strict';

const Door = {
  place(roomId, wallIndex, offset) {
    // Найти комнату по индексу
    const room = TetrisState.shapes[roomId];
    if (!room || room.type !== 'room') {
      console.warn('Door.place: комната не найдена по индексу', roomId);
      return;
    }
    if (!room.walls || wallIndex < 0 || wallIndex >= room.walls.length) {
      console.warn('Door.place: неверный индекс стены', wallIndex);
      return;
    }

    const doorDef = ApertureLibrary.doors[0];
    if (!doorDef) {
      console.warn('Door.place: каталог дверей пуст');
      return;
    }

    // Добавляем дверь в массив
    if (!room.doors) room.doors = [];
    room.doors.push({
      type: 'door',
      wall: wallIndex,
      offset: offset,
      width: doorDef.width,
      height: doorDef.height,
      name: doorDef.name
    });

    console.log('Дверь установлена: стена ' + wallIndex + ', offset ' + offset + ' см');

    // Автоматическая перерисовка
    Grid.draw();
    Render.drawAll();
  }
};