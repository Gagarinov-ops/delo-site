'use strict';

/**
 * ElementLibrary — каталог готовых элементов
 * Каждый элемент: type, label, icon, defaultLength (в клетках по 10 см)
 */

const ElementLibrary = [
  { type: 'hline',        label: '— Горизонтальная', icon: '—',   defaultLength: 2 },
  { type: 'vline',        label: '| Вертикальная',   icon: '|',   defaultLength: 2 },
  { type: 'corner',       label: '∟ Уголок',         icon: '∟',   defaultLength: 2 },
  { type: 'door-block',   label: '🚪 Дверь',         icon: '🚪', width: 2, height: 1 },
  { type: 'window-block', label: '🪟 Окно',          icon: '🪟', width: 2, height: 0.5 }
];