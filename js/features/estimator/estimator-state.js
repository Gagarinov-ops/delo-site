// Управление состоянием, 60 строк
import { events } from '../../core/events.js';
import { materialsDB } from './materials.js';
import { calculateItemCost, renumberItems, hashItems, getTotal, generateItemId } from './estimator-calculations.js';

export class EstimatorState {
  constructor() { this.items = []; this.originalHash = null; this.isChanged = false; console.log('[EstimatorState] initialized'); }
  getItems() { return [...this.items]; }
  addItem(materialId, quantity) {
    const material = materialsDB.items.find(i => i.id === materialId); if (!material) return null;
    const qty = quantity || 1;
    const newItem = { id: generateItemId(), materialId, name: material.name, unit: material.unit, category: material.category, quantity: qty, pricePerUnit: material.pricePerUnit, total: calculateItemCost(materialId, qty), rowNumber: 0 };
    this.items.push(newItem); this.items = renumberItems(this.items); this._checkChanges(); this._emit('add', newItem.id); return newItem;
  }
  removeItem(itemId) {
    const removed = this.items.find(i => i.id === itemId); if (!removed) return false;
    this.items = this.items.filter(i => i.id !== itemId); this.items = renumberItems(this.items); this._checkChanges(); this._emit('remove', itemId); return true;
  }
  updateQuantity(itemId, quantity) {
    const item = this.items.find(i => i.id === itemId); if (!item || isNaN(quantity) || quantity <= 0) return false;
    item.quantity = parseFloat(quantity); item.total = calculateItemCost(item.materialId, item.quantity); this._checkChanges(); this._emit('update', itemId); return true;
  }
  markAsOriginal() { this.originalHash = hashItems(this.items); this.isChanged = false; }
  reset() { this.items = []; this.originalHash = null; this.isChanged = false; events.emit('estimatorUpdated', { items: [] }); events.emit('estimate:changed', { items: [], total: 0 }); }
  _checkChanges() { if (this.originalHash && hashItems(this.items) !== this.originalHash) { this.isChanged = true; events.emit('estimatorChanged', { isChanged: true, riskId: 'RISK-05' }); } }
  _emit(action, itemId) { const items = this.getItems(); events.emit('estimatorUpdated', { items, action, itemId }); events.emit('estimate:changed', { items, total: getTotal(items) }); }
}