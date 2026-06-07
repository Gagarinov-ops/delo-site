// Единый источник истины о границах холста
const WORLD_WIDTH = 297;
const WORLD_HEIGHT = 297;

// Абсолютные границы в пикселях (для ограничения камеры)
let MIN_X_PX = 0;
let MAX_X_PX = 0;
let MIN_Y_PX = 0;
let MAX_Y_PX = 0;

export function initPanLimits(initialZoom, screenW, screenH) {
    const sheetWPx = WORLD_WIDTH * initialZoom;
    const sheetHPx = WORLD_HEIGHT * initialZoom;
    const offsetXPx = (WORLD_WIDTH / 2) * initialZoom;
    const offsetYPx = (WORLD_HEIGHT / 2) * initialZoom;
    const worldOriginX = (screenW - sheetWPx) / 2;
    const worldOriginY = (screenH - sheetHPx) / 2;
    MIN_X_PX = worldOriginX - offsetXPx;
    MAX_X_PX = worldOriginX + sheetWPx + offsetXPx;
    MIN_Y_PX = worldOriginY - offsetYPx;
    MAX_Y_PX = worldOriginY + sheetHPx + offsetYPx;
}

export function clampPan(viewport) {
    if (viewport.panX < MIN_X_PX) viewport.panX = MIN_X_PX;
    if (viewport.panX > MAX_X_PX) viewport.panX = MAX_X_PX;
    if (viewport.panY < MIN_Y_PX) viewport.panY = MIN_Y_PX;
    if (viewport.panY > MAX_Y_PX) viewport.panY = MAX_Y_PX;
}

export function isValidWorldPoint(x, y) {
    return x >= 0 && x <= WORLD_WIDTH && y >= 0 && y <= WORLD_HEIGHT;
}

export function getWorldSize() {
    return { width: WORLD_WIDTH, height: WORLD_HEIGHT };
}