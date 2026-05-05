// Маркер угла, 50 строк
import { events } from '../events.js';
export class AngleMarker {
  constructor() { this.markers = []; this.isActive = false; console.log('[AngleMarker] initialized'); }
  activate() { this.isActive = true; events.emit('angleMarkerActivated'); }
  deactivate() { this.isActive = false; events.emit('angleMarkerDeactivated'); }
  addMarker(x, y, angle = 90, comment = '') {
    if (!this.isActive) return;
    const m = { id: Date.now(), x, y, angle: parseFloat(angle)||0, comment }; this.markers.push(m); events.emit('angleMarkerAdded', { marker: m }); return m;
  }
  updateMarker(id, data) { const m = this.markers.find(m => m.id === id); if (m) { Object.assign(m, data); events.emit('angleMarkerUpdated', { marker: m }); } }
  removeMarker(id) { this.markers = this.markers.filter(m => m.id !== id); events.emit('angleMarkerRemoved', { id }); }
  getMarkers() { return [...this.markers]; }
  draw(ctx, marker) {
    const { x, y, angle } = marker; ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI*2); ctx.fillStyle = '#1565C0'; ctx.fill();
    const rad = angle * Math.PI / 180; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 30*Math.cos(rad), y + 30*Math.sin(rad)); ctx.strokeStyle = '#1565C0'; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.fillStyle = '#1565C0'; ctx.font = '10px InterVariable, sans-serif'; ctx.fillText(`${angle}°`, x+8, y-8);
    if (marker.comment) { ctx.fillStyle = '#666'; ctx.font = '9px InterVariable, sans-serif'; ctx.fillText(marker.comment, x+8, y+12); }
  }
}