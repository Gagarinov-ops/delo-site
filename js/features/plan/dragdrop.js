'use strict';

/**
 * DragDrop — размещение готовых элементов на canvas
 * Выбор из каталога → элемент следует за курсором → клик фиксирует
 * Типы: hline (2 клетки), vline (2 клетки), corner (2×2 клетки)
 */

try {
  const DragDrop = {
    activeElement: null,
    previewX: 0,
    previewY: 0,
    isActive: false,

    /**
     * Активировать режим размещения элемента
     */
    activate(elementConfig) {
      this.activeElement = elementConfig;
      this.isActive = true;
      this.setCursor('crosshair');
      this.bindEvents();
    },

    /**
     * Деактивировать режим
     */
    deactivate() {
      this.activeElement = null;
      this.isActive = false;
      this.setCursor('default');
      this.unbindEvents();
      Grid.draw();
      Render.drawAll();
    },

    /**
     * Подключить события мыши
     */
    bindEvents() {
      this._onMove = (e) => this.onMove(e);
      this._onClick = (e) => this.onClick(e);
      this._onLeave = () => this.onLeave();

      Grid.canvas.addEventListener('pointermove', this._onMove);
      Grid.canvas.addEventListener('pointerup', this._onClick);
      Grid.canvas.addEventListener('pointerleave', this._onLeave);
    },

    /**
     * Отключить события
     */
    unbindEvents() {
      if (this._onMove) Grid.canvas.removeEventListener('pointermove', this._onMove);
      if (this._onClick) Grid.canvas.removeEventListener('pointerup', this._onClick);
      if (this._onLeave) Grid.canvas.removeEventListener('pointerleave', this._onLeave);
    },

    /**
     * Получить координаты canvas с учётом масштаба
     */
    getCanvasCoords(e) {
      const canvas = Grid.canvas;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
      };
    },

    /**
     * Движение мыши — обновление превью
     */
    onMove(e) {
      if (!this.isActive || !this.activeElement) return;
      e.preventDefault();

      const coords = this.getCanvasCoords(e);
      const step = getCellSize('cm');
      const snapped = snap(coords.x, coords.y, step);

      this.previewX = snapped.x;
      this.previewY = snapped.y;

      this.showPreview();
    },

    /**
     * Клик — фиксация элемента
     */
    onClick(e) {
      if (!this.isActive || !this.activeElement) return;
      e.preventDefault();

      const coords = this.getCanvasCoords(e);
      const step = getCellSize('cm');
      const snapped = snap(coords.x, coords.y, step);

      Actions.addElement(this.activeElement.type, snapped.x, snapped.y);
      this.deactivate();
    },

    /**
     * Курсор ушёл с canvas — убираем превью
     */
    onLeave() {
      if (!this.isActive) return;
      Grid.draw();
      Render.drawAll();
    },

    /**
     * Показать превью элемента
     */
    showPreview() {
      Grid.draw();
      Render.drawAll();

      if (!this.isActive || !this.activeElement) return;

      const ctx = Grid.ctx;
      if (!ctx) return;

      const px = this.previewX;
      const py = this.previewY;
      const step = getCellSize('cm');
      const len = this.activeElement.defaultLength * step;

      ctx.strokeStyle = '#00A651';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 3]);

      switch (this.activeElement.type) {
        case 'hline':
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(px + len, py);
          ctx.stroke();
          break;

        case 'vline':
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(px, py + len);
          ctx.stroke();
          break;

        case 'corner':
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(px + len, py);
          ctx.lineTo(px + len, py + len);
          ctx.stroke();
          break;
      }

      ctx.setLineDash([]);

      // Точка привязки
      ctx.fillStyle = '#00A651';
      ctx.beginPath();
      ctx.arc(px, py, 4, 0, Math.PI * 2);
      ctx.fill();
    },

    /**
     * Установить курсор на canvas
     */
    setCursor(style) {
      if (Grid.canvas) {
        Grid.canvas.style.cursor = style;
      }
    }
  };

  window.DragDrop = DragDrop;

} catch (error) {
  console.error('DragDrop init error:', error);
}