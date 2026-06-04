import { EventDispatcher } from './core/events/EventDispatcher.js';  
import { Viewport } from './viewport/Viewport.js';  
import { InputHandler } from './input/InputHandler.js';  
import { setupGridLayers } from './ui/GridLayers.js';  
import { setupCanvasContainer } from './ui/CanvasContainer.js';  
import { setupZoomIndicator } from './ui/ZoomIndicator.js';  
import { setupMenu } from './ui/Menu.js';  
import { setupResize } from './viewport/Resize.js';  
import { setupDisplayDetector } from './viewport/DisplayDetector.js';  
import Registry from './core/registry/Registry.js';  
import GeometryValidator from './core/registry/GeometryValidator.js';  
import Calculator from './core/registry/Calculator.js';  
import GraphAnalyzer from './core/registry/GraphAnalyzer.js';  
import CanvasData from './core/data/CanvasData.js';  
import ActionLog from './core/events/ActionLog.js';  

// ---------- Логика Viewport, контейнера и диспетчера ----------  
document.addEventListener('DOMContentLoaded', () => {  
    const dispatcher = new EventDispatcher();  
    const viewport = Viewport.getInstance();  

    // Передаём диспетчер во Viewport (и в Zoom)
    viewport.setDispatcher(dispatcher);

    // Ядро
    const registry = new Registry();
    registry.validator = new GeometryValidator();
    registry.calculator = new Calculator();
    registry.analyzer = new GraphAnalyzer();

    const actionLog = new ActionLog();
    registry.actionLog = actionLog;

    // При добавлении команды в ActionLog → Registry выполняет её
    actionLog.addCommand = (function(originalAdd) {
        return function(type, data, targetId) {
            const entry = originalAdd.call(this, type, data, targetId);
            registry.execute(entry);
            dispatcher.emit('commandAdded', entry);
            return entry;
        };
    })(actionLog.addCommand.bind(actionLog));

    window.registry = registry;
    window.CanvasData = CanvasData;
    window.actionLog = actionLog;

    setupMenu();

    const { updatePosition, updateSize } = setupCanvasContainer(viewport);  

    // InputHandler теперь вызывает колбэк с событиями  
    const inputHandler = new InputHandler((type, data) => {  
        if (type === 'panChanged') {
            updatePosition();
        } else if (type === 'zoomChanged') {
            updateSize();
            updatePosition();
        }
        dispatcher.emit(type, data);  
    });  

    // Инициализация индикатора зума  
    setupZoomIndicator(dispatcher, viewport);  

    // Инициализация сетки (отправит gridConfig, который Zoom уже ждёт)
    setupGridLayers(dispatcher, viewport);  

    // Инициализация адаптации под DPR
    setupDisplayDetector(dispatcher);

    // Кнопка сброса  
    const resetBtn = document.getElementById('resetZoomButton');  
    if (resetBtn) {  
        resetBtn.addEventListener('click', () => {  
            viewport.reset();  
            updateSize();
            updatePosition();
            dispatcher.emit('zoomChanged', { zoomLevel: viewport.getCurrentZoomLevel() });  
            dispatcher.emit('panChanged', viewport.getPan());  
        });  
    }  

    // Ресайз окна
    setupResize(viewport, dispatcher, updateSize, updatePosition);

    updateSize();
    updatePosition();
    // Начальное событие зума для индикатора и сетки  
    dispatcher.emit('zoomChanged', { zoomLevel: viewport.getCurrentZoomLevel() });  

    window.viewport = viewport;  
    console.log('EventDispatcher, слои сетки и индикатор готовы');  
});