// Чистые функции, 50 строк
import { materialsDB } from './materials.js';
export function calculateItemCost(materialId, quantity) { const item = materialsDB.items.find(i => i.id === materialId); return item ? item.pricePerUnit * (quantity||1) : 0; }
export function getTotal(items) { return items.reduce((s, i) => s + (i.total||0), 0); }
export function getTotalByCategory(items, catId) { return items.filter(i => i.category === catId).reduce((s, i) => s + (i.total||0), 0); }
export function hashItems(items) { const str = JSON.stringify(items.map(i => ({ id: i.materialId, q: i.quantity, p: i.pricePerUnit }))); let h = 0; for (let i = 0; i < str.length; i++) { h = ((h << 5) - h) + str.charCodeAt(i); h |= 0; } return h.toString(); }
export function renumberItems(items) { return items.map((item, idx) => ({ ...item, rowNumber: idx + 1 })); }
export function isEstimateEmpty(items) { return !items?.length; }
let counter = 0;
export function generateItemId() { return 'item_' + (++counter) + '_' + Date.now(); }