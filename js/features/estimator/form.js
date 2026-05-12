'use strict';

/**
 * EstimatorForm — форма добавления позиции в смету
 * Семантические поля с label, кнопка Добавить
 * Фокус на "0" очищает поле, валидация с сообщениями под формой
 */

try {
  const EstimatorForm = {
    init() {
      const container = document.getElementById('estimator-form');
      if (!container) return;

      const form = document.createElement('form');
      form.id = 'add-item-form';
      form.setAttribute('novalidate', '');

      // Поле Название
      form.appendChild(this._createField('Название', 'item-name', 'text', 'Например: Штукатурка'));

      // Поле Ед. изм.
      form.appendChild(this._createField('Ед. изм.', 'item-unit', 'text', 'м², шт., пог.м'));

      // Поле Количество
      form.appendChild(this._createField('Количество', 'item-qty', 'number', '0', '0', 'step="any" min="0"'));

      // Поле Цена
      form.appendChild(this._createField('Цена', 'item-price', 'number', '0', '0', 'step="any" min="0"'));

      // Блок ошибок
      const errorDiv = document.createElement('div');
      errorDiv.id = 'form-error';
      errorDiv.style.color = 'var(--red-error, #D32F2F)';
      errorDiv.style.fontSize = '12px';
      errorDiv.style.marginTop = '8px';
      form.appendChild(errorDiv);

      // Кнопка Добавить
      const btn = document.createElement('button');
      btn.type = 'submit';
      btn.className = 'btn-primary';
      btn.textContent = 'Добавить';
      form.appendChild(btn);

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this._handleSubmit();
      });

      container.appendChild(form);

      // Навешиваем поведение на числовые поля
      this._setupNumericField('item-qty');
      this._setupNumericField('item-price');
    },

    _createField(labelText, id, type, placeholder, value = '', extraAttrs = '') {
      const wrapper = document.createElement('div');
      wrapper.className = 'form-field';

      const label = document.createElement('label');
      label.setAttribute('for', id);
      label.textContent = labelText;

      const input = document.createElement('input');
      input.type = type;
      input.id = id;
      input.name = id;
      input.className = 'input-field';
      input.placeholder = placeholder;
      input.value = value;
      if (extraAttrs) {
        const attrs = extraAttrs.split(' ');
        attrs.forEach(attr => {
          const [key, val] = attr.split('=');
          if (key && val) input.setAttribute(key, val.replace(/"/g, ''));
        });
      }

      wrapper.appendChild(label);
      wrapper.appendChild(input);
      return wrapper;
    },

    _setupNumericField(id) {
      const field = document.getElementById(id);
      if (!field) return;

      field.addEventListener('focus', () => {
        if (field.value === '0') {
          field.value = '';
        }
      });

      field.addEventListener('blur', () => {
        if (field.value.trim() === '') {
          field.value = '0';
        }
      });

      field.addEventListener('input', () => {
        // Удаляем всё, кроме цифр и точки
        field.value = field.value.replace(/[^0-9.]/g, '');
        // Запрещаем более одной точки
        if ((field.value.match(/\./g) || []).length > 1) {
          field.value = field.value.slice(0, -1);
        }
      });
    },

    _handleSubmit() {
      const name = document.getElementById('item-name').value.trim();
      const unit = document.getElementById('item-unit').value.trim();
      const qtyStr = document.getElementById('item-qty').value.trim();
      const priceStr = document.getElementById('item-price').value.trim();
      const errorDiv = document.getElementById('form-error');

      const qty = parseFloat(qtyStr);
      const price = parseFloat(priceStr);

      // Сброс ошибки
      errorDiv.textContent = '';

      if (!name) {
        errorDiv.textContent = 'Введите название';
        return;
      }
      if (!unit) {
        errorDiv.textContent = 'Введите единицу измерения';
        return;
      }
      if (isNaN(qty) || qty <= 0) {
        errorDiv.textContent = 'Количество должно быть больше 0';
        return;
      }
      if (isNaN(price) || price <= 0) {
        errorDiv.textContent = 'Цена должна быть больше 0';
        return;
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
    }
  };

  document.addEventListener('DOMContentLoaded', () => EstimatorForm.init());
  window.EstimatorForm = EstimatorForm;

} catch (error) {
  console.error('EstimatorForm init error:', error);
}