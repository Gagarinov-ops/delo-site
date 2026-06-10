import { ContainerCoordinatePlane } from './ContainerCoordinatePlane.js';
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

    const plane = new ContainerCoordinatePlane(width, height, dispatcher);
    const origin = plane.getOrigin();
    const planeState = plane.getState();

    window.containerPlane = plane;

    container.style.position = 'absolute';
    container.style.left = (origin.x - width / 2) + 'px';
    container.style.top = (origin.y - height / 2) + 'px';
    container.style.width = width + 'px';
    container.style.height = height + 'px';

    const canvasData = {
        size: { width, height },
        center: { x: 0, y: 0 },
        corners: {
            topLeft:     { x: -width / 2, y: -height / 2 },
            topRight:    { x:  width / 2, y: -height / 2 },
            bottomLeft:  { x: -width / 2, y:  height / 2 },
            bottomRight: { x:  width / 2, y:  height / 2 }
        }
    };

    // Слои
    const gridCanvas = new GridCanvas(dispatcher);
    const mainCanvas = new MainCanvas(dispatcher, 'mainCanvas');
    const overlay = new Overlay(dispatcher, 'overlayCanvas');

    dispatcher.emit('containerPlaneReady', planeState);

    // Данные (теперь создаём экземпляр класса)
    const canvasDataCopy = new CanvasDataCopy(dispatcher);

    // Валидация и обработка инструментов
    const duplicateValidator = new DuplicateValidator(canvasDataCopy);
    const hitTest = new HitTest(dispatcher, canvasDataCopy, duplicateValidator);

    // Управление слоями (теперь LayerManager получает dispatcher)
    const layerManager = new LayerManager(mainCanvas, overlay, dispatcher);

    dispatcher.emit('canvasDefined', canvasData);
}