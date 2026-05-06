// js/core/app.js
// [AP-001] Точка входа
// FIX-001: Роутер не перехватывает прямые страницы

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
    // FIX-001: Если нет контейнера — страница открыта напрямую, роутер не запускается
    if (!document.getElementById('app-content')) {
      console.log('[App] Direct page access — router skipped');
      return;
    }

    const hash = window.location.hash.replace('#', '');
    let startRoute = 'landing';

    const user = store.getState().user;
    if (user.id && !user.isGuest && hash && router.routes[hash]) {
      startRoute = hash;
    } else if (hash === 'auth') {
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