// Логика помещения, 55 строк
import { events } from '../events.js';
export class TetrisRoom {
  constructor() { this.dimensions = { length: 0, width: 0, height: 0 }; this.walls = []; this.isClosed = false; this._bindInputs(); console.log('[TetrisRoom] initialized'); }
  _bindInputs() {
    document.addEventListener('DOMContentLoaded', () => {
      ['room-length','room-width','room-height'].forEach(id => {
        const el = document.getElementById(id); if (el) el.addEventListener('input', e => this.setDimension(id.replace('room-',''), e.target.value));
      });
    });
  }
  setDimension(dim, value) {
    const v = parseFloat(value); if (isNaN(v) || v <= 0) { events.emit('validationError', { message: `${dim} должна быть > 0`, riskId: 'RISK-10' }); return; }
    this.dimensions[dim] = v; this._recalc(); events.emit('roomDimensionsChanged', { dimensions: {...this.dimensions} });
  }
  _recalc() {
    const { length, width } = this.dimensions;
    if (length <= 0 || width <= 0) { this.walls = []; this.isClosed = false; return; }
    this.walls = [{ x1:0,y1:0,x2:length,y2:0,length }, { x1:length,y1:0,x2:length,y2:width,length:width }, { x1:length,y1:width,x2:0,y2:width,length }, { x1:0,y1:width,x2:0,y2:0,length:width }];
    this.isClosed = true;
    events.emit('wallsUpdated', { walls: [...this.walls], isClosed: this.isClosed });
  }
  getDimensions() { return {...this.dimensions}; }
}