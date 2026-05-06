// js/pages/admin.js
// FIX-004: кнопка «На главную» → pages/home.html
// FIX-005: убраны абсолютные пути

(function () {
  console.log('[Admin] Script loaded');

  var mockUsers = [
    { phone: '+79001234567', tariff: 'Мастер', registeredAt: '2026-01-15', trial: false, projects: 3, blocked: false },
    { phone: '+79007654321', tariff: 'Старт', registeredAt: '2026-02-20', trial: true, projects: 1, blocked: false },
    { phone: '+79009876543', tariff: 'Прораб', registeredAt: '2025-11-01', trial: false, projects: 8, blocked: false },
    { phone: '+79001112233', tariff: 'Старт', registeredAt: '2026-03-10', trial: true, projects: 0, blocked: true },
  ];

  var tbody = document.getElementById('users-tbody');
  var emptyState = document.getElementById('users-empty');

  function render(users) {
    if (!tbody) return;

    if (users.length === 0) {
      tbody.innerHTML = '';
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';

    tbody.innerHTML = users
      .map(function (u) {
        return (
          '<tr style="border-bottom:1px solid var(--border-gray);' +
          (u.blocked ? 'opacity:.5' : '') + '">' +
          '<td style="padding:12px 8px;font-size:14px;white-space:nowrap;">' +
          u.phone +
          (u.blocked
            ? ' <span style="display:inline-block;margin-left:6px;padding:2px 6px;background:var(--red-error);color:#fff;border-radius:4px;font-size:10px;">Заблок.</span>'
            : '') +
          '</td>' +
          '<td style="padding:12px 8px;font-size:14px;white-space:nowrap;">' + u.tariff + '</td>' +
          '<td style="padding:12px 8px;font-size:14px;white-space:nowrap;"><time datetime="' + u.registeredAt + '">' +
          new Date(u.registeredAt).toLocaleDateString('ru-RU') + '</time></td>' +
          '<td style="padding:12px 8px;font-size:14px;">' +
          (u.trial ? '<span style="color:var(--yellow-text);">Да</span>' : '<span style="color:var(--text-secondary);">Нет</span>') +
          '</td>' +
          '<td style="padding:12px 8px;font-size:14px;">' + u.projects + '</td>' +
          '<td style="padding:12px 8px;">' +
          (u.blocked
            ? '<button type="button" style="background:var(--green-primary);color:#fff;border:none;border-radius:4px;padding:6px 12px;font-size:12px;cursor:pointer;white-space:nowrap;" data-action="unblock" data-phone="' + u.phone + '">Разблокировать</button>'
            : '<button type="button" style="background:var(--red-error);color:#fff;border:none;border-radius:4px;padding:6px 12px;font-size:12px;cursor:pointer;white-space:nowrap;" data-action="block" data-phone="' + u.phone + '">Блокировать</button>') +
          '</td></tr>'
        );
      })
      .join('');
  }

  function updateMetrics(users) {
    var total = users.length;
    var paid = users.filter(function (u) { return !u.trial; }).length;
    var conv = total > 0 ? Math.round((paid / total) * 100) : 0;
    var proj = users.reduce(function (s, u) { return s + u.projects; }, 0);

    var mUsers = document.getElementById('metric-users');
    var mProjects = document.getElementById('metric-projects');
    var mConv = document.getElementById('metric-conversion');
    var mActive = document.getElementById('metric-active-today');

    if (mUsers) mUsers.textContent = total;
    if (mProjects) mProjects.textContent = proj;
    if (mConv) mConv.textContent = conv + '%';
    if (mActive) mActive.textContent = Math.floor(total * 0.3);
  }

  // FIX-004, FIX-005: делегирование событий, путь относительный
  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-action="go-home"]')) {
      e.preventDefault();
      window.location.href = 'pages/home.html';
      return;
    }

    var btn = e.target.closest('button[data-action]');
    if (!btn) return;

    var phone = btn.dataset.phone;
    if (btn.dataset.action === 'block') {
      console.log('[Admin] Blocking:', phone);
      alert('Пользователь ' + phone + ' заблокирован.');
    } else if (btn.dataset.action === 'unblock') {
      console.log('[Admin] Unblocking:', phone);
      alert('Пользователь ' + phone + ' разблокирован.');
    }
  });

  render(mockUsers);
  updateMetrics(mockUsers);
})();