// Админ-панель, 40 строк
(function() {
  console.log('[Admin] Script loaded');
  const mockUsers = [{ phone: '+79001234567', tariff: 'Мастер', registeredAt: '2026-01-15', trial: false, projects: 3, blocked: false },{ phone: '+79007654321', tariff: 'Старт', registeredAt: '2026-02-20', trial: true, projects: 1, blocked: false },{ phone: '+79009876543', tariff: 'Прораб', registeredAt: '2025-11-01', trial: false, projects: 8, blocked: false },{ phone: '+79001112233', tariff: 'Старт', registeredAt: '2026-03-10', trial: true, projects: 0, blocked: true }];
  const tbody = document.getElementById('users-tbody');
  function render(users) {
    if (!tbody) return;
    tbody.innerHTML = users.map(u => `<tr style="border-bottom:1px solid var(--border-gray);${u.blocked?'opacity:.5':''}"><td style="padding:12px 8px;font-size:14px;">${u.phone}${u.blocked?' <span style="background:var(--red-error);color:#fff;border-radius:4px;padding:2px 6px;font-size:10px;">Заблок.</span>':''}</td><td style="padding:12px 8px;">${u.tariff}</td><td style="padding:12px 8px;"><time datetime="${u.registeredAt}">${new Date(u.registeredAt).toLocaleDateString('ru-RU')}</time></td><td style="padding:12px 8px;">${u.trial?'<span style="color:var(--yellow-text);">Да</span>':'Нет'}</td><td style="padding:12px 8px;">${u.projects}</td><td style="padding:12px 8px;">${u.blocked?`<button style="background:var(--green-primary);color:#fff;border:none;border-radius:4px;padding:6px 12px;font-size:12px;cursor:pointer;" onclick="alert('Разблокирован: ${u.phone}')">Разблокировать</button>`:`<button style="background:var(--red-error);color:#fff;border:none;border-radius:4px;padding:6px 12px;font-size:12px;cursor:pointer;" onclick="alert('Заблокирован: ${u.phone}')">Блокировать</button>`}</td></tr>`).join('');
    document.getElementById('metric-users').textContent = users.length;
    document.getElementById('metric-projects').textContent = users.reduce((s,u) => s+u.projects, 0);
    document.getElementById('metric-conversion').textContent = Math.round(users.filter(u => !u.trial).length/users.length*100) + '%';
  }
  render(mockUsers);
})();