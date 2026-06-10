import CursorTool from './CursorTool.js';
import PencilTool from './PencilTool.js';

class ToolManager {
    constructor() {
        this.tools = {};
        this.activeTool = null;
        this.dispatcher = null;

        this.toolbar = document.getElementById('toolbar');
        this.geometry = { left: 0, top: 0, width: 0, height: 0, buttons: {} };
        this._handleResize = this._handleResize.bind(this);

        if (this.toolbar) {
            this.updateGeometry();
            window.addEventListener('resize', this._handleResize);
            window.addEventListener('orientationchange', this._handleResize);
        }

        this._registerDefaultTools();
    }

    _registerDefaultTools() {
        this.register('cursor', new CursorTool());
        this.register('pencil', new PencilTool());
    }

    _handleResize() {
        this.updateGeometry();
    }

    updateGeometry() {
        if (!this.toolbar) return;
        const rect = this.toolbar.getBoundingClientRect();
        this.geometry.left = rect.left;
        this.geometry.top = rect.top;
        this.geometry.width = rect.width;
        this.geometry.height = rect.height;

        const buttons = this.toolbar.querySelectorAll('.tool-btn');
        this.geometry.buttons = {};
        buttons.forEach(btn => {
            const name = btn.dataset.tool;
            if (name) {
                this.geometry.buttons[name] = btn.getBoundingClientRect();
            }
        });
    }

    setDispatcher(dispatcher) {
        this.dispatcher = dispatcher;
        dispatcher.on('toolbarGesture', this._handleToolbarGesture.bind(this));
    }

    _handleToolbarGesture({ gesture, x, y }) {
        if (gesture !== 'pointerdown') return;

        for (const [name, rect] of Object.entries(this.geometry.buttons)) {
            if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
                this.activate(name);
                document.querySelectorAll('.tool-btn').forEach(btn => btn.classList.remove('active'));
                const btn = document.querySelector(`.tool-btn[data-tool="${name}"]`);
                if (btn) btn.classList.add('active');
                break;
            }
        }
    }

    register(name, tool) {
        this.tools[name] = tool;
        if (!this.activeTool) {
            this.activeTool = tool;
            window.activeToolName = name;
        }
    }

    activate(name) {
        if (this.tools[name]) {
            this.activeTool = this.tools[name];
            window.activeToolName = name;
        }
    }

    getActive() {
        return this.activeTool;
    }

    getActiveName() {
        for (const name in this.tools) {
            if (this.tools[name] === this.activeTool) {
                return name;
            }
        }
        return null;
    }

    handleGesture(gesture, data) {
        let toolResult = null;
        if (this.activeTool && this.activeTool.handleGesture) {
            toolResult = this.activeTool.handleGesture(gesture, data);
        }

        if (!toolResult) return null;

        if (this.dispatcher) {
            this.dispatcher.emit('toolResult', {
                gesture: gesture,
                toolResult: toolResult
            });
        }

        return toolResult;
    }
}

export default ToolManager;