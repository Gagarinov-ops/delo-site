class ToolManager {
    constructor() {
        this.tools = {};
        this.activeTool = null;
        this.dispatcher = null;
        this.coordinateMapper = null;
        this.actionLog = null;
    }

    setDispatcher(dispatcher) {
        this.dispatcher = dispatcher;
    }

    setCoordinateMapper(mapper) {
        this.coordinateMapper = mapper;
    }

    setActionLog(actionLog) {
        this.actionLog = actionLog;
    }

    register(name, tool) {
        this.tools[name] = tool;
        if (!this.activeTool) {
            this.activeTool = tool;
        }
    }

    activate(name) {
        if (this.tools[name]) {
            this.activeTool = this.tools[name];
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

        // Переводим координаты в миллиметры через CoordinateMapper
        let worldResult = toolResult;
        if (this.coordinateMapper) {
            this.coordinateMapper.remember(data.x, data.y);
            worldResult = this.coordinateMapper.translateToolResultToWorld(toolResult);
        }

        // Отправляем миллиметры в диспетчер
        if (this.dispatcher) {
            this.dispatcher.emit('toolResult', {
                gesture: gesture,
                toolResult: worldResult
            });
        }

        // При pointerup — отправляем в ActionLog (миллиметры)
        if (gesture === 'pointerup' && this.actionLog && this.coordinateMapper) {
            this.actionLog.addCommand('wallCreated', {
                pointStart: { x: worldResult.startX, y: worldResult.startY },
                pointEnd: { x: worldResult.endX, y: worldResult.endY }
            });
        }

        return toolResult;
    }
}

export default ToolManager;