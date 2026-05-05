// Точка входа сметы, 35 строк
import { events } from '../../core/events.js';
import { EstimatorState } from './estimator-state.js';
import { EstimatorValidation } from './estimator-validation.js';
import { EstimatorTable } from './estimator-table.js';
import { EstimatorSummary } from './estimator-summary.js';
import { AutoSaver } from '../../shared/autoSaver.js';

class EstimatorModule {
  constructor() { this.state = null; this.validation = null; this.table = null; this.summary = null; this.autoSaver = null; console.log('[Estimator] Module initialized'); }
  init() {
    this.state = new EstimatorState(); this.validation = new EstimatorValidation();
    this.table = new EstimatorTable(this.state); this.summary = new EstimatorSummary(this.state, this.validation);
    this.table.setOnRemove(id => this.state.removeItem(id));
    this.autoSaver = new AutoSaver({ interval: 5000, key: 'delo-estimate-autosave' });
    events.on('estimate:changed', data => this.autoSaver.save(data));
    console.log('[Estimator] Ready');
  }
  render(containerId) {
    if (!this.state) this.init();
    const root = document.getElementById(containerId); if (!root) return;
    root.innerHTML = '<div style="display:flex;gap:16px;padding:16px;min-height:400px;"><div id="est-table" style="flex:1;overflow-y:auto;max-height:60vh;"></div><div id="est-summary" style="width:150px;flex-shrink:0;"></div></div>';
    this.table.render(document.getElementById('est-table')); this.summary.render(document.getElementById('est-summary'));
    events.on('estimatorUpdated', () => { this.table.render(document.getElementById('est-table')); this.summary.render(document.getElementById('est-summary')); });
  }
}
export const estimatorModule = new EstimatorModule();