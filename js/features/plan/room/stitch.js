'use strict';

/**
 * Stitch — кнопка «Собрать» и логика сборки линий в комнаты
 * Режим «Сначала эскиз, потом Собрать»
 * Пока заглушка: передаёт линии в GeometryConnector
 */

try {
  const Stitch = {
    init() {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = '🔧 Собрать';
      btn.className = 'btn-primary';
      btn.style.marginTop = '8px';
      btn.style.width = '100%';
      btn.addEventListener('click', () => this.stitch());

      const figure = document.getElementById('tetris-container');
      if (figure && figure.parentNode) {
        figure.parentNode.insertBefore(btn, figure.nextSibling);
      }
    },

    collectLines() {
      return (TetrisState.shapes || []).filter(s => s.type === 'line');
    },

    stitch() {
      const lines = this.collectLines();
      if (lines.length < 2) {
        alert('Нужно минимум 2 линии для сборки');
        return;
      }
      console.log('🟢 Stitch: передаю линии в GeometryConnector', lines);
      GeometryConnector.stitch(lines);
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    Stitch.init();
  });

  window.Stitch = Stitch;

} catch (error) {
  console.error('Stitch init error:', error);
}