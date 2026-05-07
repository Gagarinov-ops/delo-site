'use strict';

/**
 * Toolbar — панель инструментов
 * Три режима: cursor, line
 * Кнопка Отменить управляет TetrisState.shapes
 * Сохраняет активный инструмент в delo_activeTool
 */

try {
  const Toolbar = {
    tools: [
      { id: 'cursor', label: '🖐 Курсор' },
      { id: 'line', label: '📏 Линия' }
    ],
    activeTool: null,

    init() {
      this.render();
      this.updateUndoButton();
    },

    render() {
      const panel = document.querySelector('.tools-panel');
      if (!panel) return;

      panel.innerHTML = '';

      // Кнопки инструментов
      this.tools.forEach(tool => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'tool-btn';
        btn.textContent = tool.label;
        btn.dataset.tool = tool.id;
        btn.setAttribute('aria-pressed', tool.id === this.activeTool ? 'true' : 'false');

        if (tool.id === this.activeTool) {
          btn.classList.add('active');
        }

        btn.addEventListener('click', () => this.setTool(tool.id));
        panel.appendChild(btn);
      });

      // Разделитель
      const sep = document.createElement('span');
      sep.className = 'tool-separator';
      sep.textContent = '|';
      panel.appendChild(sep);

      // Кнопка Отменить
      const undoBtn = document.createElement('button');
      undoBtn.type = 'button';
      undoBtn.className = 'tool-btn undo-btn';
      undoBtn.id = 'undo-btn';
      undoBtn.textContent = '↩ Отменить';
      undoBtn.disabled = true;
      undoBtn.addEventListener('click', () => this.undo());
      panel.appendChild(undoBtn);

      this.updateUndoButton();
    },

    setTool(toolId) {
      if (this.activeTool === toolId) {
        this.activeTool = null;
      } else {
        this.activeTool = toolId;
      }
      localStorage.setItem('delo_activeTool', this.activeTool || '');
      this.render();
    },

    getActiveTool() {
      return this.activeTool;
    },

    undo() {
      if (TetrisState.shapes.length > 0) {
        TetrisState.shapes.pop();
        Grid.draw();
        if (window.Render && Render.drawAll) {
          Render.drawAll();
        }
        this.updateUndoButton();
      }
    },

    updateUndoButton() {
      const btn = document.getElementById('undo-btn');
      if (btn) {
        btn.disabled = TetrisState.shapes.length === 0;
      }
    }
  };

  document.addEventListener('DOMContentLoaded', () => Toolbar.init());
  window.Toolbar = Toolbar;

} catch (error) {
  console.error('Toolbar init error:', error);
}