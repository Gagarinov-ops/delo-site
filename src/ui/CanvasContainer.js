import Overlay from './Overlay.js';
import MainCanvas from './MainCanvas.js';
import HitTest from './HitTest.js';

export function setupCanvasContainer(viewport, dispatcher, canvasDataCopy) {
    const container = document.getElementById('canvasContainer');
    const mainCanvas = new MainCanvas('mainCanvas');
    const overlayCanvas = document.getElementById('overlayCanvas');
    const dpr = window.devicePixelRatio || 1;

    const overlay = new Overlay('overlayCanvas');

    dispatcher.emit('gridConfig', [
        { id: 'gridLayerFine', zoomMin: 0, zoomMax: 0, step: '1' },
        { id: 'gridLayerMedium', zoomMin: 1, zoomMax: 4, step: '5' }
    ]);

    const hitTest = new HitTest(dispatcher, canvasDataCopy, viewport);

    hitTest.onDrawPreview = (x1, y1, x2, y2) => {
        overlay.clear();
        overlay.drawDashedLine(x1, y1, x2, y2);
    };
    hitTest.onClearOverlay = () => {
        overlay.clear();
    };
    hitTest.onDrawLine = (x1, y1, x2, y2) => {
        mainCanvas.drawLine(x1, y1, x2, y2);
    };
    hitTest.onDrawPoint = (x, y) => {
        mainCanvas.drawPoint(x, y);
    };

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
        mainCanvas.canvas.width = canvasWidthPhys;
        mainCanvas.canvas.height = canvasHeightPhys;
        overlayCanvas.width = canvasWidthPhys;
        overlayCanvas.height = canvasHeightPhys;

        mainCanvas.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        const ctxOverlay = overlayCanvas.getContext('2d');
        if (ctxOverlay) {
            ctxOverlay.setTransform(dpr, 0, 0, dpr, 0, 0);
            overlay.clear();
        }

        hitTest.redrawAll();
    }

    dispatcher.on('cameraChanged', () => {
        updateSize();
        updatePosition();
    });

    return { updatePosition, updateSize, hitTest };
}