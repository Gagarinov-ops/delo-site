// [REF-005] Управление зумом и панорамированием (62 строки)
// [PLN-001] Pinch-to-zoom, double-tap
// [AP-004] Один файл — одна ответственность

import { events } from '../events.js';

export class TetrisZoom {
  constructor(canvas) {
    this.canvas = canvas;
    this.scale = 1;
    this.offsetX = 0;
    this.offsetY = 0;
    this.isPanning = false;
    this.lastX = 0;
    this.lastY = 0;
    this._bind();
    console.log('[TetrisZoom] initialized');
  }

  getTransform() {
    return {
      scale: this.scale,
      offsetX: this.offsetX,
      offsetY: this.offsetY,
    };
  }

  zoom(factor, cx, cy) {
    const ns = this.scale * factor;
    if (ns < 0.5 || ns > 3) return;
    this.offsetX = cx - (cx - this.offsetX) * factor;
    this.offsetY = cy - (cy - this.offsetY) * factor;
    this.scale = ns;
    events.emit('zoomChanged', this.getTransform());
  }

  reset() {
    this.scale = 1;
    this.offsetX = 0;
    this.offsetY = 0;
    events.emit('zoomChanged', this.getTransform());
  }

  _bind() {
    if (!this.canvas) return;

    this.canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      this.zoom(e.deltaY > 0 ? 0.9 : 1.1, e.offsetX, e.offsetY);
    });

    this.canvas.addEventListener('dblclick', () => this.reset());

    this.canvas.addEventListener('mousedown', (e) => {
      this.isPanning = true;
      this.lastX = e.clientX;
      this.lastY = e.clientY;
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isPanning) return;
      this.offsetX += e.clientX - this.lastX;
      this.offsetY += e.clientY - this.lastY;
      this.lastX = e.clientX;
      this.lastY = e.clientY;
      events.emit('panChanged', this.getTransform());
    });

    window.addEventListener('mouseup', () => {
      this.isPanning = false;
    });
  }
}