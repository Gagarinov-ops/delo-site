'use strict';

/**
 * DFSUtils — вспомогательные функции для DetectRoom
 * linesSharePoint, isClosed, getCenter, findAnyCycle, buildPath
 * findAnyCycle — многостартовый обход, не требует всех линий
 * Добавлен допуск 20px при сравнении точек (_pointsClose)
 */

try {
  const DFSUtils = {
    pointKey(x, y) {
      return `${x},${y}`;
    },

    /**
     * Проверка двух точек на близость с допуском tolerance (по каждой оси)
     */
    _pointsClose(x1, y1, x2, y2, tolerance = 20) {
      return Math.abs(x1 - x2) <= tolerance && Math.abs(y1 - y2) <= tolerance;
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

      if (this._pointsClose(last.x1, last.y1, prev.x1, prev.y1)) {
        lastOutX = last.x2; lastOutY = last.y2;
      } else if (this._pointsClose(last.x1, last.y1, prev.x2, prev.y2)) {
        lastOutX = last.x2; lastOutY = last.y2;
      } else if (this._pointsClose(last.x2, last.y2, prev.x1, prev.y1)) {
        lastOutX = last.x1; lastOutY = last.y1;
      } else {
        lastOutX = last.x1; lastOutY = last.y1;
      }

      return this._pointsClose(lastOutX, lastOutY, first.x1, first.y1) ||
             this._pointsClose(lastOutX, lastOutY, first.x2, first.y2);
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
        // Ищем линию, которая соединяется с текущей точкой (с допуском)
        let found = null;
        for (const line of allLines) {
          if (used.has(line)) continue;
          if (this._pointsClose(line.x1, line.y1, currentX, currentY) ||
              this._pointsClose(line.x2, line.y2, currentX, currentY)) {
            found = line;
            break;
          }
        }

        if (!found) break;

        path.push(found);
        used.add(found);

        // Определяем следующий выходной конец (противоположный тому, что совпал)
        if (this._pointsClose(found.x1, found.y1, currentX, currentY)) {
          currentX = found.x2;
          currentY = found.y2;
        } else {
          currentX = found.x1;
          currentY = found.y1;
        }

        // Проверяем замыкание на начало стартовой линии (с допуском)
        if (path.length >= 3 &&
            this._pointsClose(currentX, currentY, startLine.x1, startLine.y1)) {
          return path;
        }
        if (path.length >= 3 &&
            this._pointsClose(currentX, currentY, startLine.x2, startLine.y2)) {
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