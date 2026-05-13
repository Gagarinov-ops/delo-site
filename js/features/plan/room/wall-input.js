'use strict';

/**
 * WallInput — поле ввода длины стены
 * Показ, скрытие, обработка событий, вызов геометрии через GeometryConnector
 * Флаг isApplying предотвращает двойной вызов apply()
 * Геометрия временно отключена (режим «Собрать»)
 */

try {
  const WallInput = {
    active: false,
    isApplying: false,   // сторожевой флаг
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

      const rect = Grid.canvas.getBoundingClientRect();
      const scaleX = rect.width / Grid.canvas.width;
      const scaleY = rect.height / Grid.canvas.height;
      const midX = (wall.x1 + wall.x2) / 2;
      const midY = (wall.y1 + wall.y2) / 2;
      const screenX = rect.left + midX * scaleX;
      const screenY = rect.top + midY * scaleY;

      const input = document.createElement('input');
      input.type = 'number';
      input.className = 'input-field wall-length-input';
      input.placeholder = 'Длина (м)';
      const pxToM = 0.005;
      const dx = wall.x2 - wall.x1;
      const dy = wall.y2 - wall.y1;
      input.value = (Math.hypot(dx, dy) * pxToM).toFixed(2);
      input.style.position = 'absolute';
      input.style.left = screenX + 'px';
      input.style.top = screenY + 'px';
      input.style.width = '90px';
      input.style.zIndex = '1000';
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
      if (this.isApplying) return;      // уже выполняется
      if (!this.active || !this.input || !this.wall || !this.room) return;

      const valM = parseFloat(this.input.value);
      if (isNaN(valM) || valM <= 0) { this.hide(); return; }

      this.isApplying = true;
      try {
        // Временно отключено. Будет использоваться в режиме «Собрать».
        // const pxToM = 0.005;
        // const newLengthPx = valM / pxToM;
        // const roomId = this.room.contourId;
        // const joints = GeometryConnector.applyWallLength(roomId, this.wallIndex, newLengthPx);
        //
        // if (joints && this.room.walls) {
        //   const walls = this.room.walls;
        //   const n = joints.length;
        //   for (let i = 0; i < n; i++) {
        //     const wall = walls[i];
        //     const p1 = joints[i];
        //     const p2 = joints[(i + 1) % n];
        //     wall.x1 = p1.x;
        //     wall.y1 = p1.y;
        //     wall.x2 = p2.x;
        //     wall.y2 = p2.y;
        //     const lenPx = Math.hypot(p2.x - p1.x, p2.y - p1.y);
        //     wall.length = parseFloat((lenPx * pxToM).toFixed(3));
        //   }
        //   if (this.room.center) {
        //     let sx = 0, sy = 0, cnt = 0;
        //     joints.forEach(p => { sx += p.x; sy += p.y; cnt++; });
        //     this.room.center.x = sx / cnt;
        //     this.room.center.y = sy / cnt;
        //   }
        // }
        // Grid.draw();
        // Render.drawAll();
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