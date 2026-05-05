// [REF-005] Функции отрисовки canvas (85 строк)
// [PERF-002] Только видимые элементы
// [AP-004] Один файл — одна ответственность

export class TetrisRender {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.gridSize = 20;
    this.pixelsPerCm = 2;
    console.log('[TetrisRender] initialized');
  }

  drawGrid(scale, offsetX, offsetY) {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    ctx.clearRect(0, 0, w, h);
    ctx.save();
    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);

    ctx.fillStyle = '#F5F5F5';
    ctx.fillRect(-offsetX / scale, -offsetY / scale, w / scale, h / scale);

    ctx.strokeStyle = '#E0E0E0';
    ctx.lineWidth = 0.5;

    const step = this.gridSize * this.pixelsPerCm;
    const startX = Math.floor(-offsetX / scale / step) * step;
    const startY = Math.floor(-offsetY / scale / step) * step;
    const endX = startX + w / scale + step;
    const endY = startY + h / scale + step;

    for (let x = startX; x <= endX; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, startY);
      ctx.lineTo(x, endY);
      ctx.stroke();
    }

    for (let y = startY; y <= endY; y += step) {
      ctx.beginPath();
      ctx.moveTo(startX, y);
      ctx.lineTo(endX, y);
      ctx.stroke();
    }

    ctx.restore();
  }

  drawElements(elements, scale, offsetX, offsetY) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);

    elements.forEach(el => {
      ctx.strokeStyle = '#00A651';
      ctx.lineWidth = 1.5;
      ctx.fillStyle = 'rgba(0, 166, 81, 0.05)';

      if (el.type === 'circle') {
        ctx.beginPath();
        ctx.arc(el.x, el.y, el.radius || 30, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fill();
      } else {
        ctx.strokeRect(el.x, el.y, el.width || 50, el.height || 50);
        ctx.fillRect(el.x, el.y, el.width || 50, el.height || 50);
      }
    });

    ctx.restore();
  }

  /**
   * Пересчёт экранных координат в координаты canvas
   */
  getCanvasCoords(clientX, clientY, scale, offsetX, offsetY) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: (clientX - rect.left - offsetX) / scale,
      y: (clientY - rect.top - offsetY) / scale,
    };
  }
}