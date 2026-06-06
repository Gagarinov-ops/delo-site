import { EventDispatcher } from './core/events/EventDispatcher.js';  
import { Viewport } from './viewport/Viewport.js';  
import { InputHandler } from './input/InputHandler.js';  
import { setupGridLayers } from './ui/GridLayers.js';  
import { setupCanvasContainer } from './ui/CanvasContainer.js';  
import { setupZoomIndicator } from './ui/ZoomIndicator.js';  
import { setupMenu } from './ui/Menu.js';  
import { setupResize } from './viewport/Resize.js';  
import { setupDisplayDetector } from './viewport/DisplayDetector.js';  
import { setupToast } from './ui/Toast.js';  
import Registry from './core/registry/Registry.js';  
import GeometryValidator from './core/registry/GeometryValidator.js';  
import Calculator from './core/registry/Calculator.js';  
import GraphAnalyzer from './core/registry/GraphAnalyzer.js';  
import CanvasData from './core/data/CanvasData.js';  
import ActionLog from './core/events/ActionLog.js';  
import CanvasDataCopy from './core/data/CanvasDataCopy.js';  
import ToolManager from './tools/ToolManager.js';  
import CursorTool from './tools/CursorTool.js';  
import PencilTool from './tools/PencilTool.js';  
import CoordinateMapper from './viewport/CoordinateMapper.js';  

// ---------- Логика Viewport, контейнера и диспетчера ----------  
document.addEventListener('DOMContentLoaded', () => {  
    const dispatcher = new EventDispatcher();  
    const viewport = Viewport.getInstance();  

    // Передаём диспетчер во Viewport (и в Zoom)
    viewport.setDispatcher(dispatcher);

    // CoordinateMapper — центр координат, подписывается на cameraChanged и toolGesture
    const coordinateMapper = new CoordinateMapper(dispatcher);
    window.coordinateMapper = coordinateMapper;

    // Отправляем начальные параметры камеры
    dispatcher.emit('cameraChanged', {
        zoom: viewport.getZoom(),
        panX: viewport.getPan().panX,
        panY: viewport.getPan().panY
    });

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
            const result = registry.execute(entry);
            
            if (result && !result.success) {
                // Удаляем невалидную запись из журнала
                const idx = this.entries.indexOf(entry);
                if (idx !== -1) {
                    this.entries.splice(idx, 1);
                }
                dispatcher.emit('commandRejected', { entry, error: result.error });
                dispatcher.emit('showToast', { message: result.error });
                return result;
            }
            
            dispatcher.emit('commandApproved', entry);
            return entry;
        };
    })(actionLog.addCommand.bind(actionLog));

    window.registry = registry;
    window.CanvasData = CanvasData;
    window.actionLog = actionLog;
    window.CanvasDataCopy = CanvasDataCopy;
    window.dispatcher = dispatcher;

    // Подписки для CanvasDataCopy
    dispatcher.on('toolResult', (data) => {
        if (data.gesture === 'pointerup' && data.toolResult) {
            CanvasDataCopy.saveFromToolResult(data.toolResult);
        }
    });

    dispatcher.on('commandRejected', () => {
        CanvasDataCopy.removeLast();
    });

    setupMenu();
    setupToast(dispatcher);

    const canvasContainer = setupCanvasContainer(viewport, dispatcher, CanvasDataCopy);
    const { updatePosition, updateSize } = canvasContainer;
    window._canvasContainer = canvasContainer;

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

    // Инструменты
    const toolManager = new ToolManager();
    toolManager.setDispatcher(dispatcher);  // передаём диспетчер
    toolManager.setCoordinateMapper(coordinateMapper);  // передаём CoordinateMapper
    toolManager.setActionLog(actionLog);  // передаём ActionLog
    toolManager.register('cursor', new CursorTool());
    toolManager.register('pencil', new PencilTool());

    function activateTool(toolName) {
        toolManager.activate(toolName);
        
        document.querySelectorAll('.tool-btn[data-tool]').forEach(btn => {
            btn.classList.remove('active');
        });
        const activeBtn = document.querySelector(`.tool-btn[data-tool="${toolName}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
    }

    document.querySelector('[data-tool="cursor"]')?.addEventListener('click', () => activateTool('cursor'));
    document.querySelector('[data-tool="pencil"]')?.addEventListener('click', () => activateTool('pencil'));

    activateTool('cursor');
    window.toolManager = toolManager;

    updateSize();
    updatePosition();
    // Начальное событие зума для индикатора и сетки  
    dispatcher.emit('zoomChanged', { zoomLevel: viewport.getCurrentZoomLevel() });  

    window.viewport = viewport;  
    console.log('EventDispatcher, слои сетки и индикатор готовы');  
});