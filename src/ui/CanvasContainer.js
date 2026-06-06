import Overlay from './Overlay.js';
import MainCanvas from './MainCanvas.js';

export function setupCanvasContainer(viewport, dispatcher, canvasDataCopy) {
    const container = document.getElementById('canvasContainer');
    const mainCanvas = new MainCanvas('mainCanvas');
    const overlayCanvas = document.getElementById('overlayCanvas');
    const dpr = window.devicePixelRatio || 1;

    const overlay = new Overlay('overlayCanvas');

    // Текущие параметры камеры (обновляются через cameraChanged)
    let currentZoom = viewport.getZoom();

    // Перевод миллиметров в координаты холста (пиксели)
    function toCanvas(worldX, worldY) {
        return {
            x: worldX * currentZoom,
            y: worldY * currentZoom
        };
    }

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

        Object.values(canvasDataCopy.walls).forEach(wall => {
            const p1 = canvasDataCopy.getPoint(wall.pointStartId);
            const p2 = canvasDataCopy.getPoint(wall.pointEndId);
            if (p1 && p2) {
                const screenP1 = toCanvas(p1.x, p1.y);
                const screenP2 = toCanvas(p2.x, p2.y);
                mainCanvas.drawLine(screenP1.x, screenP1.y, screenP2.x, screenP2.y);
            }
        });

        Object.values(canvasDataCopy.points).forEach(point => {
            const screenP = toCanvas(point.x, point.y);
            mainCanvas.drawPoint(screenP.x, screenP.y);
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

    // Подписка на изменения камеры — обновляем параметры и перерисовываем
    dispatcher.on('cameraChanged', (data) => {
        currentZoom = data.zoom;

        updateSize();
        updatePosition();
        redrawMainCanvas();
    });

    dispatcher.on('toolResult', (data) => {
        if (!data.toolResult) return;

        overlay.clear();

        if (data.gesture === 'pointerup') {
            return;
        }

        // Преобразуем миллиметры в координаты холста
        const screenStart = toCanvas(data.toolResult.startX, data.toolResult.startY);
        const screenCurrent = toCanvas(data.toolResult.currentX, data.toolResult.currentY);

        // Рисуем пунктирное превью
        overlay.drawDashedLine(
            screenStart.x,
            screenStart.y,
            screenCurrent.x,
            screenCurrent.y
        );
    });

    dispatcher.on('commandApproved', (entry) => {
        if (entry.type !== 'wallCreated') return;

        const wall = canvasDataCopy.getWall(canvasDataCopy._lastAdded.wallId);
        if (!wall) return;

        const p1 = canvasDataCopy.getPoint(wall.pointStartId);
        const p2 = canvasDataCopy.getPoint(wall.pointEndId);
        if (!p1 || !p2) return;

        const screenP1 = toCanvas(p1.x, p1.y);
        const screenP2 = toCanvas(p2.x, p2.y);
        mainCanvas.drawLine(screenP1.x, screenP1.y, screenP2.x, screenP2.y);
        mainCanvas.drawPoint(screenP1.x, screenP1.y);
        mainCanvas.drawPoint(screenP2.x, screenP2.y);
    });

    return { updatePosition, updateSize };
}