// Тарифы: выбор, 10 строк
(function() {
  console.log('[Tariffs] Script loaded');
  document.querySelectorAll('.tariff-select-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const name = this.closest('article')?.querySelector('h2')?.textContent || '';
      alert('Выбран тариф: ' + name);
    });
  });
})();