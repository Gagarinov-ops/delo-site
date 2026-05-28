const Camera = { zoom: 1.0, panX: 148.5, panY: 105 };  

function calculateMinZoom(canvas) {  
  const pts = Object.values(CanvasData.points);  
  let minX = 0, minY = 0, maxX = CONFIG.PAPER_WIDTH, maxY = CONFIG.PAPER_HEIGHT;  
  if (pts.length) {  
    minX = Math.min(...pts.map(p=>p.x));  
    minY = Math.min(...pts.map(p=>p.y));  
    maxX = Math.max(...pts.map(p=>p.x));  
    maxY = Math.max(...pts.map(p=>p.y));  
  }  
  minX -= CONFIG.WORLD_EDGE_OFFSET;  
  minY -= CONFIG.WORLD_EDGE_OFFSET;  
  maxX += CONFIG.WORLD_EDGE_OFFSET;  
  maxY += CONFIG.WORLD_EDGE_OFFSET;  
  minX = Math.min(minX, 0);  
  minY = Math.min(minY, 0);  
  maxX = Math.max(maxX, CONFIG.PAPER_WIDTH);  
  maxY = Math.max(maxY, CONFIG.PAPER_HEIGHT);  
  const worldW = maxX - minX;  
  const worldH = maxY - minY;  
  const zoomX = canvas.width / worldW;  
  const zoomY = canvas.height / worldH;  
  return Math.max(CONFIG.MIN_ZOOM_LIMIT, Math.min(zoomX, zoomY));  
}  

function resetCamera(canvas) {  
  Camera.zoom = 1.0;  
  Camera.panX = 148.5;  
  Camera.panY = 105;  
  if (canvas) renderCanvas(canvas);  
}  

function getWorldBBox() {  
  const pts = Object.values(CanvasData.points);  
  let minX = 0, minY = 0, maxX = CONFIG.PAPER_WIDTH, maxY = CONFIG.PAPER_HEIGHT;  
  if (pts.length) {  
    minX = Math.min(...pts.map(p=>p.x));  
    minY = Math.min(...pts.map(p=>p.y));  
    maxX = Math.max(...pts.map(p=>p.x));  
    maxY = Math.max(...pts.map(p=>p.y));  
  }  
  minX -= CONFIG.WORLD_EDGE_OFFSET;  
  minY -= CONFIG.WORLD_EDGE_OFFSET;  
  maxX += CONFIG.WORLD_EDGE_OFFSET;  
  maxY += CONFIG.WORLD_EDGE_OFFSET;  
  minX = Math.min(minX, 0);  
  minY = Math.min(minY, 0);  
  maxX = Math.max(maxX, CONFIG.PAPER_WIDTH);  
  maxY = Math.max(maxY, CONFIG.PAPER_HEIGHT);  
  return { minX, minY, maxX, maxY };  
}  

function applyPanLimits(canvas) {  
  const bbox = getWorldBBox();  
  const worldW = bbox.maxX - bbox.minX;  
  const worldH = bbox.maxY - bbox.minY;  
  const viewW = canvas.width / Camera.zoom;  
  const viewH = canvas.height / Camera.zoom;  
  let minPanX = bbox.minX + viewW/2;  
  let maxPanX = bbox.maxX - viewW/2;  
  let minPanY = bbox.minY + viewH/2;  
  let maxPanY = bbox.maxY - viewH/2;  
  if (worldW <= viewW) minPanX = maxPanX = (bbox.minX + bbox.maxX)/2;  
  if (worldH <= viewH) minPanY = maxPanY = (bbox.minY + bbox.maxY)/2;  
  Camera.panX = Math.min(maxPanX, Math.max(minPanX, Camera.panX));  
  Camera.panY = Math.min(maxPanY, Math.max(minPanY, Camera.panY));  
}  

function drawAdaptiveGrid(ctx, cam) {  
  const z = cam.zoom;  
  let alpha10 = 0, alpha5 = 0, alpha1 = 0;  
  if (z < 0.4) {  
    alpha10 = 1.0;  
  } else if (z < 0.8) {  
    const t = (z - 0.4) / 0.4;  
    alpha10 = 1 - t;  
    alpha5 = t;  
  } else {  
    const t = (z - 0.8) / (CONFIG.MAX_ZOOM - 0.8);  
    alpha5 = 1 - t;  
    alpha1 = t;  
  }  
  ctx.save();  
  ctx.strokeStyle = CONFIG.GRID_COLOR;  
  if (alpha10 > 0) {  
    ctx.globalAlpha = alpha10;  
    ctx.lineWidth = 1 / cam.zoom;  
    for (let x = 0; x <= 12000; x += 10) {  
      ctx.beginPath();  
      ctx.moveTo(x, -2000);  
      ctx.lineTo(x, 4000);  
      ctx.stroke();  
    }  
    for (let y = -2000; y <= 4000; y += 10) {  
      ctx.beginPath();  
      ctx.moveTo(-2000, y);  
      ctx.lineTo(12000, y);  
      ctx.stroke();  
    }  
  }  
  if (alpha5 > 0) {  
    ctx.globalAlpha = alpha5;  
    ctx.lineWidth = 0.8 / cam.zoom;  
    for (let x = 0; x <= 12000; x += 5) {  
      if (x % 10 !== 0) {  
        ctx.beginPath();  
        ctx.moveTo(x, -2000);  
        ctx.lineTo(x, 4000);  
        ctx.stroke();  
      }  
    }  
    for (let y = -2000; y <= 4000; y += 5) {  
      if (y % 10 !== 0) {  
        ctx.beginPath();  
        ctx.moveTo(-2000, y);  
        ctx.lineTo(12000, y);  
        ctx.stroke();  
      }  
    }  
  }  
  if (alpha1 > 0) {  
    ctx.globalAlpha = alpha1;  
    ctx.lineWidth = 0.4 / cam.zoom;  
    for (let x = 0; x <= 12000; x += 1) {  
      if (x % 5 !== 0) {  
        ctx.beginPath();  
        ctx.moveTo(x, -2000);  
        ctx.lineTo(x, 4000);  
        ctx.stroke();  
      }  
    }  
    for (let y = -2000; y <= 4000; y += 1) {  
      if (y % 5 !== 0) {  
        ctx.beginPath();  
        ctx.moveTo(-2000, y);  
        ctx.lineTo(12000, y);  
        ctx.stroke();  
      }  
    }  
  }  
  ctx.restore();  
}  

function showScaleIndicator() {  
  let div = document.getElementById('scaleIndicator');  
  if (!div) {  
    div = document.createElement('div');  
    div.id = 'scaleIndicator';  
    div.style.cssText = 'position:fixed; left:10px; bottom:10px; background:rgba(0,0,0,0.7); color:white; padding:4px 8px; border-radius:4px; font-family:monospace; font-size:12px; pointer-events:none; z-index:1000;';  
    document.body.appendChild(div);  
  }  
  const z = Camera.zoom;  
  let layer = z < 0.4 ? '10×10 мм' : (z < 0.8 ? '5×5 мм' : '1×1 мм');  
  div.textContent = `Масштаб: ${z.toFixed(2)}x | Сетка: ${layer}`;  
  div.style.opacity = '1';  
  clearTimeout(window._scaleTimeout);  
  window._scaleTimeout = setTimeout(() => { div.style.opacity = '0'; }, 2000);  
}  

function renderCanvas(canvas) {  
  if (!canvas) return;  
  const ctx = canvas.getContext('2d');  
  const w = canvas.width, h = canvas.height;  
  ctx.fillStyle = CONFIG.BACKGROUND_COLOR;  
  ctx.fillRect(0, 0, w, h);  

  ctx.save();  
  ctx.translate(w/2, h/2);  
  ctx.scale(Camera.zoom, -Camera.zoom);  
  ctx.translate(-Camera.panX, -Camera.panY);  

  drawAdaptiveGrid(ctx, Camera);  

  ctx.strokeStyle = CONFIG.WALL_STROKE_COLOR;  
  ctx.lineWidth = CONFIG.WALL_STROKE_WIDTH / Camera.zoom;  
  for (const id in CanvasData.walls) {  
    const ww = CanvasData.walls[id];  
    ctx.beginPath();  
    ctx.moveTo(ww.x1, ww.y1);  
    ctx.lineTo(ww.x2, ww.y2);  
    ctx.stroke();  
  }  

  ctx.fillStyle = CONFIG.POINT_MARKER_FILL;  
  ctx.strokeStyle = CONFIG.POINT_MARKER_STROKE;  
  ctx.lineWidth = 1 / Camera.zoom;  
  for (const id in CanvasData.points) {  
    const p = CanvasData.points[id];  
    ctx.beginPath();  
    ctx.arc(p.x, p.y, CONFIG.POINT_MARKER_RADIUS / Camera.zoom, 0, Math.PI * 2);  
    ctx.fill();  
    ctx.stroke();  
  }  

  ctx.restore();  
}  

function initCanvas(canvas) {  
  if (!canvas) return;  
  window._activeCanvas = canvas;  

  canvas.style.touchAction = 'none';  
  canvas.style.overscrollBehaviorX = 'none';  
  canvas.style.overscrollBehaviorY = 'none';  

  // Глобальные блокировщики для Chrome (колесо и тач)  
  document.body.addEventListener('wheel', (e) => {  
    if (e.target === canvas) return;  
    e.preventDefault();  
  }, { passive: false });  
  document.body.addEventListener('touchmove', (e) => {  
    if (e.target === canvas) return;  
    e.preventDefault();  
  }, { passive: false });  

  // Зум колесом мыши  
  canvas.addEventListener('wheel', (e) => {  
    e.preventDefault();  
    e.stopPropagation();  
    const rect = canvas.getBoundingClientRect();  
    const screenX = e.clientX - rect.left;  
    const screenY = e.clientY - rect.top;  
    const worldBefore = toWorld(screenX, screenY, canvas);  
    let newZoom = Camera.zoom * (e.deltaY < 0 ? CONFIG.ZOOM_STEP : 1 / CONFIG.ZOOM_STEP);  
    newZoom = Math.min(CONFIG.MAX_ZOOM, Math.max(calculateMinZoom(canvas), newZoom));  
    if (newZoom === Camera.zoom) return;  
    Camera.zoom = newZoom;  
    const worldAfter = toWorld(screenX, screenY, canvas);  
    Camera.panX += worldBefore.x - worldAfter.x;  
    Camera.panY += worldBefore.y - worldAfter.y;  
    applyPanLimits(canvas);  
    renderCanvas(canvas);  
    showScaleIndicator();  
  }, { passive: false });  

  // ----- Панорамирование мышью (Pointer Events) -----  
  let isPanning = false;  
  let lastPanX = 0, lastPanY = 0;  

  canvas.addEventListener('pointerdown', (e) => {  
    canvas.setPointerCapture(e.pointerId);  
    if (PencilTool.active) {  
      PencilTool.handlePointerDown(e);  
      return;  
    }  
    e.preventDefault();  
    e.stopPropagation();  
    isPanning = true;  
    lastPanX = e.clientX;  
    lastPanY = e.clientY;  
  });  

  canvas.addEventListener('pointermove', (e) => {  
    if (PencilTool.active) {  
      PencilTool.handlePointerMove(e);  
      return;  
    }  
    if (!isPanning) return;  
    e.preventDefault();  
    const dx = e.clientX - lastPanX;  
    const dy = e.clientY - lastPanY;  
    lastPanX = e.clientX;  
    lastPanY = e.clientY;  
    Camera.panX -= dx / Camera.zoom;  
    Camera.panY += dy / Camera.zoom;  
    applyPanLimits(canvas);  
    renderCanvas(canvas);  
  });  

  canvas.addEventListener('pointerup', (e) => {  
    canvas.releasePointerCapture(e.pointerId);  
    if (PencilTool.active) {  
      PencilTool.handlePointerUp(e);  
      return;  
    }  
    isPanning = false;  
  });  

  canvas.addEventListener('lostpointercapture', () => {  
    if (PencilTool.active) {  
      PencilTool.drawing = false;  
      PencilTool.clearPreview();  
    }  
    isPanning = false;  
  });  

  // ----- Навигация пальцами (Touch) в режиме Курсора -----  
  let touchStartDistance = 0;  
  let touchStartZoom = 1;  
  let touchPanStart = { x: 0, y: 0 };  
  let touchPanCamera = { panX: 0, panY: 0 };  

  canvas.addEventListener('touchstart', (e) => {  
    if (PencilTool && PencilTool.active) return;  
    if (e.touches.length === 2) {  
      // Зум двумя пальцами  
      e.preventDefault();  
      const dx = e.touches[0].clientX - e.touches[1].clientX;  
      const dy = e.touches[0].clientY - e.touches[1].clientY;  
      touchStartDistance = Math.hypot(dx, dy);  
      touchStartZoom = Camera.zoom;  
    } else if (e.touches.length === 1) {  
      // Панорамирование одним пальцем  
      e.preventDefault();  
      touchPanStart.x = e.touches[0].clientX;  
      touchPanStart.y = e.touches[0].clientY;  
      touchPanCamera.panX = Camera.panX;  
      touchPanCamera.panY = Camera.panY;  
    }  
  });  

  canvas.addEventListener('touchmove', (e) => {  
    if (PencilTool && PencilTool.active) return;  
    if (e.touches.length === 2) {  
      e.preventDefault();  
      const dx = e.touches[0].clientX - e.touches[1].clientX;  
      const dy = e.touches[0].clientY - e.touches[1].clientY;  
      const newDist = Math.hypot(dx, dy);  
      if (touchStartDistance === 0) return;  
      let newZoom = touchStartZoom * (newDist / touchStartDistance);  
      newZoom = Math.min(CONFIG.MAX_ZOOM, Math.max(calculateMinZoom(canvas), newZoom));  
      Camera.zoom = newZoom;  
      applyPanLimits(canvas);  
      renderCanvas(canvas);  
      showScaleIndicator();  
    } else if (e.touches.length === 1) {  
      e.preventDefault();  
      const clientX = e.touches[0].clientX;  
      const clientY = e.touches[0].clientY;  
      const dx = clientX - touchPanStart.x;  
      const dy = clientY - touchPanStart.y;  
      Camera.panX = touchPanCamera.panX - dx / Camera.zoom;  
      Camera.panY = touchPanCamera.panY + dy / Camera.zoom;  
      applyPanLimits(canvas);  
      renderCanvas(canvas);  
    }  
  });  

  canvas.addEventListener('touchend', (e) => {  
    if (PencilTool && PencilTool.active) return;  
    e.preventDefault();  
    touchStartDistance = 0;  
  });  

  renderCanvas(canvas);  
}  

window.Camera = Camera;  
window.resetCamera = resetCamera;  
window.renderCanvas = renderCanvas;  
window.initCanvas = initCanvas;  
window.toWorld = toWorld;  
window.toScreen = toScreen;  