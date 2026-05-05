// Главный экран: быстрый замер + фильтры, 55 строк
(function() {
  console.log('[Home] Script loaded');
  document.getElementById('quick-measure-btn')?.addEventListener('click', () => {
    localStorage.setItem('delo-guest-session', JSON.stringify({ id: 'guest_'+Date.now(), isGuest: true, createdAt: new Date().toISOString(), tariff: 'guest', source: 'quick_measure' }));
    window.location.href = '/pages/plan.html';
  });
  const filterBtns = document.querySelectorAll('.filter-btn'), projectsList = document.getElementById('projects-list'), emptyState = document.getElementById('empty-state'), counter = document.getElementById('projects-counter');
  function getProjects(filter) {
    const state = window.App?.store?.getState() || { projects: { active: [], archived: [] } };
    const now = new Date();
    if (filter === 'active') return state.projects.active.filter(p => !p.deadline || new Date(p.deadline) >= now);
    if (filter === 'overdue') return state.projects.active.filter(p => p.deadline && new Date(p.deadline) < now);
    if (filter === 'archive') return state.projects.archived || [];
    return state.projects.active;
  }
  function render(filter) {
    const projects = getProjects(filter); if (!projectsList) return;
    if (counter && filter !== 'archive') counter.textContent = projects.length + ' из 3';
    if (!projects.length) { projectsList.innerHTML = ''; if (emptyState) { emptyState.style.display = 'block'; emptyState.innerHTML = filter === 'archive' ? 'Нет завершённых проектов.' : filter === 'overdue' ? 'Нет просроченных проектов.' : 'Нет активных проектов.'; } return; }
    if (emptyState) emptyState.style.display = 'none';
    projectsList.innerHTML = projects.map(p => `<li class="card" style="margin-bottom:12px;cursor:pointer;" onclick="window.App?.router.navigate('hub')"><article><h3 style="font-size:16px;margin:0 0 4px;">${p.address||'Без адреса'}</h3><div style="display:flex;justify-content:space-between;align-items:center;"><span class="card-status-badge">${p.status||'В работе'}</span><div style="text-align:right;">${p.deadline?'<p style="font-size:12px;color:var(--text-secondary);margin:0;">Срок: '+new Date(p.deadline).toLocaleDateString('ru-RU')+'</p>':''}${p.estimate?.total?'<p style="font-size:14px;font-weight:600;margin:2px 0 0;">'+p.estimate.total.toLocaleString()+' ₽</p>':''}</div></div></article></li>`).join('');
  }
  filterBtns.forEach(b => b.addEventListener('click', () => { filterBtns.forEach(x => { x.style.background='transparent'; x.style.color='var(--text-primary)'; }); b.style.background='var(--green-primary)'; b.style.color='#fff'; render(b.dataset.filter); }));
  render('active');
})();