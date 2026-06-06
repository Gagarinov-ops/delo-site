class CursorTool {
    constructor() {
        this.name = 'cursor';
        this.coordinateMapper = null;
    }

    setup(coordinateMapper) {
        this.coordinateMapper = coordinateMapper;
    }

    handleGesture(gesture, data) {
        // Пока ничего не делает
    }

    getWorldPosition(screenX, screenY) {
        if (this.coordinateMapper) {
            return this.coordinateMapper.getWorldPosition(screenX, screenY);
        }
        return null;
    }
}

export default CursorTool;