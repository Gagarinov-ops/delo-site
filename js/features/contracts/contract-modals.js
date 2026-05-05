// Модальные окна, 55 строк
import { modal } from '../../shared/modal.js';
import { store } from '../../core/store.js';

export class ContractModals {
  constructor() { console.log('[ContractModals] initialized'); }
  showDisclaimer(onConfirm) {
    modal.open('pdfConfirmModal');
    const yes = document.querySelector('#pdfConfirmModal .btn-primary'), no = document.querySelector('#pdfConfirmModal .btn-cancel');
    if (yes) yes.onclick = () => { modal.close(); store.dispatch('ADD_CONSENT', { type: 'pdf_generation', action: 'confirmed' }); if (onConfirm) onConfirm(); };
    if (no) no.onclick = () => modal.close();
  }
  showCloseProject(projectId, onConfirm) {
    modal.open('closeProjectModal');
    const yes = document.querySelector('#closeProjectModal .btn-danger-secondary'), no = document.querySelector('#closeProjectModal .btn-cancel');
    if (yes) yes.onclick = () => { modal.close(); if (onConfirm) onConfirm(projectId); };
    if (no) no.onclick = () => modal.close();
  }
  showRegistrationPrompt(actionType, onRegister) {
    const msgs = { save: 'Чтобы сохранить проект, зарегистрируйтесь.', pdf: 'Чтобы скачать PDF, зарегистрируйтесь.', export: 'Чтобы экспортировать, зарегистрируйтесь.' };
    const html = `<aside class="modal-overlay" id="regPrompt" style="display:flex;" role="dialog" aria-modal="true"><section class="modal-window" style="text-align:center;"><p style="font-size:48px;" aria-hidden="true">🔒</p><h2 style="font-size:18px;">Требуется регистрация</h2><p style="font-size:14px;color:var(--text-secondary);">${msgs[actionType]||''}</p><button class="btn-primary" id="reg-go">Зарегистрироваться</button><button class="btn-cancel" id="reg-close">Позже</button></section></aside>`;
    document.body.insertAdjacentHTML('beforeend', html);
    document.getElementById('reg-go').addEventListener('click', () => { document.getElementById('regPrompt').remove(); if (onRegister) onRegister(); });
    document.getElementById('reg-close').addEventListener('click', () => document.getElementById('regPrompt').remove());
  }
  isGuest() { return store.getState().user.isGuest; }
}