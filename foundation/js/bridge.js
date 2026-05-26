window.bridgeCreatePoint = function(x, y) { return registerPoint(x, y); };  
window.bridgeCreateWall = function(id1, id2) { return registerWall(id1, id2); };  

function toWorld(screenX, screenY, canvas) {  
  const cx = canvas.width/2, cy = canvas.height/2;  
  return { x: (screenX - cx)/Camera.zoom + Camera.panX, y: (cy - screenY)/Camera.zoom + Camera.panY };  
}  
function toScreen(worldX, worldY, canvas) {  
  const cx = canvas.width/2, cy = canvas.height/2;  
  return { x: (worldX - Camera.panX)*Camera.zoom + cx, y: cy - (worldY - Camera.panY)*Camera.zoom };  
}  