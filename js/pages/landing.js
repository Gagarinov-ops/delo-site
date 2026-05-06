// Лендинг: лайтбокс с 3 шагами, 40 строк
// Все пути — относительные

(function () {
  console.log('[Landing] Script loaded');

  const modal = document.getElementById('try-free-modal');
  const steps = [
    document.getElementById('step-1'),
    document.getElementById('step-2'),
    document.getElementById('step-3'),
  ];
  const dots = document.querySelectorAll('.step-dot');
  const guestBtn = document.getElementById('try-guest-btn');
  const tryFreeBtn = document.getElementById('try-free-btn');

  if (tryFreeBtn) {
    tryFreeBtn.addEventListener('click', () => {
      if (modal) {
        modal.style.display = 'flex';
        modal.hidden = false;
      }
      showStep(1);
      if (guestBtn) guestBtn.style.display = 'none';
    });
  }

  function showStep(n) {
    steps.forEach((s, i) => {
      if (s) s.style.display = i + 1 === n ? 'block' : 'none';
    });
    dots.forEach((d, i) => {
      d.style.background = i < n ? 'var(--green-primary)' : 'var(--border-gray)';
    });

    if (n < 3) {
      setTimeout(() => showStep(n + 1), 1500);
    } else {
      if (guestBtn) guestBtn.style.display = 'block';
    }
  }

  if (guestBtn) {
    guestBtn.addEventListener('click', () => {
      localStorage.setItem(
        'delo-guest-session',
        JSON.stringify({
          id: 'guest_' + Date.now(),
          isGuest: true,
          createdAt: new Date().toISOString(),
          tariff: 'guest',
        })
      );
      // Относительный путь для GitHub Pages
      window.location.href = 'pages/auth.html';
    });
  }

  // Закрытие по Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.style.display === 'flex') {
      modal.style.display = 'none';
      modal.hidden = true;
    }
  });

  // Закрытие по клику на оверлей
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
        modal.hidden = true;
      }
    });
  }
})();