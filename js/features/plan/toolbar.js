'use strict';

/**
 * Toolbar — панель инструментов
 * Кнопки: Курсор, Линия, Элементы, Отменить
 * Панель элементов генерируется из ElementLibrary
 * Сохраняет активный инструмент в delo_activeTool
 */

try {
  const Toolbar = {
    tools: [
      { id: 'cursor', label: '🖐 Курсор' },
      { id: 'line', label: '📏 Линия' }
    ],
    activeTool: null,
    elementsVisible: false,

    init() {
      this.render();
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

      // Кнопка Элементы
      const elemBtn = document.createElement('button');
      elemBtn.type = 'button';
      elemBtn.className = 'tool-btn elements-toggle';
      elemBtn.textContent = '📦 Элементы';
      elemBtn.setAttribute('aria-expanded', this.elementsVisible ? 'true' : 'false');
      elemBtn.addEventListener('click', () => this.toggleElements());
      panel.appendChild(elemBtn);

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

      // Панель элементов (если открыта)
      if (this.elementsVisible) {
        this.renderElementsPanel();
      }

      this.updateUndoButton();
    },

    toggleElements() {
      this.elementsVisible = !this.elementsVisible;
      this.render();
    },

    renderElementsPanel() {
      const container = document.querySelector('.tools-panel');
      if (!container) return;

      const wrapper = document.createElement('div');
      wrapper.className = 'elements-panel';

      ElementLibrary.forEach(item => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'tool-btn element-btn';
        btn.textContent = item.icon + ' ' + item.label;
        btn.dataset.elementType = item.type;
        btn.addEventListener('click', () => this.selectElement(item));
        wrapper.appendChild(btn);
      });

      container.appendChild(wrapper);
    },

    selectElement(item) {
      this.elementsVisible = false;
      this.render();
      DragDrop.activate(item);
    },

    setTool(toolId) {
      // Деактивируем DragDrop при переключении инструмента
      if (DragDrop && DragDrop.isActive) {
        DragDrop.deactivate();
      }

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
      Actions.undo();
    },

    updateUndoButton() {
      const btn = document.getElementById('undo-btn');
      if (btn) {
        btn.disabled = TetrisState.history.length === 0;
      }
    }
  };

  document.addEventListener('DOMContentLoaded', () => Toolbar.init());
  window.Toolbar = Toolbar;

} catch (error) {
  console.error('Toolbar init error:', error);
}