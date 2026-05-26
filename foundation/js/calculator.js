window.Calculator = {  
  recalculate: function(wallId) {  
    const wall = CanvasData.walls[wallId];  
    if (!wall) return;  
    const dx = wall.x2 - wall.x1;  
    const dy = wall.y2 - wall.y1;  
    const raw = Math.sqrt(dx*dx + dy*dy);  
    wall.length = Math.round(raw * 100) / 100;  
  },  

  recalculateRoom: function(roomId) {  
    const room = CanvasData.rooms[roomId];  
    if (!room) return;  

    let perimeter = 0;  
    room.wallIds.forEach(wid => {  
      const wall = CanvasData.walls[wid];  
      if (wall) perimeter += wall.length;  
    });  

    const pts = room.pointIds.map(pid => CanvasData.points[pid]).filter(p => p);  
    let areaMm2 = 0;  
    if (pts.length >= 3) {  
      for (let i = 0; i < pts.length; i++) {  
        const p1 = pts[i];  
        const p2 = pts[(i + 1) % pts.length];  
        areaMm2 += p1.x * p2.y - p2.x * p1.y;  
      }  
      areaMm2 = Math.abs(areaMm2) / 2;  
    }  
    const floorAreaM2 = Math.round((areaMm2 / 1_000_000) * 10) / 10;  
    const grossWallArea = (perimeter * room.height) / 1_000_000;  

    let totalOpeningArea = 0;  
    room.wallIds.forEach(wid => {  
      const wall = CanvasData.walls[wid];  
      if (wall && wall.openingIds) {  
        wall.openingIds.forEach(oid => {  
          const op = CanvasData.openings[oid];  
          if (op) totalOpeningArea += op.area;  
        });  
      }  
    });  

    const netWallArea = Math.round((grossWallArea - totalOpeningArea) * 100) / 100;  

    room.perimeter = perimeter;  
    room.floorArea = floorAreaM2;  
    room.wallArea = netWallArea;  
  }  
};  