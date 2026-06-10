import { EventDispatcher } from './core/events/EventDispatcher.js';
import { Viewport } from './viewport/Viewport.js';
import { InputHandler } from './input/InputHandler.js';
import { setupCanvasContainer } from './ui/CanvasContainer.js';
import { setupZoomIndicator } from './ui/ZoomIndicator.js';
import { setupMenu } from './ui/Menu.js';
import { setupToast } from './ui/Toast.js';
import Registry from './core/registry/Registry.js';
import GeometryValidator from './core/registry/GeometryValidator.js';
import Calculator from './core/registry/Calculator.js';
import GraphAnalyzer from './core/registry/GraphAnalyzer.js';
import CanvasData from './core/data/CanvasData.js';
import ActionLog from './core/events/ActionLog.js';
import ToolManager from './tools/ToolManager.js';

document.addEventListener('DOMContentLoaded', () => {
    const dispatcher = new EventDispatcher();

    // ============================
    // VIEWPORT
    // ============================
    const viewport = Viewport.getInstance();
    viewport.setDispatcher(dispatcher);

    // ============================
    // ЯДРО
    // ============================
    const registry = new Registry();
    registry.validator = new GeometryValidator();
    registry.calculator = new Calculator();
    registry.analyzer = new GraphAnalyzer();

    const actionLog = new ActionLog();
    registry.actionLog = actionLog;

    actionLog.addCommand = (function(originalAdd) {
        return function(type, data, targetId) {
            const entry = originalAdd.call(this, type, data, targetId);
            const result = registry.execute(entry);

            if (result && !result.success) {
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
    window.dispatcher = dispatcher;

    // ============================
    // СЛОИ ОТРИСОВКИ
    // ============================
    setupCanvasContainer(dispatcher);

    // ============================
    // ИНСТРУМЕНТЫ И ВВОД
    // ============================
    const toolManager = new ToolManager();
    toolManager.setDispatcher(dispatcher);

    const inputHandler = new InputHandler(dispatcher);

    // ============================
    // UI
    // ============================
    setupMenu();
    setupToast(dispatcher);
    setupZoomIndicator(dispatcher);

    window.viewport = viewport;
    console.log('EventDispatcher, слои сетки и индикатор готовы');
});