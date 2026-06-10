class LayerManager {
    constructor(mainCanvas, overlay, dispatcher) {
        this.mainCanvas = mainCanvas;
        this.overlay = overlay;
        this.dispatcher = dispatcher;

        // Размеры контейнера в миллиметрах (константы)
        this.containerWidth = 297;
        this.containerHeight = 297;
        this.containerMinX = -this.containerWidth / 2;  // -148.5
        this.containerMinY = -this.containerHeight / 2; // -148.5

        // Подписки на события от HitTest
        this.dispatcher.on('startDraft', this._onStartDraft.bind(this));
        this.dispatcher.on('moveDraft', this._onMoveDraft.bind(this));
        this.dispatcher.on('endDraft', this._onEndDraft.bind(this));
        // Принимаем приказ от HitTest (отмена жеста)
        this.dispatcher.on('draftCancelled', this._onCancelDraft.bind(this));
    }

    // Перевод миллиметров (от центра контейнера) в пиксели канваса
    // Ноль пикселей — левый верхний угол контейнера
    _toCanvasCoords(worldX, worldY) {
        const canvasWidth = this.mainCanvas.canvas.width / (window.devicePixelRatio || 1);
        const canvasHeight = this.mainCanvas.canvas.height / (window.devicePixelRatio || 1);

        const screenX = (worldX - this.containerMinX) / this.containerWidth * canvasWidth;
        const screenY = (worldY - this.containerMinY) / this.containerHeight * canvasHeight;

        return { x: screenX, y: screenY };
    }

    _onStartDraft(data) {
        if (!data || !data.point) return;
        const px = this._toCanvasCoords(data.point.x, data.point.y);
        const request = { x: px.x, y: px.y };
        this.dispatcher.emit('overlay:drawStartPoint', request);
    }

    _onMoveDraft(data) {
        if (!data) return;
        const p1 = this._toCanvasCoords(data.startX, data.startY);
        const p2 = this._toCanvasCoords(data.currentX, data.currentY);
        const request = { x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y };
        this.dispatcher.emit('overlay:drawDashedLine', request);
    }

    _onEndDraft(data) {
        if (!data) return;
        const p1 = this._toCanvasCoords(data.startX, data.startY);
        const p2 = this._toCanvasCoords(data.endX, data.endY);

        // 1. Финальная линия на Overlay
        const drawRequest = { x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y };
        this.dispatcher.emit('overlay:draftEndLine', drawRequest);

        // 2. Очистка Overlay
        this.dispatcher.emit('overlay:clear', {});

        // 3. Фиксация на MainCanvas
        const wallRequest = { x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y };
        this.dispatcher.emit('mainCanvas:drawWall', wallRequest);
    }

    _onCancelDraft(data) {
        // Отправляем финальную команду на очистку Overlay
        this.dispatcher.emit('overlay:clear', {});
    }
}

export default LayerManager;