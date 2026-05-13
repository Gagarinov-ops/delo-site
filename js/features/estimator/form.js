'use strict';

/**
 * EstimatorForm — форма добавления позиции в смету
 * Семантические поля с label, кнопка Добавить
 * Фокус на "0" очищает поле, валидация делегирована в FormValidation
 */

try {
  const EstimatorForm = {
    init() {
      const container = document.getElementById('estimator-form');
      if (!container) return;

      const form = document.createElement('form');
      form.id = 'add-item-form';
      form.setAttribute('novalidate', '');

      form.appendChild(this._createField('Название', 'item-name', 'text', 'Например: Штукатурка'));
      form.appendChild(this._createField('Ед. изм.', 'item-unit', 'text', 'м², шт., пог.м'));
      form.appendChild(this._createField('Количество', 'item-qty', 'number', '0', '0', 'step="any" min="0"'));
      form.appendChild(this._createField('Цена', 'item-price', 'number', '0', '0', 'step="any" min="0"'));

      const errorDiv = document.createElement('div');
      errorDiv.id = 'form-error';
      errorDiv.style.color = 'var(--red-error, #D32F2F)';
      errorDiv.style.fontSize = '12px';
      errorDiv.style.marginTop = '8px';
      form.appendChild(errorDiv);

      const btn = document.createElement('button');
      btn.type = 'submit';
      btn.className = 'btn-primary';
      btn.textContent = 'Добавить';
      form.appendChild(btn);

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        FormValidation.validateAndAdd();
      });

      container.appendChild(form);

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
        if (field.value === '0') field.value = '';
      });

      field.addEventListener('blur', () => {
        if (field.value.trim() === '') field.value = '0';
      });

      field.addEventListener('input', () => {
        field.value = field.value.replace(/[^0-9.]/g, '');
        if ((field.value.match(/\./g) || []).length > 1) {
          field.value = field.value.slice(0, -1);
        }
      });
    }
  };

  document.addEventListener('DOMContentLoaded', () => EstimatorForm.init());
  window.EstimatorForm = EstimatorForm;

} catch (error) {
  console.error('EstimatorForm init error:', error);
}