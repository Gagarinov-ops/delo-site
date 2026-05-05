// Валидация форм, 45 строк
export class Validator {
  constructor() {
    this.rules = {
      phone: { pattern: /^\+7\d{10}$/, message: 'Формат: +7XXXXXXXXXX' },
      email: { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Некорректный email' },
      required: { test: v => v?.trim().length > 0, message: 'Обязательное поле' },
      password: { test: v => v?.length >= 6, message: 'Минимум 6 символов' },
      positiveNumber: { test: v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, message: 'Должно быть > 0' },
    };
    console.log('[Validator] initialized');
  }
  validateField(value, ruleName) { const r = this.rules[ruleName]; if (!r) return { valid: true }; const valid = r.pattern ? r.pattern.test(value||'') : r.test ? r.test(value||'') : true; return { valid, message: valid ? '' : r.message }; }
  validateForm(data, rules) { const errors = {}; Object.keys(rules).forEach(f => { const r = this.validateField(data[f]||'', rules[f]); if (!r.valid) errors[f] = r.message; }); return { isValid: !Object.keys(errors).length, errors }; }
  showErrors(errors) {
    Object.keys(errors).forEach(f => { const input = document.querySelector(`[name="${f}"]`), el = document.getElementById(`${f}-error`); if (input) { input.classList.add('error'); input.setAttribute('aria-invalid','true'); } if (el) { el.textContent = errors[f]; el.style.display = 'block'; el.setAttribute('role','alert'); } });
  }
  clearErrors() { document.querySelectorAll('.input-field.error').forEach(i => { i.classList.remove('error'); i.removeAttribute('aria-invalid'); }); document.querySelectorAll('[id$="-error"]').forEach(e => { e.textContent = ''; e.style.display = 'none'; }); }
}
export const validator = new Validator();