const HitTest = {  
  snapToPoint(screenX, screenY, points, isTouch) {  
    if (!window._activeCanvas) return null;  
    const tolerancePx = isTouch ? CONFIG.SNAP_CAPTURE_RADIUS_PX_TOUCH : CONFIG.SNAP_CAPTURE_RADIUS_PX;  
    let closest = null;  
    let minDist = tolerancePx;  
    for (const id in points) {  
      const p = points[id];  
      const screenPos = toScreen(p.x, p.y, window._activeCanvas);  
      const dist = Math.hypot(screenX - screenPos.x, screenY - screenPos.y);  
      if (dist < minDist) {  
        minDist = dist;  
        closest = p;  
      }  
    }  
    return closest ? { pointId: closest.id, x: closest.x, y: closest.y } : null;  
  },  

  snapToLine(screenX, screenY, walls, isTouch) {  
    if (!window._activeCanvas) return null;  
    const tolerancePx = isTouch ? CONFIG.SNAP_CAPTURE_RADIUS_PX_TOUCH : CONFIG.SNAP_CAPTURE_RADIUS_PX;  
    let closest = null;  
    let minDist = tolerancePx;  
    for (const id in walls) {  
      const w = walls[id];  
      const startScreen = toScreen(w.x1, w.y1, window._activeCanvas);  
      const endScreen = toScreen(w.x2, w.y2, window._activeCanvas);  
      const proj = this._projectPointToSegment(screenX, screenY, startScreen.x, startScreen.y, endScreen.x, endScreen.y);  
      const dist = Math.hypot(screenX - proj.x, screenY - proj.y);  
      if (dist < minDist) {  
        minDist = dist;  
        const world = toWorld(proj.x, proj.y, window._activeCanvas);  
        closest = { x: world.x, y: world.y };  
      }  
    }  
    return closest;  
  },  

  snapToGrid(worldX, worldY, step) {  
    return {  
      x: Math.round(worldX / step) * step,  
      y: Math.round(worldY / step) * step  
    };  
  },  

  _projectPointToSegment(px, py, ax, ay, bx, by) {  
    const dx = bx - ax;  
    const dy = by - ay;  
    const lenSq = dx * dx + dy * dy;  
    if (lenSq === 0) return { x: ax, y: ay };  
    let t = ((px - ax) * dx + (py - ay) * dy) / lenSq;  
    t = Math.max(0, Math.min(1, t));  
    return { x: ax + t * dx, y: ay + t * dy };  
  }  
};  