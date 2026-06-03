// Абсолютные границы в пикселях, привязанные к мировому положению листа  
let MIN_X_PX = 0;  
let MAX_X_PX = 0;  
let MIN_Y_PX = 0;  
let MAX_Y_PX = 0;  

export function initPanLimits(initialZoom, screenW, screenH) {  
    // Размер листа в пикселях при начальном zoom  
    const sheetWPx = 210 * initialZoom;  
    const sheetHPx = 297 * initialZoom;  

    // Отступы от краёв листа в пикселях  
    const offsetXPx = 105 * initialZoom;  
    const offsetYPx = 148.5 * initialZoom;  

    // Мировое положение листа: левый верхний угол листа в пикселях экрана  
    // При начальном zoom лист в центре экрана  
    const worldOriginX = (screenW - sheetWPx) / 2;  
    const worldOriginY = (screenH - sheetHPx) / 2;  

    // Абсолютные границы: от мирового положения листа ± отступ  
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
