window.registerPoint = function(x, y) {
  if (typeof x !== 'number' || typeof y !== 'number') {
    return { success: false, error: 'Координаты должны быть числами' };
  }
  if (Math.abs(x) > CONFIG.MAX_WORLD_LIMIT || Math.abs(y) > CONFIG.MAX_WORLD_LIMIT) {
    return { success: false, error: `Координаты не могут превышать ${CONFIG.MAX_WORLD_LIMIT} мм` };
  }
  CanvasData._pointSeq++;
  const id = 'point_' + CanvasData._pointSeq;
  CanvasData.points[id] = { id, x, y };
  return { success: true, data: { pointId: id } };
};

window.registerWall = function(pointStartId, pointEndId) {
  if (pointStartId === pointEndId) {
    return { success: false, error: 'Точки начала и конца не могут совпадать' };
  }
  const p1 = CanvasData.points[pointStartId];
  const p2 = CanvasData.points[pointEndId];
  if (!p1 || !p2) {
    return { success: false, error: 'Одна из точек не найдена' };
  }
  CanvasData._wallSeq++;
  const id = 'wall_' + CanvasData._wallSeq;
  const wall = {
    id,
    pointStartId: pointStartId,
    pointEndId: pointEndId,
    x1: p1.x, y1: p1.y,
    x2: p2.x, y2: p2.y,
    length: 0,
    marker: null,
    openingIds: []
  };
  CanvasData.walls[id] = wall;
  Calculator.recalculate(id);
  if (wall.length >= 6000 && wall.length <= CONFIG.MAX_WORLD_LIMIT) {
    showToast("Длина стены превышает 6 метров. Чертёж на листе А4 будет мелким, но останется читаемым до 12 метров.", "warning");
  }
  return { success: true, data: { wallId: id } };
};

window.registerRoom = function(pointIds, wallIds, height = 2500) {
  if (!pointIds || pointIds.length === 0) return { success: false, error: "Список точек пуст" };
  if (!wallIds || wallIds.length < pointIds.length) return { success: false, error: "Количество стен должно быть не меньше количества точек" };
  const validation = GeometryValidator.validateRoom(pointIds, wallIds);
  if (validation.status !== "ok") return { success: false, error: "Контур не прошёл валидацию" };
  CanvasData._roomSeq++;
  const roomId = "room_" + CanvasData._roomSeq;
  const anchorPointId = pointIds[0];
  const room = {
    id: roomId, name: "Объект " + CanvasData._roomSeq, isGrouped: false,
    pointIds: [...pointIds], wallIds: [...wallIds], anchorPointId, height, perimeter: 0, floorArea: 0, wallArea: 0
  };
  CanvasData.rooms[roomId] = room;
  Calculator.recalculateRoom(roomId);
  const markers = ["А","Б","В","Г","Д","Е","Ж","З","И","К"];
  room.wallIds.forEach((wid, idx) => { if (markers[idx]) CanvasData.walls[wid].marker = markers[idx]; });
  return { success: true, data: { roomId } };
};

window.registerOpening = function(wallId, roomId, type, width, height, position) {
  const validation = GeometryValidator.validateOpening(wallId, roomId, type, width, height, position);
  if (validation.status !== "ok") return { success: false, error: validation.message };
  CanvasData._openingSeq++;
  const openingId = "opening_" + CanvasData._openingSeq;
  const wall = CanvasData.walls[wallId];
  const areaM2 = Math.round((width * height / 1_000_000) * 100) / 100;
  const opening = { id: openingId, type, width, height, area: areaM2, wallId, position, offsetFromLeft: position - width/2, offsetFromRight: wall.length - (position + width/2) };
  CanvasData.openings[openingId] = opening;
  if (!wall.openingIds) wall.openingIds = [];
  wall.openingIds.push(openingId);
  Calculator.recalculateRoom(roomId);
  return { success: true, data: { openingId } };
};

window.groupRoom = function(roomId) {
  if (!CanvasData.rooms[roomId]) return { success: false };
  CanvasData.rooms[roomId].isGrouped = true;
  return { success: true };
};

window.ungroupRoom = function(roomId) {
  if (!CanvasData.rooms[roomId]) return { success: false };
  CanvasData.rooms[roomId].isGrouped = false;
  return { success: true };
};

window.renameRoom = function(roomId, newName) {
  if (!CanvasData.rooms[roomId]) return { success: false };
  CanvasData.rooms[roomId].name = newName;
  return { success: true };
};