import { isValidWorldPoint } from './PanLimits.js';

class CoordinateMapper {
    constructor(dispatcher) {
        this.dispatcher = dispatcher;
        this.zoom = 1;
        this.panX = 0;
        this.panY = 0;

        this._lastScreenX = 0;
        this._lastScreenY = 0;

        this.dispatcher.on('cameraChanged', this._onCameraChanged.bind(this));
        this.dispatcher.on('toolGesture', this._onToolGesture.bind(this));
    }

    remember(screenX, screenY) {
        this._lastScreenX = screenX;
        this._lastScreenY = screenY;
    }

    _onCameraChanged(data) {
        this.zoom = data.zoom;
        this.panX = data.panX;
        this.panY = data.panY;
    }

    _onToolGesture(data) {
        const { gesture, screenX, screenY } = data;
        const worldX = (screenX - this.panX) / this.zoom;
        const worldY = (screenY - this.panY) / this.zoom;

        if (this.isValidWorldPoint(worldX, worldY)) {
            this.dispatcher.emit('worldCoords', {
                gesture: gesture,
                worldX: worldX,
                worldY: worldY
            });

            this.dispatcher.emit('screenCoords', {
                gesture: gesture,
                screenX: screenX,
                screenY: screenY
            });
        }
    }

    // Публичный метод для проверки валидности мировых координат
    isValidWorldPoint(x, y) {
        return isValidWorldPoint(x, y);
    }

    screenToWorld(screenX, screenY) {
        return {
            x: (screenX - this.panX) / this.zoom,
            y: (screenY - this.panY) / this.zoom
        };
    }

    screenToCanvas(screenX, screenY) {
        return {
            x: screenX - this.panX,
            y: screenY - this.panY
        };
    }

    translateToolResult(toolResult) {
        if (!toolResult) return null;

        const translated = {};

        if (toolResult.startX !== undefined && toolResult.startY !== undefined) {
            const canvas = this.screenToCanvas(toolResult.startX, toolResult.startY);
            translated.startX = canvas.x;
            translated.startY = canvas.y;
        }
        if (toolResult.currentX !== undefined && toolResult.currentY !== undefined) {
            const canvas = this.screenToCanvas(toolResult.currentX, toolResult.currentY);
            translated.currentX = canvas.x;
            translated.currentY = canvas.y;
        }
        if (toolResult.endX !== undefined && toolResult.endY !== undefined) {
            const canvas = this.screenToCanvas(toolResult.endX, toolResult.endY);
            translated.endX = canvas.x;
            translated.endY = canvas.y;
        }

        return translated;
    }

    translateToolResultToWorld(toolResult) {
        if (!toolResult) return null;

        const translated = {};

        if (toolResult.startX !== undefined && toolResult.startY !== undefined) {
            const world = this.screenToWorld(toolResult.startX, toolResult.startY);
            translated.startX = world.x;
            translated.startY = world.y;
        }
        if (toolResult.endX !== undefined && toolResult.endY !== undefined) {
            const world = this.screenToWorld(toolResult.endX, toolResult.endY);
            translated.endX = world.x;
            translated.endY = world.y;
        }

        return translated;
    }
}

export default CoordinateMapper;