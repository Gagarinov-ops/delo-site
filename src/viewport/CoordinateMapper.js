class CoordinateMapper {
    constructor(dispatcher) {
        this.dispatcher = dispatcher;
        this.zoom = 1;
        this.panX = 0;
        this.panY = 0;

        // Последние экранные координаты, запомненные для будущего перевода в мм
        this._lastScreenX = 0;
        this._lastScreenY = 0;

        // Подписка на изменения камеры
        this.dispatcher.on('cameraChanged', this._onCameraChanged.bind(this));

        // Подписка на жесты от ToolManager
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

        // Переводим экранные пиксели в мировые миллиметры
        const worldX = (screenX - this.panX) / this.zoom;
        const worldY = (screenY - this.panY) / this.zoom;

        // Отправляем мировые координаты
        this.dispatcher.emit('worldCoords', {
            gesture: gesture,
            worldX: worldX,
            worldY: worldY
        });

        // Отправляем экранные координаты (для Overlay)
        this.dispatcher.emit('screenCoords', {
            gesture: gesture,
            screenX: screenX,
            screenY: screenY
        });
    }

    // Переводит экранные координаты в миллиметры (для Registry)
    screenToWorld(screenX, screenY) {
        return {
            x: (screenX - this.panX) / this.zoom,
            y: (screenY - this.panY) / this.zoom
        };
    }

    // Переводит экранные координаты в пиксели контейнера (для Overlay)
    screenToCanvas(screenX, screenY) {
        return {
            x: screenX - this.panX,
            y: screenY - this.panY
        };
    }

    translateToolResult(toolResult) {
        if (!toolResult) return null;

        const translated = {};

        // Переводим стартовую точку в пиксели контейнера
        if (toolResult.startX !== undefined && toolResult.startY !== undefined) {
            const canvas = this.screenToCanvas(toolResult.startX, toolResult.startY);
            translated.startX = canvas.x;
            translated.startY = canvas.y;
        }

        // Переводим текущую точку (для pointermove)
        if (toolResult.currentX !== undefined && toolResult.currentY !== undefined) {
            const canvas = this.screenToCanvas(toolResult.currentX, toolResult.currentY);
            translated.currentX = canvas.x;
            translated.currentY = canvas.y;
        }

        // Переводим конечную точку (для pointerup)
        if (toolResult.endX !== undefined && toolResult.endY !== undefined) {
            const canvas = this.screenToCanvas(toolResult.endX, toolResult.endY);
            translated.endX = canvas.x;
            translated.endY = canvas.y;
        }

        return translated;
    }
}

export default CoordinateMapper;