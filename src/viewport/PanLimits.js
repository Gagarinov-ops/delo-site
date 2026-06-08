const WORLD_WIDTH = 297;
const WORLD_HEIGHT = 297;

export class PanLimits {
    constructor() {
        this.worldWidth = WORLD_WIDTH;
        this.worldHeight = WORLD_HEIGHT;
        this.minPanX = 0;
        this.maxPanX = 0;
        this.minPanY = 0;
        this.maxPanY = 0;
    }

    init(initialZoom, screenW, screenH) {
        const sheetWPx = WORLD_WIDTH * initialZoom;
        const sheetHPx = WORLD_HEIGHT * initialZoom;
        const offsetXPx = (WORLD_WIDTH / 2) * initialZoom;
        const offsetYPx = (WORLD_HEIGHT / 2) * initialZoom;
        const worldOriginX = (screenW - sheetWPx) / 2;
        const worldOriginY = (screenH - sheetHPx) / 2;

        this.minPanX = worldOriginX - offsetXPx;
        this.maxPanX = worldOriginX + sheetWPx + offsetXPx;
        this.minPanY = worldOriginY - offsetYPx;
        this.maxPanY = worldOriginY + sheetHPx + offsetYPx;
    }

    getLimits() {
        return {
            worldWidth: this.worldWidth,
            worldHeight: this.worldHeight,
            minPanX: this.minPanX,
            maxPanX: this.maxPanX,
            minPanY: this.minPanY,
            maxPanY: this.maxPanY
        };
    }
}

// Сохраняем для CoordinateMapper
export function isValidWorldPoint(x, y) {
    return x >= 0 && x <= WORLD_WIDTH && y >= 0 && y <= WORLD_HEIGHT;
}

export function getWorldSize() {
    return { width: WORLD_WIDTH, height: WORLD_HEIGHT };
}