'use strict';

/**
 * DFSUtils — вспомогательные функции для DetectRoom
 * linesSharePoint, isClosed, getCenter, findAnyCycle, buildPath
 * findAnyCycle — многостартовый обход, не требует всех линий
 */

try {
  const DFSUtils = {
    pointKey(x, y) {
      return `${x},${y}`;
    },

    linesSharePoint(a, b) {
      return (a.x1 === b.x1 && a.y1 === b.y1) ||
             (a.x1 === b.x2 && a.y1 === b.y2) ||
             (a.x2 === b.x1 && a.y2 === b.y1) ||
             (a.x2 === b.x2 && a.y2 === b.y2);
    },

    isClosed(walls) {
      if (walls.length < 3) return false;
      const first = walls[0];
      const last = walls[walls.length - 1];

      if (walls.length === 1) return false;

      const prev = walls[walls.length - 2];
      let lastOutX, lastOutY;

      if (last.x1 === prev.x1 && last.y1 === prev.y1) {
        lastOutX = last.x2; lastOutY = last.y2;
      } else if (last.x1 === prev.x2 && last.y1 === prev.y2) {
        lastOutX = last.x2; lastOutY = last.y2;
      } else if (last.x2 === prev.x1 && last.y2 === prev.y1) {
        lastOutX = last.x1; lastOutY = last.y1;
      } else {
        lastOutX = last.x1; lastOutY = last.y1;
      }

      return (lastOutX === first.x1 && lastOutY === first.y1) ||
             (lastOutX === first.x2 && lastOutY === first.y2);
    },

    getCenter(walls) {
      let sumX = 0, sumY = 0, count = 0;
      walls.forEach(w => {
        sumX += w.x1 + w.x2;
        sumY += w.y1 + w.y2;
        count += 2;
      });
      return { x: sumX / count, y: sumY / count };
    },

    /**
     * Перебирает каждую линию как стартовую, ищет цикл
     * @param {Array} allLines — все линии типа 'line' из shapes
     * @returns {Array|null} — массив линий цикла или null
     */
    findAnyCycle(allLines) {
      for (const startLine of allLines) {
        const path = this.buildPath(startLine, allLines);
        if (path && path.length >= 3 && this.isClosed(path)) {
          return path;
        }
      }
      return null;
    },

    /**
     * Строит цепочку соединённых линий от стартовой
     * @param {object} startLine — линия, с которой начинаем
     * @param {Array} allLines — все доступные линии
     * @returns {Array|null} — путь или null
     */
    buildPath(startLine, allLines) {
      // Пробуем оба направления стартовой линии
      let result = this._extendFromEnd(startLine, allLines, startLine.x2, startLine.y2);
      if (result) return result;

      result = this._extendFromEnd(startLine, allLines, startLine.x1, startLine.y1);
      return result;
    },

    /**
     * Строит путь, начиная с указанного конца стартовой линии
     */
    _extendFromEnd(startLine, allLines, outX, outY) {
      const path = [startLine];
      const used = new Set();
      used.add(startLine);

      let currentX = outX;
      let currentY = outY;

      while (true) {
        // Ищем линию, которая соединяется с текущей точкой
        let found = null;
        for (const line of allLines) {
          if (used.has(line)) continue;
          if ((line.x1 === currentX && line.y1 === currentY) ||
              (line.x2 === currentX && line.y2 === currentY)) {
            found = line;
            break;
          }
        }

        if (!found) break;

        path.push(found);
        used.add(found);

        // Определяем следующий выходной конец
        if (found.x1 === currentX && found.y1 === currentY) {
          currentX = found.x2;
          currentY = found.y2;
        } else {
          currentX = found.x1;
          currentY = found.y1;
        }

        // Проверяем замыкание на начало стартовой линии
        if (path.length >= 3 &&
            currentX === startLine.x1 && currentY === startLine.y1) {
          return path;
        }
        if (path.length >= 3 &&
            currentX === startLine.x2 && currentY === startLine.y2) {
          return path;
        }
      }

      return null;
    }
  };

  window.DFSUtils = DFSUtils;

} catch (error) {
  console.error('DFSUtils init error:', error);
}