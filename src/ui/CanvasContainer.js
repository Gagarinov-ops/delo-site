export function setupCanvasContainer(viewport) {
    const container = document.getElementById('canvasContainer');
    const mainCanvas = document.getElementById('mainCanvas');
    const overlayCanvas = document.getElementById('overlayCanvas');
    const dpr = window.devicePixelRatio || 1;

    function updatePosition() {
        const { panX, panY } = viewport.getPan();
        container.style.transform = `translate(${panX}px, ${panY}px)`;
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
            ctxOverlay.clearRect(0, 0, widthPx, heightPx);
        }
    }

    return { updatePosition, updateSize };
}