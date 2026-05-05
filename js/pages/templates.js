// Шаблоны: открытие группы, 10 строк
(function() {
  console.log('[Templates] Script loaded');
  document.querySelectorAll('.template-group-card').forEach(card => {
    card.addEventListener('click', function() {
      console.log('[Templates] Opening:', this.querySelector('h3')?.textContent);
    });
    card.addEventListener('keydown', function(e) { if (e.key === 'Enter') this.click(); });
  });
})();