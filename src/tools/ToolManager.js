class ToolManager {
    constructor() {
        this.tools = {};
        this.activeTool = null;
        this.dispatcher = null;
        this.coordinateMapper = null;
    }

    setDispatcher(dispatcher) {
        this.dispatcher = dispatcher;
    }

    setCoordinateMapper(mapper) {
        this.coordinateMapper = mapper;
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