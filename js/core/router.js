// [AP-001] Маршрутизация SPA, 55 строк
// Все пути — относительные для GitHub Pages

import { events } from './events.js';
import { store } from './store.js';

class Router {
  constructor() {
    this.routes = {
      home: 'pages/index.html',
      plan: 'pages/plan.html',
      hub: 'pages/hub.html',
      profile: 'pages/profile.html',
      tariffs: 'pages/tariffs.html',
      templates: 'pages/templates.html',
      archive: 'pages/archive.html',
      auth: 'pages/auth.html',
      offer: 'pages/offer.html',
      privacy: 'pages/privacy.html',
      landing: 'pages/landing.html',
      admin: 'pages/admin.html',
    };

    this.currentRoute = null;
    this.container = document.getElementById('app-content');

    window.addEventListener('popstate', (e) => {
      if (e.state && e.state.route) {
        this.navigate(e.state.route, false);
      }
    });

    console.log('[Router] initialized');
  }

  navigate(route, pushState = true) {
    if (!this.routes[route]) {
      console.error(`[Router] Unknown route: ${route}`);
      return;
    }

    if (this.currentRoute === route && pushState) return;

    console.log(`[Router] Navigating to: ${route}`);
    events.emit('routeChanging', { from: this.currentRoute, to: route });

    const url = this.routes[route];

    fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.text();
      })
      .then((html) => {
        if (this.container) {
          this.container.innerHTML = html;
          this.currentRoute = route;

          if (pushState) {
            history.pushState({ route }, '', `#${route}`);
          }

          events.emit('routeChanged', { route });
          console.log(`[Router] Route loaded: ${route}`);
        }
      })
      .catch((error) => {
        console.error(`[Router] Failed to load page: ${url}`, error);
        if (this.container) {
          this.container.innerHTML =
            '<p style="padding:16px;">Ошибка загрузки страницы. <a href=".">На главную</a></p>';
        }
      });
  }
}

export const router = new Router();