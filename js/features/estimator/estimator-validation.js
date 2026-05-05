// [REF-002] Проверки и валидация сметы (50 строк)
// [RISK-04], [RISK-16]

import { isEstimateEmpty } from './estimator-calculations.js';
import { materialsDB } from './materials.js';

export class EstimatorValidation {
  constructor() {
    console.log('[EstimatorValidation] initialized');
  }

  canProceed(items) {
    if (isEstimateEmpty(items)) {
      return {
        canProceed: false,
        reason: 'Смета пуста. Добавьте хотя бы одну позицию.',
        riskId: 'RISK-04',
      };
    }
    return { canProceed: true };
  }

  validateItem(materialId, quantity) {
    const errors = [];

    if (!materialId) errors.push('Не выбран материал');
    if (!quantity || quantity <= 0) errors.push('Количество должно быть > 0');
    if (materialId && !materialsDB.items.find(i => i.id === materialId)) {
      errors.push('Материал не найден в справочнике');
    }

    return { valid: errors.length === 0, errors };
  }

  validateMinAmount(total) {
    if (total <= 0) {
      return {
        valid: false,
        message: 'Сумма договора не может быть нулевой',
        riskId: 'RISK-16',
      };
    }
    return { valid: true };
  }

  validateItemLimit(items, max = 100) {
    if (items.length > max) {
      return {
        valid: false,
        message: `Максимальное количество позиций: ${max}. Сейчас: ${items.length}`,
      };
    }
    return { valid: true };
  }

  validateAll(items) {
    const proceed = this.canProceed(items);
    if (!proceed.canProceed) return proceed;

    const limit = this.validateItemLimit(items);
    if (!limit.valid) return limit;

    return { valid: true };
  }
}