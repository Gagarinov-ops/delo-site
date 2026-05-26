window.CONFIG = {  
  UNIT: 'mm',  
  AREA_UNIT: 'm²',  
  GRID_BASE: 1,  
  GRID_MAJOR: 10,  
  COLOR_BG: '#e0e0e0',  
  COLOR_MINOR: '#d0d0d0',  
  COLOR_MAJOR: '#a0a0a0',  
  AXIS: { X_RIGHT: true, Y_UP: true },  
  ORIGIN: 'bottom-left',  
  ZOOM_STEP: 1.1,  
  MAX_ZOOM: 3.0,  
  MIN_ZOOM_LIMIT: 0.3,  
  WORLD_EDGE_OFFSET: 20,  
  PAPER_WIDTH: 297,  
  PAPER_HEIGHT: 210,  
  MAX_WORLD_LIMIT: 12000,  
  MIN_DRAG_DISTANCE: 10,  
  SNAP_TOLERANCE_POINT: 10,  
  SNAP_TOLERANCE_LINE: 7,  
  POINT_MARKER_RADIUS: 5,  
  LONG_PRESS_DURATION: 600  
};  

window.getSnapGridStep = function(zoom) {  
  if (zoom < 0.5) return 10;  
  if (zoom < 0.8) return 5;  
  return 1;  
};  