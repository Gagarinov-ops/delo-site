'use strict';

/**
 * WallGeometry — «жёсткие углы, резиновая стена»
 * При изменении длины одной стены:
 * - её конечная точка сдвигается
 * - все последующие стены сохраняют длину и направление (прилипают)
 * - последняя стена замыкает контур, изменяя свою длину
 */

try {
  const WallGeometry = {
    apply(room, wall, wallIndex, lengthM) {
      const pxToM = 0.005;
      const newLenPx = lengthM / pxToM;

      const dx = wall.x2 - wall.x1;
      const dy = wall.y2 - wall.y1;
      const oldLen = Math.hypot(dx, dy);
      if (oldLen === 0) return false;

      // Изменяем выбранную стену
      const scale = newLenPx / oldLen;
      wall.x2 = wall.x1 + dx * scale;
      wall.y2 = wall.y1 + dy * scale;
      wall.length = lengthM;

      const walls = room.walls;
      const n = walls.length;
      let prevEndX = wall.x2;
      let prevEndY = wall.y2;

      // Обходим последующие стены, сохраняя их длину и направление
      for (let k = 1; k < n; k++) {
        const idx = (wallIndex + k) % n;
        if (idx === wallIndex) break;

        const cur = walls[idx];
        const curDx = cur.x2 - cur.x1;
        const curDy = cur.y2 - cur.y1;
        const curLenPx = Math.hypot(curDx, curDy);

        // Начало стены прилипает к концу предыдущей
        cur.x1 = prevEndX;
        cur.y1 = prevEndY;

        // Замыкающая стена (последняя перед началом изменённой)
        if (idx === (wallIndex - 1 + n) % n) {
          cur.x2 = walls[wallIndex].x1;
          cur.y2 = walls[wallIndex].y1;
          cur.length = parseFloat((Math.hypot(cur.x2 - cur.x1, cur.y2 - cur.y1) * pxToM).toFixed(3));
        } else {
          // Сохраняем длину и направление
          if (curLenPx > 0) {
            const normX = curDx / curLenPx;
            const normY = curDy / curLenPx;
            cur.x2 = cur.x1 + normX * curLenPx;
            cur.y2 = cur.y1 + normY * curLenPx;
            cur.length = parseFloat((curLenPx * pxToM).toFixed(3));
          }
        }

        prevEndX = cur.x2;
        prevEndY = cur.y2;
      }

      // Пересчитываем центр комнаты
      if (room.center) {
        let sumX = 0, sumY = 0, cnt = 0;
        walls.forEach(w => {
          sumX += w.x1 + w.x2;
          sumY += w.y1 + w.y2;
          cnt += 2;
        });
        room.center.x = sumX / cnt;
        room.center.y = sumY / cnt;
      }

      return true;
    }
  };

  window.WallGeometry = WallGeometry;

} catch (error) {
  console.error('WallGeometry init error:', error);
}