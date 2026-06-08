import GridCanvas from './GridCanvas.js';
import MainCanvas from './MainCanvas.js';
import Overlay from './Overlay.js';
import CanvasDataCopy from '../core/data/CanvasDataCopy.js';
import HitTest from './HitTest.js';
import LayerManager from './LayerManager.js';
import DuplicateValidator from './DuplicateValidator.js';

export function setupCanvasContainer(dispatcher) {
    const container = document.getElementById('canvasContainer');
    const width = 297;
    const height = 297;

    container.style.width = width + 'px';
    container.style.height = height + 'px';

    const canvasData = {
        size: { width, height },
        corners: {
            topLeft:     { x: 0, y: 0 },
            topRight:    { x: width, y: 0 },
            bottomLeft:  { x: 0, y: height },
            bottomRight: { x: width, y: height },
            center:      { x: width / 2, y: height / 2 }
        }
    };

    // Слои — подпишутся на canvasDefined сами
    const gridCanvas = new GridCanvas(dispatcher);
    const mainCanvas = new MainCanvas(dispatcher, 'mainCanvas');
    const overlay = new Overlay(dispatcher, 'overlayCanvas');

    // Данные — синглтон
    const canvasDataCopy = CanvasDataCopy;

    // HitTest + DuplicateValidator
    const duplicateValidator = new DuplicateValidator(canvasDataCopy);
    const hitTest = new HitTest(dispatcher, canvasDataCopy);

    // LayerManager
    const layerManager = new LayerManager(mainCanvas, overlay);
    hitTest.setLayerManager = layerManager;
    layerManager.init(canvasDataCopy, hitTest);

    // toolResult
    dispatcher.on('toolResult', (data) => {
        if (data.gesture === 'pointerup' && data.toolResult) {
            const snappedStart = hitTest.snap(data.toolResult.startX, data.toolResult.startY);
            const snappedEnd = hitTest.snap(data.toolResult.endX, data.toolResult.endY);

            if (duplicateValidator.isDuplicateWall(snappedStart.x, snappedStart.y, snappedEnd.x, snappedEnd.y) ||
                duplicateValidator.isCollinearWithExistingWall(snappedStart.x, snappedStart.y, snappedEnd.x, snappedEnd.y)) {
                return;
            }

            const intersections = hitTest.detectAndSplit(snappedStart.x, snappedStart.y, snappedEnd.x, snappedEnd.y);
            if (intersections) {
                canvasDataCopy.applyWallSplit(intersections);
                dispatcher.emit('wallSplit', { intersections });
            } else {
                canvasDataCopy.saveFromToolResult({ ...data.toolResult, startX: snappedStart.x, startY: snappedStart.y, endX: snappedEnd.x, endY: snappedEnd.y });
                dispatcher.emit('wallCreated', { pointStart: { x: snappedStart.x, y: snappedStart.y }, pointEnd: { x: snappedEnd.x, y: snappedEnd.y } });
            }
        }
    });

    dispatcher.on('commandRejected', () => canvasDataCopy.removeLast());

    // Эмитим canvasDefined — слои и остальные подписчики получат размеры
    dispatcher.emit('canvasDefined', canvasData);
}