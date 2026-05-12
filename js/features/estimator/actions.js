'use strict';

/**
 * EstimatorActions — центральный диспетчер операций с позициями сметы
 * Единственная точка для добавления, удаления, обновления позиций
 */

try {
  let _nextId = 1;

  const EstimatorActions = {
    /**
     * Добавить позицию в смету
     * @param {object} item - { name, unit, quantity, price, ... }
     * @returns {object} - добавленный элемент с числовым id
     */
    addItem(item) {
      if (!item || !item.name) {
        console.warn('EstimatorActions.addItem: требуется name');
        return null;
      }

      const newItem = {
        id: _nextId++,
        name: item.name,
        unit: item.unit || 'шт.',
        quantity: item.quantity || 0,
        price: item.price || 0,
        total: (item.quantity || 0) * (item.price || 0),
        category: item.category || 'Прочее',
        createdAt: new Date().toISOString()
      };

      EstimatorState.items.push(newItem);
      EstimatorTable.render();
      return newItem;
    },

    /**
     * Удалить позицию по id
     * @param {number} id
     */
    removeItem(id) {
      const index = EstimatorState.items.findIndex(item => item.id === id);
      if (index !== -1) {
        EstimatorState.items.splice(index, 1);
        EstimatorTable.render();
        return true;
      }
      console.warn('EstimatorActions.removeItem: id не найден', id);
      return false;
    },

    /**
     * Обновить позицию по id
     * @param {number} id
     * @param {object} data - частичные данные для обновления
     */
    updateItem(id, data) {
      const item = EstimatorState.items.find(item => item.id === id);
      if (!item) {
        console.warn('EstimatorActions.updateItem: id не найден', id);
        return null;
      }

      Object.assign(item, data);

      if (data.quantity !== undefined || data.price !== undefined) {
        item.total = item.quantity * item.price;
      }

      EstimatorTable.render();
      return item;
    },

    getAll() {
      return EstimatorState.items;
    }
  };

  window.EstimatorActions = EstimatorActions;

} catch (error) {
  console.error('EstimatorActions init error:', error);
}