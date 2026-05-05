// Сбор ошибок валидации, 35 строк
import { events } from '../events.js';
export class TetrisValidator {
  constructor() { this.errors = []; this.warnings = []; events.on('validationError', d => this.addError(d)); events.on('validationWarning', d => this.addWarning(d)); console.log('[TetrisValidator] initialized'); }
  addError(e) { this.errors.push({...e, timestamp: Date.now()}); events.emit('validationUpdated', { errors: [...this.errors], warnings: [...this.warnings] }); }
  addWarning(w) { this.warnings.push({...w, timestamp: Date.now()}); events.emit('validationUpdated', { errors: [...this.errors], warnings: [...this.warnings] }); }
  clear() { this.errors = []; this.warnings = []; events.emit('validationUpdated', { errors: [], warnings: [] }); }
  hasErrors() { return this.errors.length > 0; }
  getReport() { return { isValid: !this.hasErrors(), errors: [...this.errors], warnings: [...this.warnings] }; }
}