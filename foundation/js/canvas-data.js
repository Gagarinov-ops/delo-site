window.CanvasData = {  
  points: {},  
  walls: {},  
  rooms: {},  
  openings: {},  
  elements: {},  
  dimensionLines: {},  
  _pointSeq: 0,  
  _wallSeq: 0,  
  _roomSeq: 0,  
  _openingSeq: 0,  

  reset: function() {  
    this.points = {};  
    this.walls = {};  
    this.rooms = {};  
    this.openings = {};  
    this.elements = {};  
    this.dimensionLines = {};  
    this._pointSeq = 0;  
    this._wallSeq = 0;  
    this._roomSeq = 0;  
    this._openingSeq = 0;  
  },  

  _upgradeWalls: function() {  
    for (const wid in this.walls) {  
      const w = this.walls[wid];  
      if (w.pointStartId === undefined || w.pointEndId === undefined) {  
        let startPointId = null, endPointId = null;  
        for (const pid in this.points) {  
          const p = this.points[pid];  
          if (Math.abs(p.x - w.x1) < 0.001 && Math.abs(p.y - w.y1) < 0.001) startPointId = pid;  
          if (Math.abs(p.x - w.x2) < 0.001 && Math.abs(p.y - w.y2) < 0.001) endPointId = pid;  
        }  
        if (startPointId && endPointId) {  
          w.pointStartId = startPointId;  
          w.pointEndId = endPointId;  
        }  
      }  
    }  
  }  
};  