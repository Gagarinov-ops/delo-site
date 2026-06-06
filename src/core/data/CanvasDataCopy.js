const CanvasDataCopy = {
    points: {},
    walls: {},
    rooms: {},
    openings: {},
    elements: {},
    dimensionLines: {},

    _pointSeq: 0,
    _wallSeq: 0,

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
    }
};

export default CanvasDataCopy;