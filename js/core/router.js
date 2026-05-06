// js/core/router.js
// FIX-006: home → pages/home.html
// FIX-005: все пути относительные

import { events } from './events.js';
import { store } from './store.js';

class Router {
  constructor() {
    this.routes = {
      home: 'pages/home.html',
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

    window.addEventListener('popstate', function (e) {
      if (e.state && e.state.route) {
        this.navigate(e.state.route, false);
      }
    }.bind(this));

    console.log('[Router] initialized');
  }

  navigate(route, pushState) {
    if (pushState === undefined) pushState = true;

    if (!this.routes[route]) {
      console.error('[Router] Unknown route: ' + route);
      return;
    }

    if (this.currentRoute === route && pushState) return;

    console.log('[Router] Navigating to: ' + route);
    events.emit('routeChanging', { from: this.currentRoute, to: route });

    var self = this;
    var url = this.routes[route];

    fetch(url)
      .then(function (response) {
        if (!response.ok) throw new Error('HTTP ' + response.status);
        return response.text();
      })
      .then(function (html) {
        if (self.container) {
          self.container.innerHTML = html;
          self.currentRoute = route;

          if (pushState) {
            history.pushState({ route: route }, '', '#' + route);
          }

          events.emit('routeChanged', { route: route });
          console.log('[Router] Route loaded: ' + route);
        }
      })
      .catch(function (error) {
        console.error('[Router] Failed to load page: ' + url, error);
        if (self.container) {
          self.container.innerHTML = '<p style="padding:16px;">Ошибка загрузки страницы. <a href=".">На главную</a></p>';
        }
      });
  }
}

export var router = new Router();