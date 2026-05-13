'use strict';

/**
 * WallInput — поле ввода длины стены.
 * По умолчанию 0, выделяется при фокусе, позиционируется рядом со стеной,
 * не выходя за границы canvas и экрана.
 */

try {
  const WallInput = {
    active: false,
    isApplying: false,
    room: null,
    wall: null,
    wallIndex: -1,
    input: null,

    show(room, wall, index) {
      this.hide();
      this.active = true;
      this.room = room;
      this.wall = wall;
      this.wallIndex = index;

      const canvas = Grid.canvas;
      const rect = canvas.getBoundingClientRect();
      const scaleX = rect.width / canvas.width;
      const scaleY = rect.height / canvas.height;
      const midX = (wall.x1 + wall.x2) / 2;
      const midY = (wall.y1 + wall.y2) / 2;
      const pointScreenX = rect.left + midX * scaleX;
      const pointScreenY = rect.top + midY * scaleY;

      const input = document.createElement('input');
      input.type = 'number';
      input.className = 'input-field wall-length-input';
      input.placeholder = 'Длина (м)';
      input.value = '0';
      input.style.position = 'absolute';
      input.style.width = '80px';
      input.style.fontSize = '14px';
      input.style.zIndex = '1000';
      // временно в DOM для измерения высоты
      input.style.visibility = 'hidden';
      document.body.appendChild(input);
      const inputHeight = input.offsetHeight || 36;
      const inputWidth = 80;
      input.style.visibility = '';

      const padding = 6;
      let left = pointScreenX;
      let top = pointScreenY;

      // горизонтальное размещение
      if (pointScreenX + inputWidth + padding <= rect.right) {
        left = pointScreenX;
      } else if (pointScreenX - inputWidth - padding >= rect.left) {
        left = pointScreenX - inputWidth;
      } else {
        left = rect.right - inputWidth - padding;
      }
      // вертикальное размещение
      if (pointScreenY + inputHeight + padding <= rect.bottom) {
        top = pointScreenY;
      } else if (pointScreenY - inputHeight - padding >= rect.top) {
        top = pointScreenY - inputHeight;
      } else {
        top = rect.bottom - inputHeight - padding;
      }

      // гарантируем, что поле не выйдет за пределы экрана
      left = Math.max(0, Math.min(left, window.innerWidth - inputWidth));
      top = Math.max(0, Math.min(top, window.innerHeight - inputHeight));

      input.style.left = left + 'px';
      input.style.top = top + 'px';

      input.addEventListener('focus', () => input.select());
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { e.preventDefault(); this.apply(); }
        if (e.key === 'Escape') { this.hide(); }
      });
      input.addEventListener('blur', () => this.apply());

      document.body.appendChild(input);
      this.input = input;
      input.focus();
    },

    apply() {
      if (this.isApplying) return;
      if (!this.active || !this.input || !this.wall || !this.room) return;

      const valM = parseFloat(this.input.value);
      if (isNaN(valM) || valM <= 0) { this.hide(); return; }

      this.isApplying = true;
      try {
        this.wall.realLength = valM;
        Grid.draw();
        Render.drawAll();
        if (typeof InfoBox !== 'undefined') InfoBox.update();
        this.hide();
      } finally {
        this.isApplying = false;
      }
    },

    hide() {
      if (this.input) {
        if (this.input.parentNode) {
          this.input.remove();
        }
        this.input = null;
      }
      this.active = false;
      this.room = null;
      this.wall = null;
      this.wallIndex = -1;
      this.isApplying = false;
    }
  };

  window.WallInput = WallInput;

} catch (error) {
  console.error('WallInput init error:', error);
}