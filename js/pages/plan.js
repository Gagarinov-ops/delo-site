// План: валидация размеров, 25 строк
(function() {
  console.log('[Plan] Script loaded');
  const length = document.getElementById('room-length'), width = document.getElementById('room-width'), next = document.getElementById('plan-next-btn'), calc = document.getElementById('calculate-plan-btn'), warn = document.getElementById('contour-warning');
  function validate() {
    const l = parseFloat(length?.value||0), w = parseFloat(width?.value||0);
    if (l <= 0 || w <= 0) { if (warn) { warn.textContent = 'Длина и ширина должны быть > 0'; warn.style.display = 'block'; } if (next) next.disabled = true; if (calc) calc.disabled = true; return false; }
    if (warn) warn.style.display = 'none'; if (next) next.disabled = false; if (calc) calc.disabled = false; return true;
  }
  [length, width].forEach(el => el?.addEventListener('input', validate));
  calc?.addEventListener('click', () => { if (validate()) window.App?.router.navigate('hub'); });
})();