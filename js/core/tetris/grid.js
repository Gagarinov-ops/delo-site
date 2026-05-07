'use strict';
const Grid = {
  canvas: null,
  ctx: null,
  CELL_SIZE: 20,

  init() {
    const container = document.getElementById('tetris-container');
    if (!container) return;

    // Создаём canvas, если его ещё нет
    if (!this.canvas) {
      this.canvas = document.createElement('canvas');
      this.canvas.id = 'tetris-canvas';
      this.canvas.width = container.clientWidth || 343;
      this.canvas.height = container.clientHeight || 300;
      this.canvas.style.display = 'block';
      this.canvas.style.width = '100%';
      this.canvas.style.height = '100%';
      container.appendChild(this.canvas);
      this.ctx = this.canvas.getContext('2d');
    }

    // Создаём подпись, если её нет
    if (!document.getElementById('grid-label')) {
      const label = document.createElement('div');
      label.id = 'grid-label';
      label.style.textAlign = 'center';
      label.style.fontSize = '12px';
      label.style.color = '#666666';
      label.style.marginTop = '4px';
      container.parentNode.insertBefore(label, container.nextSibling);
    }
  },

  draw() {
    this.init();
    if (!this.ctx) return;

    const w = this.canvas.width;
    const h = this.canvas.height;
    const step = this.CELL_SIZE;

    // Белый фон
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.fillRect(0, 0, w, h);

    // Линии сетки
    this.ctx.strokeStyle = '#E0E0E0';
    this.ctx.lineWidth = 0.5;

    // Вертикальные линии
    for (let x = 0; x <= w; x += step) {
      this.ctx.beginPath();
      this.ctx.moveTo(x + 0.5, 0);
      this.ctx.lineTo(x + 0.5, h);
      this.ctx.stroke();
    }

    // Горизонтальные линии
    for (let y = 0; y <= h; y += step) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y + 0.5);
      this.ctx.lineTo(w, y + 0.5);
      this.ctx.stroke();
    }

    // Обновляем подпись
    const label = document.getElementById('grid-label');
    if (label) {
      label.textContent = '1 клетка = 10 см';
    }
  }
};