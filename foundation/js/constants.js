window.CONFIG = {  
  UNIT: 'mm',  
  AREA_UNIT: 'm²',  
  GRID_BASE: 1,  
  GRID_MAJOR: 10,  
  BACKGROUND_COLOR: '#FFFFFF',  
  GRID_COLOR: '#E0E0E0',  
  WALL_STROKE_COLOR: '#1E90FF',  
  WALL_STROKE_WIDTH: 3,  
  ROOM_FILL_COLOR: 'rgba(30, 144, 255, 0.05)',  
  POINT_MARKER_FILL: '#FF4500',  
  POINT_MARKER_STROKE: '#FFFFFF',  
  POINT_MARKER_RADIUS: 5,  
  DIMENSION_COLOR: '#FF8C00',  
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
  LONG_PRESS_DURATION: 600  
};  

window.getSnapGridStep = function(zoom) {  
  if (zoom < 0.5) return 10;  
  if (zoom < 0.8) return 5;  
  return 1;  
};  