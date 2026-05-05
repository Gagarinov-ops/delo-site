// Лендинг: лайтбокс, 35 строк
(function() {
  console.log('[Landing] Script loaded');
  const modal = document.getElementById('try-free-modal'), steps = [document.getElementById('step-1'), document.getElementById('step-2'), document.getElementById('step-3')], dots = document.querySelectorAll('.step-dot'), guestBtn = document.getElementById('try-guest-btn');
  document.getElementById('try-free-btn')?.addEventListener('click', () => { modal.style.display = 'flex'; modal.hidden = false; show(1); guestBtn.style.display = 'none'; });
  function show(n) { steps.forEach((s,i) => { if(s) s.style.display = i+1===n ? 'block' : 'none'; }); dots.forEach((d,i) => { d.style.background = i<n ? 'var(--green-primary)' : 'var(--border-gray)'; }); if (n < 3) setTimeout(() => show(n+1), 1500); else guestBtn.style.display = 'block'; }
  guestBtn?.addEventListener('click', () => { localStorage.setItem('delo-guest-session', JSON.stringify({ id: 'guest_'+Date.now(), isGuest: true, createdAt: new Date().toISOString(), tariff: 'guest' })); window.location.href = 'pages/plan.html'; });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.style.display === 'flex') { modal.style.display = 'none'; modal.hidden = true; } });
})();