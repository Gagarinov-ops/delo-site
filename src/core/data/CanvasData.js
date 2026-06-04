const CanvasData = {
    // Полки для объектов
    points: {},          // Point: { id, x, y }
    walls: {},           // Wall: { id, pointStartId, pointEndId, length, marker, openingIds }
    rooms: {},           // Room: { id, name, isGrouped, pointIds, wallIds, anchorPointId, height, perimeter, floorArea, wallArea }
    openings: {},        // Opening: { id, type, width, height, area, wallId, position, offsetFromLeft, offsetFromRight }
    elements: {},        // Element: { id, type, name, tags, x, y }
    dimensionLines: {},  // DimensionLine: { id, wallId, offset, elements }

    // Счётчики ID
    _pointSeq: 0,
    _wallSeq: 0,
    _roomSeq: 0,
    _openingSeq: 0
};

export default CanvasData;