// Архив: загрузка проектов, 20 строк
(function() {
  console.log('[Archive] Script loaded');
  function load() {
    const list = document.getElementById('archive-list'), empty = document.getElementById('archive-empty');
    const archived = window.App?.store?.getState().projects.archived || [];
    if (!archived.length) { if (empty) empty.style.display = 'block'; return; }
    if (empty) empty.style.display = 'none'; if (!list) return;
    list.innerHTML = archived.map(p => `<li class="card" style="margin-bottom:12px;cursor:pointer;"><article><h3 style="font-size:16px;">${p.address||'Без адреса'}</h3><dl style="display:grid;grid-template-columns:1fr 1fr;gap:4px;font-size:14px;"><div><dt style="font-size:12px;color:var(--text-secondary);">Завершён:</dt><dd><time datetime="${p.completedAt||''}">${p.completedAt?new Date(p.completedAt).toLocaleDateString('ru-RU'):'—'}</time></dd></div><div><dt style="font-size:12px;color:var(--text-secondary);">Сумма:</dt><dd style="font-weight:600;">${(p.estimate?.total||0).toLocaleString()} ₽</dd></div></dl></article></li>`).join('');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', load); else load();
})();