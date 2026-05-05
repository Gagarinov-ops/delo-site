// [REF-001] Обработчики действий с договорами
// [AP-004] Один файл — одна ответственность (60 строк)

import { events } from '../../core/events.js';
import { store } from '../../core/store.js';
import { toaster } from '../../shared/toaster.js';

export class ContractActions {
  constructor() {
    this.hasGeneratedBefore = false;
    console.log('[ContractActions] initialized');
  }

  prepareContractVariables(projectId) {
    const state = store.getState();
    const project = state.projects.active.find(p => p.id === projectId);
    const user = state.user;

    if (!project) {
      console.error('[ContractActions] Project not found');
      return null;
    }

    const amount = project.estimate?.total || 0;

    return {
      НОМЕР_ДОГОВОРА: `ДП-${project.id}`,
      ГОРОД_ДОГОВОРА: 'Москва',
      ДАТА_ДОГОВОРА: new Date().toLocaleDateString('ru-RU'),
      ФИО_ЗАКАЗЧИКА: project.clientName || '',
      ФИО_МАСТЕРА: user.name || '',
      СТАТУС_МАСТЕРА: user.status || 'Физлицо',
      АДРЕС_ОБЪЕКТА: project.address || '',
      СУММА_СМЕТЫ_РАБОТ: amount.toLocaleString(),
      СУММА_ДОГОВОРА: amount.toLocaleString(),
      ТЕЛЕФОН_ЗАКАЗЧИКА: project.clientPhone || '',
      ТЕЛЕФОН_МАСТЕРА: user.phone || '',
      ПАСПОРТ_ЗАКАЗЧИКА: project.clientPassport || '',
      ПАСПОРТ_МАСТЕРА: user.passport || '',
      АДРЕС_ЗАКАЗЧИКА: project.clientAddress || '',
      АДРЕС_МАСТЕРА: user.address || '',
      ИНН_МАСТЕРА: user.inn || '',
      ОГРНИП_МАСТЕРА: user.ogrnip || '',
      ПОРЯДОК_ОПЛАТЫ: project.paymentOrder || 'ПОСТОПЛАТА',
      СРОК_РАБОТ: project.deadline || '20',
    };
  }

  markAsGenerated() {
    const first = !this.hasGeneratedBefore;
    this.hasGeneratedBefore = true;
    if (first) toaster.show('Первый документ сгенерирован', 'success');
    return first;
  }

  notifySmetaChanged() {
    toaster.showSmetaChanged(() => {
      events.emit('createAdditionalAgreement');
    });
  }
}