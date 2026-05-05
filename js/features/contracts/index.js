// Точка входа контрактов, 25 строк
import { events } from '../../core/events.js';
import { ContractView } from './contract-view.js';
import { ContractActions } from './contract-actions.js';
import { ContractModals } from './contract-modals.js';
import { PdfBuilder } from './pdfBuilder.js';
import { ActBuilder } from './actBuilder.js';

class ContractsModule {
  constructor() { this.view = new ContractView(); this.actions = new ContractActions(); this.modals = new ContractModals(); this.pdfBuilder = new PdfBuilder(); this.actBuilder = new ActBuilder(); console.log('[Contracts] Ready'); }
}
export const contractsModule = new ContractsModule();