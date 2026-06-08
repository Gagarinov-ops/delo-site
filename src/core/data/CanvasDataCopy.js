const CanvasDataCopy = {
    points: {},
    walls: {},
    rooms: {},
    openings: {},
    elements: {},
    dimensionLines: {},

    _pointSeq: 0,
    _wallSeq: 0,

    _lastAdded: {
        pointIds: [],
        wallId: null
    },

    // Кэш для режима редактирования
    _editCache: {
        active: false,
        pointId: null,
        wallIds: [],
        originalCoords: null
    },

    addPoint(x, y) {
        const id = `p_${++this._pointSeq}`;
        this.points[id] = { id, x, y };
        return id;
    },

    addWall(pointStartId, pointEndId) {
        const id = `w_${++this._wallSeq}`;
        this.walls[id] = {
            id,
            pointStartId,
            pointEndId,
            length: null,
            marker: null,
            openingIds: []
        };
        return id;
    },

    getPoint(id) {
        return this.points[id] || null;
    },

    getWall(id) {
        return this.walls[id] || null;
    },

    saveFromToolResult(toolResult) {
        const p1Id = this.addPoint(toolResult.startX, toolResult.startY);
        const p2Id = this.addPoint(toolResult.endX, toolResult.endY);
        const wallId = this.addWall(p1Id, p2Id);

        this._lastAdded.pointIds = [p1Id, p2Id];
        this._lastAdded.wallId = wallId;
    },

    removeLast() {
        if (this._lastAdded.wallId) {
            delete this.walls[this._lastAdded.wallId];
            this._lastAdded.pointIds.forEach(id => delete this.points[id]);
            this._lastAdded = { pointIds: [], wallId: null };
        }
    },

    applyWallSplit(intersections) {
        intersections.forEach((intersection) => {
            const pt = intersection.intersectionPoint;
            const pointId = this.addPoint(pt.x, pt.y);

            const existingWall = this.walls[intersection.existingWallId];
            if (existingWall) {
                const p1Id = existingWall.pointStartId;
                const p2Id = existingWall.pointEndId;
                delete this.walls[intersection.existingWallId];
                const child1Id = this.addWall(p1Id, pointId);
                const child2Id = this.addWall(pointId, p2Id);
            }

            const newWallStart = intersection.newSplit[0];
            const newWallEnd = intersection.newSplit[1];
            const startPointId = this._findOrCreatePointInCopy(newWallStart.startX, newWallStart.startY);
            const endPointId = this._findOrCreatePointInCopy(newWallEnd.endX, newWallEnd.endY);

            let parentWallId = null;
            for (const wid in this.walls) {
                const w = this.walls[wid];
                if ((w.pointStartId === startPointId && w.pointEndId === endPointId) ||
                    (w.pointStartId === endPointId && w.pointEndId === startPointId)) {
                    parentWallId = wid;
                    break;
                }
            }
            if (!parentWallId) {
                parentWallId = this.addWall(startPointId, endPointId);
            }
            delete this.walls[parentWallId];
            this.addWall(startPointId, pointId);
            this.addWall(pointId, endPointId);
        });
    },

    _findOrCreatePointInCopy(x, y) {
        for (const id in this.points) {
            const p = this.points[id];
            if (Math.abs(p.x - x) < 0.001 && Math.abs(p.y - y) < 0.001) {
                return id;
            }
        }
        return this.addPoint(x, y);
    }
};

export default CanvasDataCopy;