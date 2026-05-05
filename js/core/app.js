// [AP-001] Точка входа, 20 строк
import { store } from './store.js';
import { router } from './router.js';
import { events } from './events.js';

class App {
  constructor() { this.store = store; this.router = router; this.events = events; console.log('[App] initialized'); }
  init() {
    const hash = window.location.hash.replace('#', '');
    const start = (!store.getState().user.id) ? 'auth' : (hash && router.routes[hash] ? hash : 'home');
    router.navigate(start, true);
    import('../config/features.js').then(m => store.dispatch('SET_FEATURES', m.featuresConfig)).catch(() => {});
  }
}
const app = new App();
document.addEventListener('DOMContentLoaded', () => app.init());
export { app };