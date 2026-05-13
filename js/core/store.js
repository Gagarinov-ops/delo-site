// [AP-005] Единое состояние, с поддержкой SET_PLAN
import { events } from './events.js';

class Store {
  constructor() {
    this.state = {
      user: {
        id: null, name: '', phone: '', email: '', status: 'Физлицо',
        tariff: 'Старт', tariffExpiry: null, inn: '', passport: '',
        address: '', ogrnip: '', isGuest: false,
        settings: { notifications: { push: true, email: true, sms: false } },
        consents: [] // PRD-008
      },
      projects: { active: [], archived: [] },
      currentProjectId: null,
      theme: 'light',
      features: {},
      plan: { rooms: [] } // инициализация плана
    };
    this._loadFromStorage();
    this._loadGuestSession();
    window.App = { state: this.state, store: this };
    console.log('[Store] initialized');
  }

  getState() { return this.state; }

  dispatch(action, payload) {
    console.log(`[Store] dispatch: ${action}`, payload);
    switch (action) {
      case 'SET_USER': this.state.user = { ...this.state.user, ...payload }; break;
      case 'SET_TARIFF': this.state.user.tariff = payload.tariff; this.state.user.tariffExpiry = payload.expiry; break;
      case 'ADD_PROJECT': this.state.projects.active.push(payload); break;
      case 'ARCHIVE_PROJECT': {
        const idx = this.state.projects.active.findIndex(p => p.id === payload);
        if (idx !== -1) {
          const [p] = this.state.projects.active.splice(idx, 1);
          p.status = 'Завершён'; p.completedAt = new Date().toISOString();
          this.state.projects.archived.push(p);
        }
        break;
      }
      case 'SET_CURRENT_PROJECT': this.state.currentProjectId = payload; break;
      case 'SET_THEME': this.state.theme = payload; document.body.setAttribute('data-theme', payload); break;
      case 'UPDATE_PROJECT': {
        const i = this.state.projects.active.findIndex(p => p.id === payload.id);
        if (i !== -1) this.state.projects.active[i] = { ...this.state.projects.active[i], ...payload.data };
        break;
      }
      case 'ADD_CONSENT': this.state.user.consents.push({ ...payload, timestamp: new Date().toISOString() }); break;
      case 'SET_PLAN': this.state.plan = payload; break;
    }
    this._saveToStorage();
    events.emit('stateChanged', { action, payload });
  }

  _saveToStorage() {
    try { localStorage.setItem('delo-state', JSON.stringify(this.state)); } catch (e) {}
  }
  _loadFromStorage() {
    try {
      const saved = localStorage.getItem('delo-state');
      if (saved) { this.state = { ...this.state, ...JSON.parse(saved) }; if (this.state.theme === 'dark') document.body.setAttribute('data-theme', 'dark'); }
    } catch (e) {}
  }
  _loadGuestSession() {
    try {
      const guest = JSON.parse(localStorage.getItem('delo-guest-session'));
      if (guest?.isGuest) this.state.user = { ...this.state.user, id: guest.id, isGuest: true, tariff: 'guest' };
    } catch (e) {}
  }
}
export const store = new Store();