import Overlay from './Overlay.js';
import MainCanvas from './MainCanvas.js';

export function setupCanvasContainer(viewport, dispatcher, canvasDataCopy) {
    const container = document.getElementById('canvasContainer');
    const mainCanvas = new MainCanvas('mainCanvas');
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

    function redrawMainCanvas() {
        const w = mainCanvas.canvas.width / dpr;
        const h = mainCanvas.canvas.height / dpr;
        mainCanvas.ctx.clearRect(0, 0, w, h);

        // Рисуем все стены
        Object.values(canvasDataCopy.walls).forEach(wall => {
            const p1 = canvasDataCopy.getPoint(wall.pointStartId);
            const p2 = canvasDataCopy.getPoint(wall.pointEndId);
            if (p1 && p2) {
                mainCanvas.drawLine(p1.x, p1.y, p2.x, p2.y);
            }
        });

        // Рисуем все точки
        Object.values(canvasDataCopy.points).forEach(point => {
            mainCanvas.drawPoint(point.x, point.y);
        });
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

        redrawMainCanvas();
    }

    // Подписка на toolResult от ToolManager (пиксели)
    dispatcher.on('toolResult', (data) => {
        if (!data.toolResult) return;

        overlay.clear();

        if (data.gesture === 'pointerup') {
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

    // Подписка на commandApproved — рисуем подтверждённую стену на MainCanvas
    dispatcher.on('commandApproved', (entry) => {
        if (entry.type !== 'wallCreated') return;

        const wall = canvasDataCopy.getWall(canvasDataCopy._lastAdded.wallId);
        if (!wall) return;

        const p1 = canvasDataCopy.getPoint(wall.pointStartId);
        const p2 = canvasDataCopy.getPoint(wall.pointEndId);
        if (!p1 || !p2) return;

        mainCanvas.drawLine(p1.x, p1.y, p2.x, p2.y);
        // Точки на концах стены
        mainCanvas.drawPoint(p1.x, p1.y);
        mainCanvas.drawPoint(p2.x, p2.y);
    });

    return { updatePosition, updateSize };
}