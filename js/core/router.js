// [AP-001] Маршрутизация, 45 строк
import { events } from './events.js';

class Router {
  constructor() {
    this.routes = {
      home: BASE_PATH + '/pages/index.html',
      auth: BASE_PATH + '/pages/auth.html',
      plan: BASE_PATH + '/pages/plan.html',
      hub: BASE_PATH + '/pages/hub.html',
      profile: BASE_PATH + '/pages/profile.html',
      tariffs: BASE_PATH + '/pages/tariffs.html',
      templates: BASE_PATH + '/pages/templates.html',
      archive: BASE_PATH + '/pages/archive.html',
      admin: BASE_PATH + '/pages/admin.html',
      landing: BASE_PATH + '/pages/landing.html',
      offer: BASE_PATH + '/pages/offer.html',
      privacy: BASE_PATH + '/pages/privacy.html',
    };
    this.currentRoute = null;
    this.container = document.getElementById('app-content');
    window.addEventListener('popstate', e => { if (e.state?.route) this.navigate(e.state.route, false); });
    console.log('[Router] initialized');
  }

  navigate(route, pushState = true) {
    if (!this.routes[route] || (this.currentRoute === route && pushState)) return;
    console.log(`[Router] Navigating to: ${route}`);
    events.emit('routeChanging', { from: this.currentRoute, to: route });
    fetch(this.routes[route])
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.text(); })
      .then(html => {
        if (this.container) { this.container.innerHTML = html; this.currentRoute = route; if (pushState) history.pushState({ route }, '', `#${route}`); events.emit('routeChanged', { route }); }
      })
      .catch(e => { console.error(e); if (this.container) this.container.innerHTML = '<p>Ошибка загрузки.</p>'; });
  }
}
export const router = new Router();