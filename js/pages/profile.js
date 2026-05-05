// Профиль: сохранение полей и уведомлений, 40 строк
(function() {
  console.log('[Profile] Script loaded');
  function save(k, v) { window.App?.store?.dispatch('SET_USER', { [k]: v }); }
  function saveNotif(k, v) { const s = window.App?.store?.getState().user.settings?.notifications || {}; window.App?.store?.dispatch('SET_USER', { settings: { notifications: { ...s, [k]: v } } }); }
  ['profile-name','profile-phone','profile-email'].forEach(id => document.getElementById(id)?.addEventListener('change', function() { save(this.name, this.value); }));
  document.getElementById('profile-status')?.addEventListener('change', function() { save('status', this.value); });
  document.getElementById('notify-push')?.addEventListener('change', function() { saveNotif('push', this.checked); });
  document.getElementById('notify-email')?.addEventListener('change', function() { saveNotif('email', this.checked); });
  document.getElementById('notify-sms')?.addEventListener('change', function() { saveNotif('sms', this.checked); });
  document.getElementById('theme-toggle')?.addEventListener('change', function() { window.App?.store?.dispatch('SET_THEME', this.checked ? 'dark' : 'light'); });
})();