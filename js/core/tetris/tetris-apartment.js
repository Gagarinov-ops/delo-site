// Стыковка помещений, 45 строк
import { events } from '../events.js';
export class TetrisApartment {
  constructor() { this.rooms = []; this.joints = []; console.log('[TetrisApartment] initialized'); }
  addRoom(roomData) { const room = { id: Date.now(), ...roomData }; this.rooms.push(room); events.emit('roomAdded', { room }); return room; }
  joinRooms(id1, id2, doorPos) {
    const r1 = this.rooms.find(r => r.id === id1), r2 = this.rooms.find(r => r.id === id2);
    if (!r1 || !r2) return false;
    const gap = Math.sqrt((r1.position.x - r2.position.x)**2 + (r1.position.y - r2.position.y)**2);
    if (gap > 5) { events.emit('validationError', { message: `Большой зазор: ${gap.toFixed(1)} см`, riskId: 'RISK-13' }); return false; }
    if (!doorPos?.x) { events.emit('validationError', { message: 'Двери не совпали', riskId: 'RISK-14' }); return false; }
    this.joints.push({ room1Id: id1, room2Id: id2, gap, doorMatch: true, position: doorPos });
    events.emit('roomsJoined', { joint: this.joints[this.joints.length-1] }); return true;
  }
}