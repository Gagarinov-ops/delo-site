// [AP-001] Точка входа, 30 строк
// Стартовый маршрут — landing для всех

import { store } from './store.js';
import { router } from './router.js';
import { events } from './events.js';

class App {
  constructor() {
    this.store = store;
    this.router = router;
    this.events = events;
    console.log('[App] initialized');
  }

  init() {
    const hash = window.location.hash.replace('#', '');

    let startRoute = 'landing';

    // Если пользователь авторизован и есть хеш — используем его
    const user = store.getState().user;
    if (user.id && !user.isGuest && hash && router.routes[hash]) {
      startRoute = hash;
    }
    // Если в хеше явно указан auth — идём на auth
    else if (hash === 'auth') {
      startRoute = 'auth';
    }

    router.navigate(startRoute, true);

    import('../config/features.js')
      .then((m) => store.dispatch('SET_FEATURES', m.featuresConfig))
      .catch(() => {});
  }
}

const app = new App();
document.addEventListener('DOMContentLoaded', () => app.init());
export { app };