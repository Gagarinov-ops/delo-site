// Автосохранение, 30 строк
export class AutoSaver {
  constructor(opts = {}) { this.interval = opts.interval || 5000; this.key = opts.key || 'delo-autosave'; this.timer = null; this.enabled = false; console.log('[AutoSaver] initialized'); }
  start(getData) { if (this.enabled) return; this.enabled = true; this.timer = setInterval(() => { const data = getData(); this.save(data); }, this.interval); }
  stop() { if (this.timer) clearInterval(this.timer); this.enabled = false; }
  save(data) { try { localStorage.setItem(this.key, JSON.stringify({ timestamp: new Date().toISOString(), data })); } catch (e) {} }
  load() { try { const saved = localStorage.getItem(this.key); return saved ? JSON.parse(saved).data : null; } catch (e) { return null; } }
}