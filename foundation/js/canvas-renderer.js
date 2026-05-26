const Camera = { zoom: 1.0, panX: 148.5, panY: 105 };  

function calculateMinZoom(canvas) {  
  const pts = Object.values(CanvasData.points);  
  let minX = 0, minY = 0, maxX = CONFIG.PAPER_WIDTH, maxY = CONFIG.PAPER_HEIGHT;  
  if (pts.length) {  
    minX = Math.min(...pts.map(p=>p.x)); minY = Math.min(...pts.map(p=>p.y));  
    maxX = Math.max(...pts.map(p=>p.x)); maxY = Math.max(...pts.map(p=>p.y));  
  }  
  minX -= CONFIG.WORLD_EDGE_OFFSET; minY -= CONFIG.WORLD_EDGE_OFFSET;  
  maxX += CONFIG.WORLD_EDGE_OFFSET; maxY += CONFIG.WORLD_EDGE_OFFSET;  
  minX = Math.min(minX,0); minY = Math.min(minY,0);  
  maxX = Math.max(maxX, CONFIG.PAPER_WIDTH); maxY = Math.max(maxY, CONFIG.PAPER_HEIGHT);  
  const worldW = maxX - minX, worldH = maxY - minY;  
  const zoomX = canvas.width / worldW, zoomY = canvas.height / worldH;  
  return Math.max(CONFIG.MIN_ZOOM_LIMIT, Math.min(zoomX, zoomY));  
}  

function resetCamera(canvas) { Camera.zoom = 1.0; Camera.panX = 148.5; Camera.panY = 105; if(canvas) renderCanvas(canvas); }  

function getWorldBBox() {  
  const pts = Object.values(CanvasData.points);  
  let minX = 0, minY = 0, maxX = CONFIG.PAPER_WIDTH, maxY = CONFIG.PAPER_HEIGHT;  
  if (pts.length) {  
    minX = Math.min(...pts.map(p=>p.x)); minY = Math.min(...pts.map(p=>p.y));  
    maxX = Math.max(...pts.map(p=>p.x)); maxY = Math.max(...pts.map(p=>p.y));  
  }  
  minX -= CONFIG.WORLD_EDGE_OFFSET; minY -= CONFIG.WORLD_EDGE_OFFSET;  
  maxX += CONFIG.WORLD_EDGE_OFFSET; maxY += CONFIG.WORLD_EDGE_OFFSET;  
  minX = Math.min(minX,0); minY = Math.min(minY,0);  
  maxX = Math.max(maxX, CONFIG.PAPER_WIDTH); maxY = Math.max(maxY, CONFIG.PAPER_HEIGHT);  
  return { minX, minY, maxX, maxY };  
}  

function applyPanLimits(canvas) {  
  const bbox = getWorldBBox();  
  const worldW = bbox.maxX - bbox.minX, worldH = bbox.maxY - bbox.minY;  
  const viewW = canvas.width / Camera.zoom, viewH = canvas.height / Camera.zoom;  
  let minPanX = bbox.minX + viewW/2, maxPanX = bbox.maxX - viewW/2;  
  let minPanY = bbox.minY + viewH/2, maxPanY = bbox.maxY - viewH/2;  
  if (worldW <= viewW) minPanX = maxPanX = (bbox.minX + bbox.maxX)/2;  
  if (worldH <= viewH) minPanY = maxPanY = (bbox.minY + bbox.maxY)/2;  
  Camera.panX = Math.min(maxPanX, Math.max(minPanX, Camera.panX));  
  Camera.panY = Math.min(maxPanY, Math.max(minPanY, Camera.panY));  
}  

function drawAdaptiveGrid(ctx, cam) {  
  const z = cam.zoom;  
  let alpha10=0, alpha5=0, alpha1=0;  
  if(z<0.4) alpha10=1;  
  else if(z<0.8) { const t=(z-0.4)/0.4; alpha10=1-t; alpha5=t; }  
  else { const t=(z-0.8)/(CONFIG.MAX_ZOOM-0.8); alpha5=1-t; alpha1=t; }  
  if(alpha10>0) {  
    ctx.save(); ctx.globalAlpha=alpha10; ctx.strokeStyle=CONFIG.COLOR_MAJOR; ctx.lineWidth=1/cam.zoom;  
    for(let x=0;x<=12000;x+=10) { ctx.beginPath(); ctx.moveTo(x,-2000); ctx.lineTo(x,4000); ctx.stroke(); }  
    for(let y=-2000;y<=4000;y+=10) { ctx.beginPath(); ctx.moveTo(-2000,y); ctx.lineTo(12000,y); ctx.stroke(); }  
    ctx.restore();  
  }  
  if(alpha5>0) {  
    ctx.save(); ctx.globalAlpha=alpha5; ctx.strokeStyle=CONFIG.COLOR_MINOR; ctx.lineWidth=0.8/cam.zoom;  
    for(let x=0;x<=12000;x+=5) if(x%10!==0) { ctx.beginPath(); ctx.moveTo(x,-2000); ctx.lineTo(x,4000); ctx.stroke(); }  
    for(let y=-2000;y<=4000;y+=5) if(y%10!==0) { ctx.beginPath(); ctx.moveTo(-2000,y); ctx.lineTo(12000,y); ctx.stroke(); }  
    ctx.restore();  
  }  
  if(alpha1>0) {  
    ctx.save(); ctx.globalAlpha=alpha1; ctx.strokeStyle="#b0b0b0"; ctx.lineWidth=0.4/cam.zoom;  
    for(let x=0;x<=12000;x+=1) if(x%5!==0) { ctx.beginPath(); ctx.moveTo(x,-2000); ctx.lineTo(x,4000); ctx.stroke(); }  
    for(let y=-2000;y<=4000;y+=1) if(y%5!==0) { ctx.beginPath(); ctx.moveTo(-2000,y); ctx.lineTo(12000,y); ctx.stroke(); }  
    ctx.restore();  
  }  
}  

function showScaleIndicator() {  
  let div = document.getElementById('scaleIndicator');  
  if(!div) {  
    div = document.createElement('div'); div.id='scaleIndicator';  
    div.style.cssText = 'position:fixed; left:10px; bottom:10px; background:rgba(0,0,0,0.7); color:white; padding:4px 8px; border-radius:4px; font-family:monospace; font-size:12px; pointer-events:none; z-index:1000;';  
    document.body.appendChild(div);  
  }  
  const z = Camera.zoom;  
  let layer = z<0.4 ? '10×10 мм' : (z<0.8 ? '5×5 мм' : '1×1 мм');  
  div.textContent = `Масштаб: ${z.toFixed(2)}x | Сетка: ${layer}`;  
  div.style.opacity = '1';  
  clearTimeout(window._scaleTimeout);  
  window._scaleTimeout = setTimeout(() => div.style.opacity='0', 2000);  
}  

function renderCanvas(canvas) {  
  if(!canvas) return;  
  const ctx = canvas.getContext('2d');  
  const w = canvas.width, h = canvas.height;  
  ctx.fillStyle = CONFIG.COLOR_BG; ctx.fillRect(0,0,w,h);  
  ctx.save(); ctx.translate(w/2, h/2); ctx.scale(Camera.zoom, -Camera.zoom); ctx.translate(-Camera.panX, -Camera.panY);  
  drawAdaptiveGrid(ctx, Camera);  
  for(const wid in CanvasData.walls) {  
    const ww = CanvasData.walls[wid];  
    const p1 = toScreen(ww.x1, ww.y1, canvas), p2 = toScreen(ww.x2, ww.y2, canvas);  
    ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y);  
    ctx.strokeStyle = '#333'; ctx.lineWidth = 2/Camera.zoom; ctx.stroke();  
  }  
  for(const pid in CanvasData.points) {  
    const pt = CanvasData.points[pid];  
    const s = toScreen(pt.x, pt.y, canvas);  
    ctx.beginPath(); ctx.arc(s.x, s.y, 3/Camera.zoom, 0, 2*Math.PI);  
    ctx.fillStyle = 'red'; ctx.fill();  
  }  
  ctx.restore();  
}  

function initCanvas(canvas) {  
  if(!canvas) return;  
  canvas.style.touchAction = 'none'; canvas.style.overscrollBehaviorX = 'none'; canvas.style.overscrollBehaviorY = 'none';  
  document.body.addEventListener('wheel', (e) => { if(e.target === canvas) return; e.preventDefault(); }, { passive: false });  
  document.body.addEventListener('touchmove', (e) => { if(e.target === canvas) return; e.preventDefault(); }, { passive: false });  

  canvas.addEventListener('wheel', (e) => {  
    e.preventDefault(); e.stopPropagation();  
    const rect = canvas.getBoundingClientRect();  
    const screenX = e.clientX - rect.left, screenY = e.clientY - rect.top;  
    const worldBefore = toWorld(screenX, screenY, canvas);  
    let newZoom = Camera.zoom * (e.deltaY<0 ? CONFIG.ZOOM_STEP : 1/CONFIG.ZOOM_STEP);  
    newZoom = Math.min(CONFIG.MAX_ZOOM, Math.max(calculateMinZoom(canvas), newZoom));  
    if(newZoom === Camera.zoom) return;  
    Camera.zoom = newZoom;  
    const worldAfter = toWorld(screenX, screenY, canvas);  
    Camera.panX += worldBefore.x - worldAfter.x;  
    Camera.panY += worldBefore.y - worldAfter.y;  
    applyPanLimits(canvas); renderCanvas(canvas); showScaleIndicator();  
  }, { passive: false });  

  let isPanning = false, lastPanX, lastPanY;  
  canvas.addEventListener('pointerdown', (e) => {  
    e.preventDefault(); e.stopPropagation(); canvas.setPointerCapture(e.pointerId);  
    isPanning = true; lastPanX = e.clientX; lastPanY = e.clientY;  
  });  
  canvas.addEventListener('pointermove', (e) => {  
    if(!isPanning) return;  
    e.preventDefault();  
    const dx = e.clientX - lastPanX, dy = e.clientY - lastPanY;  
    lastPanX = e.clientX; lastPanY = e.clientY;  
    Camera.panX -= dx / Camera.zoom; Camera.panY += dy / Camera.zoom;  
    applyPanLimits(canvas); renderCanvas(canvas);  
  });  
  canvas.addEventListener('pointerup', (e) => { isPanning = false; canvas.releasePointerCapture(e.pointerId); });  
  canvas.addEventListener('pointercancel', () => { isPanning = false; });  
  renderCanvas(canvas);  
}  

window.Camera = Camera; window.resetCamera = resetCamera; window.renderCanvas = renderCanvas;  
window.initCanvas = initCanvas; window.toWorld = toWorld; window.toScreen = toScreen;  