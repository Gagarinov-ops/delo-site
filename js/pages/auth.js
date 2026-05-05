// Авторизация: переключение режимов, 25 строк
(function() {
  console.log('[Auth] Script loaded');
  const form = document.querySelector('.auth-form'), submitBtn = document.getElementById('auth-submit-btn'), switchLink = document.getElementById('switch-to-login'), modeTitle = document.getElementById('auth-mode-title'), legal = document.querySelector('.legal-agreement');
  let isLogin = false;
  switchLink?.addEventListener('click', e => { e.preventDefault(); isLogin = !isLogin; if (isLogin) { modeTitle.textContent = 'Вход'; submitBtn.textContent = 'Войти'; switchLink.textContent = 'Зарегистрироваться'; if (legal) legal.style.display = 'none'; } else { modeTitle.textContent = 'Регистрация'; submitBtn.textContent = 'Зарегистрироваться'; switchLink.textContent = 'Уже есть аккаунт? Войти'; if (legal) legal.style.display = ''; } });
  form?.addEventListener('submit', e => { e.preventDefault(); window.App?.store?.dispatch('SET_USER', { id: 'user_'+Date.now(), name: document.getElementById('auth-name')?.value||'Пользователь', phone: document.getElementById('auth-phone')?.value }); window.App?.router.navigate('home'); });
})();