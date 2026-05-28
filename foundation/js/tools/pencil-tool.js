const PencilTool = {  
  active: false,  
  drawing: false,  
  canvas: null,  
  startScreenX: 0,  
  startScreenY: 0,  
  startWorldX: 0,  
  startWorldY: 0,  
  startPointId: null,  
  currentScreenX: 0,  
  currentScreenY: 0,  

  activate(canvasElement) {  
    this.active = true;  
    this.canvas = canvasElement;  
    this.drawing = false;  
    console.log('Карандаш активирован');  
  },  

  deactivate() {  
    this.active = false;  
    this.drawing = false;  
    this.canvas = null;  
    console.log('Карандаш деактивирован');  
  },  

  handlePointerDown(e) {  
    if (!this.canvas) return;  
    if (!this.active) return;  
    this.drawing = true;  
    const rect = this.canvas.getBoundingClientRect();  
    const screenX = e.clientX - rect.left;  
    const screenY = e.clientY - rect.top;  
    this.startScreenX = screenX;  
    this.startScreenY = screenY;  
    this.currentScreenX = screenX;  
    this.currentScreenY = screenY;  

    const isTouch = (e.pointerType === 'touch');  
    let world = toWorld(screenX, screenY, this.canvas);  
    const gridStep = getSnapGridStep(Camera.zoom);  

    const snappedPoint = HitTest.snapToPoint(screenX, screenY, CanvasData.points, isTouch);  
    if (snappedPoint && snappedPoint.pointId) {  
      this.startPointId = snappedPoint.pointId;  
      world = snappedPoint;  
      console.log('Прилипание стартовой точки к точке:', world);  
    } else {  
      const snappedLine = HitTest.snapToLine(screenX, screenY, CanvasData.walls, isTouch);  
      if (snappedLine) {  
        world = snappedLine;  
        console.log('Прилипание стартовой точки к стене:', world);  
        this.startPointId = null;  
      } else {  
        world = HitTest.snapToGrid(world.x, world.y, gridStep);  
        this.startPointId = null;  
      }  
    }  

    this.startWorldX = world.x;  
    this.startWorldY = world.y;  
    console.log('Карандаш: нажатие, старт (мир):', this.startWorldX, this.startWorldY);  
  },  

  handlePointerMove(e) {  
    if (!this.canvas) return;  
    if (!this.active || !this.drawing) return;  
    const rect = this.canvas.getBoundingClientRect();  
    this.currentScreenX = e.clientX - rect.left;  
    this.currentScreenY = e.clientY - rect.top;  
    this.drawPreview();  
  },  

  handlePointerUp(e) {  
    if (!this.canvas) return;  
    if (!this.active || !this.drawing) return;  
    this.drawing = false;  
    this.clearPreview();  

    const rect = this.canvas.getBoundingClientRect();  
    const endScreenX = e.clientX - rect.left;  
    const endScreenY = e.clientY - rect.top;  

    const dx = endScreenX - this.startScreenX;  
    const dy = endScreenY - this.startScreenY;  
    const distance = Math.hypot(dx, dy);  
    if (distance < CONFIG.MIN_DRAG_DISTANCE) {  
      console.log('Слишком короткий отрезок, игнорируем');  
      return;  
    }  

    const isTouch = (e.pointerType === 'touch');  
    let endWorld = toWorld(endScreenX, endScreenY, this.canvas);  
    const gridStep = getSnapGridStep(Camera.zoom);  
    let endPointId = null;  

    const snappedPoint = HitTest.snapToPoint(endScreenX, endScreenY, CanvasData.points, isTouch);  
    if (snappedPoint && snappedPoint.pointId) {  
      endPointId = snappedPoint.pointId;  
      endWorld = snappedPoint;  
      console.log('Прилипание конечной точки к точке:', endWorld);  
    } else {  
      const snappedLine = HitTest.snapToLine(endScreenX, endScreenY, CanvasData.walls, isTouch);  
      if (snappedLine) {  
        endWorld = snappedLine;  
        console.log('Прилипание конечной точки к стене:', endWorld);  
      } else {  
        endWorld = HitTest.snapToGrid(endWorld.x, endWorld.y, gridStep);  
      }  
    }  

    let p1Id, p2Id;  
    if (this.startPointId !== null) {  
      p1Id = this.startPointId;  
    } else {  
      const p1 = registerPoint(this.startWorldX, this.startWorldY);  
      if (!p1.success) { console.error(p1.error); return; }  
      p1Id = p1.data.pointId;  
    }  

    if (endPointId !== null) {  
      p2Id = endPointId;  
    } else {  
      const p2 = registerPoint(endWorld.x, endWorld.y);  
      if (!p2.success) { console.error(p2.error); return; }  
      p2Id = p2.data.pointId;  
    }  

    const wall = registerWall(p1Id, p2Id);  
    if (wall.success) {  
      console.log('Стена создана:', wall.data.wallId);  
    } else {  
      console.error('Ошибка при создании стены:', wall.error);  
    }  

    renderCanvas(this.canvas);  
    console.log('Текущий zoom камеры:', Camera.zoom);  
  },  

  drawPreview() {  
    if (!this.canvas) return;  
    renderCanvas(this.canvas);  
    const ctx = this.canvas.getContext('2d');  
    ctx.save();  
    ctx.strokeStyle = '#FF0000';  
    ctx.lineWidth = 2;  
    ctx.setLineDash([5, 5]);  
    ctx.beginPath();  
    ctx.moveTo(this.startScreenX, this.startScreenY);  
    ctx.lineTo(this.currentScreenX, this.currentScreenY);  
    ctx.stroke();  
    ctx.restore();  
  },  

  clearPreview() {  
    if (!this.canvas) return;  
    renderCanvas(this.canvas);  
  }  
};  