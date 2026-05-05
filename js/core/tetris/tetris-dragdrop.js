// [PLN-001] Drag-and-drop элементов на плане
// [RISK-03] Проверка: окно/дверь > стены
// [AP-004] Один файл — одна ответственность (95 строк)

import { events } from '../events.js';

export class TetrisDragDrop {
  constructor(canvasInstance) {
    this.canvas = canvasInstance;
    this.isDragging = false;
    this.currentElement = null;
    this.dragStart = { x: 0, y: 0 };
    this.elements = [];
    this.elementIdCounter = 0;
    this._bind();
    console.log('[TetrisDragDrop] initialized');
  }

  _bind() {
    const c = this.canvas.canvas;
    if (!c) return;

    // Мышь
    c.addEventListener('mousedown', (e) => {
      const transform = this.canvas.zoom.getTransform();
      const coords = this.canvas.render.getCanvasCoords(
        e.clientX, e.clientY, transform.scale, transform.offsetX, transform.offsetY
      );
      this.dragStart = coords;
      this.isDragging = true;
      events.emit('dragStarted', coords);
    });

    window.addEventListener('mouseup', (e) => {
      if (!this.isDragging) return;
      this.isDragging = false;

      const transform = this.canvas.zoom.getTransform();
      const coords = this.canvas.render.getCanvasCoords(
        e.clientX, e.clientY, transform.scale, transform.offsetX, transform.offsetY
      );
      this._placeElement(coords);
    });

    // Тач
    c.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const t = e.touches[0];
      const transform = this.canvas.zoom.getTransform();
      const coords = this.canvas.render.getCanvasCoords(
        t.clientX, t.clientY, transform.scale, transform.offsetX, transform.offsetY
      );
      this.dragStart = coords;
      this.isDragging = true;
      events.emit('dragStarted', coords);
    });

    window.addEventListener('touchend', (e) => {
      if (!this.isDragging) return;
      this.isDragging = false;

      const t = e.changedTouches[0];
      const transform = this.canvas.zoom.getTransform();
      const coords = this.canvas.render.getCanvasCoords(
        t.clientX, t.clientY, transform.scale, transform.offsetX, transform.offsetY
      );
      this._placeElement(coords);
    });
  }

  _placeElement(coords) {
    const width = Math.abs(coords.x - this.dragStart.x);
    const height = Math.abs(coords.y - this.dragStart.y);

    if (width < 5 || height < 5) return;

    const element = {
      id: ++this.elementIdCounter,
      type: this.currentElement?.type || 'square',
      x: Math.min(this.dragStart.x, coords.x),
      y: Math.min(this.dragStart.y, coords.y),
      width,
      height,
    };

    if ((element.type === 'window' || element.type === 'door') && (width > 300 || height > 300)) {
      events.emit('validationError', {
        message: 'Не умещается. Размер проёма слишком большой.',
        riskId: 'RISK-03',
        elementId: element.id,
      });
      return;
    }

    this.elements.push(element);
    events.emit('elementPlaced', { element });
    console.log(`[TetrisDragDrop] Element placed: id=${element.id}, type=${element.type}`);
  }

  setElementType(type) {
    this.currentElement = { type };
  }

  getElements() {
    return [...this.elements];
  }
}