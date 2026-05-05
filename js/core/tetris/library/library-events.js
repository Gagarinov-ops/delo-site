// Обработчики тапов, 55 строк
import { events } from '../../events.js';
import { CircleShape } from './shapes/circle.js'; import { SquareShape } from './shapes/square.js';
import { LineShape } from './shapes/line.js'; import { WindowShape } from './shapes/window.js';
import { ArcShape } from './shapes/arc.js'; import { HingeShape } from './shapes/hinge.js';
import { ChandelierShape } from './shapes/chandelier.js'; import { TrackShape } from './shapes/track.js';

export class LibraryEvents {
  constructor(buttons) {
    this.buttons = buttons;
    this.shapeMap = { circle: CircleShape, square: SquareShape, line: LineShape, window: WindowShape, arc: ArcShape, hinge: HingeShape, chandelier: ChandelierShape, track: TrackShape };
    console.log('[LibraryEvents] initialized');
  }
  bind(panel) {
    panel.addEventListener('click', e => {
      const btn = e.target.closest('.library-item'); if (!btn) return;
      const id = btn.dataset.itemId; const item = this.buttons.store.getItem(id); if (!item) return;
      this.buttons.setSelectedItem(item); this.buttons.highlight(panel, id);
      const ShapeClass = this.shapeMap[id]; events.emit('libraryItemSelected', { item, shape: ShapeClass ? new ShapeClass() : null });
    });
    panel.addEventListener('keydown', e => { if ((e.key==='Enter'||e.key===' ') && e.target.closest('.library-item')) { e.preventDefault(); e.target.closest('.library-item').click(); } });
  }
  getSelectedShape() { const sel = this.buttons.getSelectedItem(); if (!sel) return null; const S = this.shapeMap[sel.id]; return S ? new S() : null; }
}