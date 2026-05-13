// План: валидация размеров, сохранение комнат в store.plan, 80 строк
(function() {
  console.log('[Plan] Script loaded');
  const length = document.getElementById('room-length'), width = document.getElementById('room-width'), next = document.getElementById('plan-next-btn'), calc = document.getElementById('calculate-plan-btn'), warn = document.getElementById('contour-warning');
  
  function validate() {
    const l = parseFloat(length?.value||0), w = parseFloat(width?.value||0);
    if (l <= 0 || w <= 0) { 
      if (warn) { warn.textContent = 'Длина и ширина должны быть > 0'; warn.style.display = 'block'; } 
      if (next) next.disabled = true; 
      if (calc) calc.disabled = true; 
      return false; 
    }
    if (warn) warn.style.display = 'none'; 
    if (next) next.disabled = false; 
    if (calc) calc.disabled = false; 
    return true;
  }
  
  [length, width].forEach(el => el?.addEventListener('input', validate));
  
  calc?.addEventListener('click', () => { 
    if (!validate()) return;
    
    // Собираем комнаты из TetrisState
    const rooms = (typeof TetrisState !== 'undefined' && TetrisState.shapes) 
      ? TetrisState.shapes.filter(s => s.type === 'room').map(room => {
          const pxToM = 0.005; // 1px = 0.5cm = 0.005m
          const wallHeight = 2.5; // высота по умолчанию
          const walls = room.walls.map(w => {
            const dx = w.x2 - w.x1;
            const dy = w.y2 - w.y1;
            const lengthPx = Math.hypot(dx, dy);
            const lengthM = lengthPx * pxToM;
            const area = lengthM * wallHeight;
            return {
              name: w.name,
              x1: w.x1, y1: w.y1,
              x2: w.x2, y2: w.y2,
              lengthPx,
              lengthM: Math.round(lengthM * 100) / 100,
              area: Math.round(area * 100) / 100
            };
          });
          const totalArea = walls.reduce((s, w) => s + w.area, 0);
          return {
            label: room.label || 'Без названия',
            walls,
            totalArea: Math.round(totalArea * 100) / 100
          };
        })
      : [];
    
    // Сохраняем в store.plan через dispatch
    if (window.App && window.App.store) {
      window.App.store.dispatch('SET_PLAN', { rooms });
      // Переход на смету
      if (window.App.router) {
        window.App.router.navigate('estimate');
      } else {
        window.location.href = 'estimate.html';
      }
    }
  });
})();