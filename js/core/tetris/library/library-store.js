// Список элементов, 30 строк
export class LibraryStore {
  constructor() {
    this.items = [
      { id: 'circle', name: 'Кружок', category: 'фигуры', icon: '○' },
      { id: 'square', name: 'Квадрат', category: 'фигуры', icon: '□' },
      { id: 'line', name: 'Линия', category: 'фигуры', icon: '─' },
      { id: 'window', name: 'Окно', category: 'проёмы', icon: '🪟' },
      { id: 'door', name: 'Дверь', category: 'проёмы', icon: '🚪' },
      { id: 'arc', name: 'Дуга', category: 'фигуры', icon: '⌒' },
      { id: 'hinge', name: 'Шарнир', category: 'соединения', icon: '⚙️' },
      { id: 'chandelier', name: 'Люстра', category: 'освещение', icon: '💡' },
      { id: 'track', name: 'Трек', category: 'освещение', icon: '📌' },
      { id: 'spot', name: 'Точечный', category: 'освещение', icon: '⊙' },
    ];
    console.log('[LibraryStore] initialized');
  }
  getItems(cat = null) { return cat ? this.items.filter(i => i.category === cat) : [...this.items]; }
  getItem(id) { return this.items.find(i => i.id === id); }
  getCategories() { return [...new Set(this.items.map(i => i.category))]; }
}