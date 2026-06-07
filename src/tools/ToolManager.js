class ToolManager {
    constructor() {
        this.tools = {};
        this.activeTool = null;
        this.dispatcher = null;
        this.coordinateMapper = null; // возвращаем
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

        // Отправляем миллиметры в диспетчер (toolResult уже в мм)
        if (this.dispatcher) {
            this.dispatcher.emit('toolResult', {
                gesture: gesture,
                toolResult: toolResult
            });
        }

        // При pointerup — отправляем в ActionLog только валидные точки
        if (gesture === 'pointerup' && this.actionLog && this.coordinateMapper) {
            if (this.coordinateMapper.isValidWorldPoint(toolResult.startX, toolResult.startY) &&
                this.coordinateMapper.isValidWorldPoint(toolResult.endX, toolResult.endY)) {
                this.actionLog.addCommand('wallCreated', {
                    pointStart: { x: toolResult.startX, y: toolResult.startY },
                    pointEnd: { x: toolResult.endX, y: toolResult.endY }
                });
            }
        }

        return toolResult;
    }
}

export default ToolManager;