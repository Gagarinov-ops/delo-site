import CanvasData from '../data/CanvasData.js';

class Registry {
    constructor() {
        this.validator = null;
        this.calculator = null;
        this.analyzer = null;
        this.actionLog = null;
        this.canvasData = CanvasData;
    }

    execute(command) {
        if (this.validator) {
            const result = this.validator.validate(command);
            if (result && !result.success) {
                return result;
            }
        }

        if (command.type === 'wallCreated') {
            this._executeWallCreated(command);
        } else if (command.type === 'wallRemoved') {
            this._executeWallRemoved(command);
        } else if (command.type === 'pointMoved') {
            this._executePointMoved(command);
        }

        if (this.calculator) {
            this.calculator.recalculate(command);
        }

        if (this.analyzer) {
            const cycles = this.analyzer.findCycles(command);
            for (const cycle of cycles) {
                if (cycle.pointIds.length >= 3) {
                    const roomId = this._createRoom(cycle.pointIds, cycle.wallIds);
                    if (roomId && this.calculator) {
                        this.calculator.recalculateRoom(roomId);
                    }
                }
            }
            // Блок с findBrokenCycles удалён
        }

        return { success: true };
    }

    _executeWallCreated(command) {
        const data = command.data;
        const p1Id = this._findOrCreatePoint(data.pointStart.x, data.pointStart.y);
        const p2Id = this._findOrCreatePoint(data.pointEnd.x, data.pointEnd.y);
        const wallId = this._addWall(p1Id, p2Id);
        data.pointStartId = p1Id;
        data.pointEndId = p2Id;
        data.wallId = wallId;
    }

    _executeWallRemoved(command) {
        const wallId = command.data.wallId;
        if (!this.canvasData.walls[wallId]) return;

        // 1. Сначала находим комнаты, которые развалятся (пока стена ещё есть)
        const brokenRooms = [];
        for (const roomId in this.canvasData.rooms) {
            const room = this.canvasData.rooms[roomId];
            if (room.wallIds.includes(wallId)) {
                brokenRooms.push(roomId);
            }
        }

        // 2. Удаляем стену
        delete this.canvasData.walls[wallId];

        // 3. Удаляем развалившиеся комнаты
        for (const roomId of brokenRooms) {
            delete this.canvasData.rooms[roomId];
            if (this.actionLog) {
                this.actionLog.addCommand('roomRemoved', { roomId });
                const lastEntry = this.actionLog.getLastActive();
                if (lastEntry && lastEntry.type === 'roomRemoved') {
                    lastEntry.isUndone = true;
                }
            }
        }

        // 4. Из оставшихся комнат удаляем ссылку на стену
        for (const roomId in this.canvasData.rooms) {
            const room = this.canvasData.rooms[roomId];
            const idx = room.wallIds.indexOf(wallId);
            if (idx !== -1) {
                room.wallIds.splice(idx, 1);
            }
        }
    }

    _executePointMoved(command) {
        const pointId = command.data.pointId;
        const newX = command.data.x;
        const newY = command.data.y;
        if (!this.canvasData.points[pointId]) return;
        this.canvasData.points[pointId].x = newX;
        this.canvasData.points[pointId].y = newY;
    }

    _findOrCreatePoint(x, y) {
        for (const id in this.canvasData.points) {
            const pt = this.canvasData.points[id];
            if (Math.abs(pt.x - x) < 0.001 && Math.abs(pt.y - y) < 0.001) {
                return id;
            }
        }
        return this._addPoint(x, y);
    }

    _addPoint(x, y) {
        const id = `p_${++this.canvasData._pointSeq}`;
        this.canvasData.points[id] = { id, x, y };
        return id;
    }

    _addWall(pointStartId, pointEndId) {
        const id = `w_${++this.canvasData._wallSeq}`;
        this.canvasData.walls[id] = {
            id,
            pointStartId,
            pointEndId,
            length: null,
            marker: null,
            openingIds: []
        };
        return id;
    }

    _createRoom(pointIds, wallIds) {
        const roomId = `r_${++this.canvasData._roomSeq}`;
        this.canvasData.rooms[roomId] = {
            id: roomId,
            name: null,
            isGrouped: false,
            pointIds: [...pointIds],
            wallIds: [...wallIds],
            anchorPointId: pointIds[0],
            height: 2500,
            perimeter: null,
            floorArea: null,
            wallArea: null
        };

        if (this.actionLog) {
            this.actionLog.addCommand('roomCreated', { roomId, pointIds, wallIds });
            const lastEntry = this.actionLog.getLastActive();
            if (lastEntry && lastEntry.type === 'roomCreated') {
                lastEntry.isUndone = true;
            }
        }

        return roomId;
    }
}

export default Registry;