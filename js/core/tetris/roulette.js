// Инструмент «Рулетка», 55 строк
import { events } from '../events.js';
export class Roulette {
  constructor(canvasInstance) { this.canvas = canvasInstance; this.isActive = false; this.startPoint = null; this.endPoint = null; this.measurements = []; this._bind(); console.log('[Roulette] initialized'); }
  activate() { this.isActive = true; this.startPoint = null; this.endPoint = null; events.emit('rouletteActivated'); }
  deactivate() { this.isActive = false; events.emit('rouletteDeactivated'); }
  _bind() { this.canvas.canvas.addEventListener('click', e => { if (!this.isActive) return; const coords = this.canvas.render.getCanvasCoords(e.clientX, e.clientY); if (!this._isNearWall(coords)) return; if (!this.startPoint) { this.startPoint = coords; events.emit('rouletteStartPointSet', { point: coords }); } else { this.endPoint = coords; const d = Math.sqrt((coords.x-this.startPoint.x)**2 + (coords.y-this.startPoint.y)**2); const m = { start: {...this.startPoint}, end: {...this.endPoint}, distance: Math.round(d*10)/10, unit: 'см' }; this.measurements.push(m); events.emit('rouletteMeasured', { measurement: m }); this.startPoint = this.endPoint; this.endPoint = null; } }); }
  _isNearWall(point) { return true; }
  getLastMeasurement() { return this.measurements[this.measurements.length-1] || null; }
}