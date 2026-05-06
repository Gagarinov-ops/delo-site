// js/pages/landing.js
// FIX-002: кнопка «Попробовать самому» → правильный путь
// FIX-003: ссылки в футере → правильные пути (в HTML)
// FIX-005: убраны абсолютные пути

(function () {
  console.log('[Landing] Script loaded');

  var modal = document.getElementById('try-free-modal');
  var steps = [
    document.getElementById('step-1'),
    document.getElementById('step-2'),
    document.getElementById('step-3'),
  ];
  var dots = document.querySelectorAll('.step-dot');
  var guestBtn = document.getElementById('try-guest-btn');
  var tryFreeBtn = document.getElementById('try-free-btn');

  if (tryFreeBtn) {
    tryFreeBtn.addEventListener('click', function () {
      if (modal) {
        modal.style.display = 'flex';
        modal.hidden = false;
      }
      showStep(1);
      if (guestBtn) guestBtn.style.display = 'none';
    });
  }

  function showStep(n) {
    steps.forEach(function (s, i) {
      if (s) s.style.display = i + 1 === n ? 'block' : 'none';
    });
    dots.forEach(function (d, i) {
      d.style.background = i < n ? 'var(--green-primary)' : 'var(--border-gray)';
    });

    if (n < 3) {
      setTimeout(function () { showStep(n + 1); }, 1500);
    } else {
      if (guestBtn) guestBtn.style.display = 'block';
    }
  }

  // FIX-002, FIX-005: путь относительный, без ведущего слеша
  if (guestBtn) {
    guestBtn.addEventListener('click', function () {
      localStorage.setItem(
        'delo-guest-session',
        JSON.stringify({
          id: 'guest_' + Date.now(),
          isGuest: true,
          createdAt: new Date().toISOString(),
          tariff: 'guest',
        })
      );
      window.location.href = 'pages/auth.html';
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal && modal.style.display === 'flex') {
      modal.style.display = 'none';
      modal.hidden = true;
    }
  });

  if (modal) {
    modal.addEventListener('click', function (e) {
      if (e.target === modal) {
        modal.style.display = 'none';
        modal.hidden = true;
      }
    });
  }
})();