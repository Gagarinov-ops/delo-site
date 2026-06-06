import Overlay from './Overlay.js';

export function setupCanvasContainer(viewport, dispatcher, canvasDataCopy) {
    const container = document.getElementById('canvasContainer');
    const mainCanvas = document.getElementById('mainCanvas');
    const overlayCanvas = document.getElementById('overlayCanvas');
    const dpr = window.devicePixelRatio || 1;

    const overlay = new Overlay('overlayCanvas');

    function updatePosition() {
        const { panX, panY } = viewport.getPan();
        container.style.transform = `translate(${panX}px, ${panY}px)`;

        if (window.toolManager && window.toolManager.getActiveName() !== 'cursor') {
            overlayCanvas.style.pointerEvents = 'auto';
        } else {
            overlayCanvas.style.pointerEvents = 'none';
        }
    }

    function updateSize() {
        const zoom = viewport.getZoom();
        const widthPx = viewport.worldWidth * zoom;
        const heightPx = viewport.worldHeight * zoom;

        container.style.width = widthPx + 'px';
        container.style.height = heightPx + 'px';

        const canvasWidthPhys = widthPx * dpr;
        const canvasHeightPhys = heightPx * dpr;
        mainCanvas.width = canvasWidthPhys;
        mainCanvas.height = canvasHeightPhys;
        overlayCanvas.width = canvasWidthPhys;
        overlayCanvas.height = canvasHeightPhys;

        const ctxMain = mainCanvas.getContext('2d');
        const ctxOverlay = overlayCanvas.getContext('2d');
        if (ctxMain) ctxMain.setTransform(dpr, 0, 0, dpr, 0, 0);
        if (ctxOverlay) {
            ctxOverlay.setTransform(dpr, 0, 0, dpr, 0, 0);
            overlay.clear(); // очищаем Overlay при изменении размера
        }
    }

    // Подписка на toolResult от ToolManager (пиксели)
    dispatcher.on('toolResult', (data) => {
        if (!data.toolResult) return;

        overlay.clear();

        if (data.gesture === 'pointerup') {
            // Пока ничего — фиксация на MainCanvas будет позже
            return;
        }

        // Превью на Overlay
        overlay.drawLine(
            data.toolResult.startX,
            data.toolResult.startY,
            data.toolResult.currentX,
            data.toolResult.currentY
        );
    });

    return { updatePosition, updateSize };
}