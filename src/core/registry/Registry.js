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
        } else if (command.type === 'wallSplit') {
            this._executeWallSplit(command);
        }

        if (this.calculator) {
            if (command.type === 'wallSplit') {
                if (command.data.childWallIds) {
                    command.data.childWallIds.forEach(wallId => {
                        const wall = this.canvasData.walls[wallId];
                        if (wall) {
                            const p1 = this.canvasData.points[wall.pointStartId];
                            const p2 = this.canvasData.points[wall.pointEndId];
                            if (p1 && p2) {
                                const dx = p2.x - p1.x;
                                const dy = p2.y - p1.y;
                                wall.length = Math.round(Math.sqrt(dx * dx + dy * dy));
                            }
                        }
                    });
                }
                this.calculator.recalculateAllRooms();
            } else {
                this.calculator.recalculate(command);
            }
        }

        if (this.analyzer) {
            const cycles = this.analyzer.findCycles(command);
            for (const cycle of cycles) {
                if (cycle.pointIds.length >= 3) {
                    this._createRoom(cycle.pointIds, cycle.wallIds);
                }
            }
        }

        return { success: true };
    }

    _executeWallCreated(command) {
        const data = command.data;
        const p1Id = this._findOrCreatePoint(data.pointStart.x, data.pointStart.y);
        const p2Id = this._findOrCreatePoint(data.pointEnd.x, data.pointEnd.y);

        // Проверка на дубликат стены
        if (this._isDuplicateWall(p1Id, p2Id)) {
            return; // молчаливый отказ
        }

        const wallId = this._addWall(p1Id, p2Id);
        data.pointStartId = p1Id;
        data.pointEndId = p2Id;
        data.wallId = wallId;
    }

    _isDuplicateWall(p1Id, p2Id) {
        for (const id in this.canvasData.walls) {
            const w = this.canvasData.walls[id];
            if ((w.pointStartId === p1Id && w.pointEndId === p2Id) ||
                (w.pointStartId === p2Id && w.pointEndId === p1Id)) {
                return true;
            }
        }
        return false;
    }

    _executeWallRemoved(command) {
        const wallId = command.data.wallId;
        if (!this.canvasData.walls[wallId]) return;

        const brokenRooms = [];
        for (const roomId in this.canvasData.rooms) {
            const room = this.canvasData.rooms[roomId];
            if (room.wallIds.includes(wallId)) {
                brokenRooms.push(roomId);
            }
        }

        delete this.canvasData.walls[wallId];

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

    _executeWallSplit(command) {
        const data = command.data;
        const intersections = data.intersections;
        const allChildWallIds = [];

        intersections.forEach((intersection) => {
            const pt = intersection.intersectionPoint;
            const pointId = this._addPoint(pt.x, pt.y);

            const existingWall = this.canvasData.walls[intersection.existingWallId];
            if (existingWall) {
                const child1Id = this._addWall(existingWall.pointStartId, pointId);
                const child2Id = this._addWall(pointId, existingWall.pointEndId);
                allChildWallIds.push(child1Id, child2Id);

                existingWall.childWallIds = [child1Id, child2Id];
                existingWall.isSplit = true;
            }

            const newWallStart = intersection.newSplit[0];
            const newWallEnd = intersection.newSplit[1];
            const startPointId = this._findOrCreatePoint(newWallStart.startX, newWallStart.startY);
            const endPointId = this._findOrCreatePoint(newWallEnd.endX, newWallEnd.endY);

            const parentWallId = this._addWall(startPointId, endPointId);
            allChildWallIds.push(parentWallId);

            const newChild1Id = this._addWall(startPointId, pointId);
            const newChild2Id = this._addWall(pointId, endPointId);
            allChildWallIds.push(newChild1Id, newChild2Id);

            const parentWall = this.canvasData.walls[parentWallId];
            if (parentWall) {
                parentWall.childWallIds = [newChild1Id, newChild2Id];
                parentWall.isSplit = true;
            }
        });

        data.childWallIds = allChildWallIds;
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
            openingIds: [],
            childWallIds: [],
            isSplit: false
        };
        return id;
    }

    _isDuplicateRoom(wallIds) {
        const roomKey = [...wallIds].sort().join(',');
        for (const roomId in this.canvasData.rooms) {
            const room = this.canvasData.rooms[roomId];
            const existingKey = [...room.wallIds].sort().join(',');
            if (existingKey === roomKey) {
                return true;
            }
        }
        return false;
    }

    _createRoom(pointIds, wallIds) {
        // Проверка на дубликат комнаты
        if (this._isDuplicateRoom(wallIds)) {
            return null;
        }

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