'use strict';

/**
 * RenderRoom — отрисовка комнат на canvas
 * Заливка, стены, подписи
 */

try {
  const RenderRoom = {
    drawRoom(ctx, room) {
      if (!room.walls || room.walls.length < 3) return;

      // Строим полигон для заливки
      const points = [];
      const used = new Set();

      let currentX = room.walls[0].x1;
      let currentY = room.walls[0].y1;
      points.push({ x: currentX, y: currentY });
      used.add(0);

      while (points.length < room.walls.length) {
        let found = false;
        for (let i = 0; i < room.walls.length; i++) {
          if (used.has(i)) continue;
          const w = room.walls[i];
          if ((w.x1 === currentX && w.y1 === currentY) || (w.x2 === currentX && w.y2 === currentY)) {
            const nx = (w.x1 === currentX && w.y1 === currentY) ? w.x2 : w.x1;
            const ny = (w.x1 === currentX && w.y1 === currentY) ? w.y2 : w.y1;
            currentX = nx;
            currentY = ny;
            points.push({ x: currentX, y: currentY });
            used.add(i);
            found = true;
            break;
          }
        }
        if (!found) break;
      }

      if (points.length >= 3) {
        ctx.fillStyle = 'rgba(0,166,81,0.08)';
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.closePath();
        ctx.fill();
      }

      // Рисуем стены зелёным
      ctx.strokeStyle = '#00A651';
      ctx.lineWidth = 3;
      ctx.setLineDash([]);
      room.walls.forEach(wall => {
        ctx.beginPath();
        ctx.moveTo(wall.x1, wall.y1);
        ctx.lineTo(wall.x2, wall.y2);
        ctx.stroke();
      });
    },

    drawLabels(ctx, room) {
      if (!room.walls) return;

      ctx.fillStyle = '#00A651';
      ctx.font = '10px InterVariable, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      room.walls.forEach(wall => {
        const midX = (wall.x1 + wall.x2) / 2;
        const midY = (wall.y1 + wall.y2) / 2;

        const dx = wall.x2 - wall.x1;
        const dy = wall.y2 - wall.y1;
        const len = Math.hypot(dx, dy);
        if (len === 0) return;

        const nx = -dy / len * 10;
        const ny = dx / len * 10;

        ctx.fillText(wall.name, midX + nx, midY + ny);
      });

      if (room.center && room.label) {
        ctx.fillStyle = '#2D2D2D';
        ctx.font = '11px InterVariable, -apple-system, sans-serif';
        ctx.fillText(room.label, room.center.x, room.center.y);
      }
    }
  };

  window.RenderRoom = RenderRoom;

} catch (error) {
  console.error('RenderRoom init error:', error);
}