// [AP-001] Маршрутизация, 45 строк
import { events } from './events.js';

class Router {
  constructor() {
    this.routes = {
      home: '/pages/index.html', plan: '/pages/plan.html', hub: '/pages/hub.html',
      profile: '/pages/profile.html', tariffs: '/pages/tariffs.html',
      templates: '/pages/templates.html', archive: '/pages/archive.html',
      auth: '/pages/auth.html', offer: '/pages/offer.html',
      privacy: '/pages/privacy.html', landing: '/pages/landing.html',
      admin: '/pages/admin.html',
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
    fetch('pages/' + route + '.html')
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.text(); })
      .then(html => {
        if (this.container) { this.container.innerHTML = html; this.currentRoute = route; if (pushState) history.pushState({ route }, '', `#${route}`); events.emit('routeChanged', { route }); }
      })
      .catch(e => { console.error(e); if (this.container) this.container.innerHTML = '<p>Ошибка загрузки.</p>'; });
  }
}
export const router = new Router();