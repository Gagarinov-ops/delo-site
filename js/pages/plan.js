// План: новая логика активации кнопки «Рассчитать» и скрытие кнопки «Собрать»
(function() {
  console.log('[Plan] Script loaded');
  
  const calc = document.getElementById('calculate-plan-btn');
  const warn = document.getElementById('contour-warning');

  // Скрываем кнопку «Собрать» (она создаётся в stitch.js)
  setTimeout(() => {
    const stitchBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Собрать'));
    if (stitchBtn) stitchBtn.style.display = 'none';
  }, 0);

  // Проверка, есть ли комната с реальной площадью
  function hasRoomWithArea() {
    if (typeof TetrisState === 'undefined' || !TetrisState.shapes) return false;
    const room = TetrisState.shapes.find(s => s.type === 'room');
    if (!room) return false;
    const walls = room.walls;
    if (!walls || walls.length < 3) return false;
    const pxToM = 0.005;
    const lengthsM = walls.map(w => {
      if (typeof w.realLength === 'number' && w.realLength > 0) return w.realLength;
      const dx = w.x2 - w.x1, dy = w.y2 - w.y1;
      return Math.hypot(dx, dy) * pxToM;
    });
    if (lengthsM.length >= 2) {
      const area = lengthsM[0] * lengthsM[1];
      return area > 0;
    }
    return false;
  }

  // Регулярно обновляем состояние кнопки
  setInterval(() => {
    if (!calc) return;
    const enabled = hasRoomWithArea();
    calc.disabled = !enabled;
    if (warn) {
      if (!enabled && TetrisState.shapes && TetrisState.shapes.some(s => s.type === 'room')) {
        warn.textContent = 'Введите длины стен для расчёта площади';
        warn.style.display = 'block';
      } else if (!enabled) {
        warn.style.display = 'none';
      } else {
        warn.style.display = 'none';
      }
    }
  }, 500);

  // Обработчик нажатия кнопки «Рассчитать»
  calc?.addEventListener('click', () => {
    if (!hasRoomWithArea()) {
      if (warn) {
        warn.textContent = 'Сначала создайте комнату и задайте размеры стен';
        warn.style.display = 'block';
      }
      return;
    }
    
    // Собираем данные комнат
    const rooms = TetrisState.shapes.filter(s => s.type === 'room').map(room => {
      const pxToM = 0.005;
      const wallHeight = 2.5;
      const walls = room.walls.map(w => {
        const dx = w.x2 - w.x1, dy = w.y2 - w.y1;
        const lengthPx = Math.hypot(dx, dy);
        const lengthM = w.realLength || lengthPx * pxToM;
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
        contourId: room.contourId,
        label: room.label || 'Без названия',
        walls,
        totalArea: Math.round(totalArea * 100) / 100
      };
    });

    // Сохраняем в store.plan через dispatch
    if (window.App && window.App.store) {
      window.App.store.dispatch('SET_PLAN', { rooms });
      if (window.App.router) {
        window.App.router.navigate('estimate');
      } else {
        window.location.href = 'estimate.html';
      }
    }
  });
})();