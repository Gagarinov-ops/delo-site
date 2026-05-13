'use strict';

/**
 * FormValidation — модуль валидации формы и добавления позиции
 * validateAndAdd() выполняет проверки и вызывает EstimatorActions.addItem()
 */

try {
  const FormValidation = {
    validateAndAdd() {
      const name = document.getElementById('item-name').value.trim();
      const unit = document.getElementById('item-unit').value.trim();
      const qtyStr = document.getElementById('item-qty').value.trim();
      const priceStr = document.getElementById('item-price').value.trim();
      const errorDiv = document.getElementById('form-error');

      const qty = parseFloat(qtyStr);
      const price = parseFloat(priceStr);

      errorDiv.textContent = '';

      if (!name) {
        errorDiv.textContent = 'Введите название';
        return false;
      }
      if (!unit) {
        errorDiv.textContent = 'Введите единицу измерения';
        return false;
      }
      if (isNaN(qty) || qty <= 0) {
        errorDiv.textContent = 'Количество должно быть больше 0';
        return false;
      }
      if (isNaN(price) || price <= 0) {
        errorDiv.textContent = 'Цена должна быть больше 0';
        return false;
      }

      EstimatorActions.addItem({
        name: name,
        unit: unit,
        quantity: qty,
        price: price
      });

      // Очистка полей
      document.getElementById('item-name').value = '';
      document.getElementById('item-unit').value = '';
      document.getElementById('item-qty').value = '0';
      document.getElementById('item-price').value = '0';
      return true;
    }
  };

  window.FormValidation = FormValidation;

} catch (error) {
  console.error('FormValidation init error:', error);
}