const CanvasDataCopy = {
    points: {},          // Point: { id, x, y } — в пикселях
    walls: {},           // Wall: { id, pointStartId, pointEndId, length, marker, openingIds }
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
    }
};

export default CanvasDataCopy;