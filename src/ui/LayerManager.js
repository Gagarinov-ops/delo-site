class LayerManager {
    constructor(mainCanvas, overlay, dispatcher) {
        this.mainCanvas = mainCanvas;
        this.overlay = overlay;
        this.dispatcher = dispatcher;
        this.visibleArea = null; // { minX, maxX, minY, maxY } в миллиметрах
        this._planeReady = false;

        // Получение видимой области от контейнера
        this.dispatcher.on('containerPlaneUpdated', (data) => {
            if (data && data.visibleArea) {
                this.visibleArea = data.visibleArea;
                this._planeReady = true;
            }
        });

        // Подписки на события от HitTest
        this.dispatcher.on('startDraft', this._onStartDraft.bind(this));
        this.dispatcher.on('moveDraft', this._onMoveDraft.bind(this));
        this.dispatcher.on('endDraft', this._onEndDraft.bind(this));
        this.dispatcher.on('cancelDraft', this._onCancelDraft.bind(this));
    }

    // Перевод миллиметров (от центра контейнера) в пиксели канваса (от левого верхнего угла)
    _toCanvasCoords(worldX, worldY) {
        if (!this.visibleArea) return { x: worldX, y: worldY };

        const canvasWidth = this.mainCanvas.canvas.width / (window.devicePixelRatio || 1);
        const canvasHeight = this.mainCanvas.canvas.height / (window.devicePixelRatio || 1);
        const va = this.visibleArea;

        // Линейное отображение: прямоугольник visibleArea -> весь холст
        const screenX = (worldX - va.minX) / (va.maxX - va.minX) * canvasWidth;
        const screenY = (worldY - va.minY) / (va.maxY - va.minY) * canvasHeight;

        return { x: screenX, y: screenY };
    }

    _onStartDraft(data) {
        if (!this._planeReady) return;
        const { point } = data;
        const px = this._toCanvasCoords(point.x, point.y);
        this.overlay.clear();
        this.overlay.drawPoint(px.x, px.y);
    }

    _onMoveDraft(data) {
        if (!this._planeReady) return;
        const { startX, startY, currentX, currentY } = data;
        const p1 = this._toCanvasCoords(startX, startY);
        const p2 = this._toCanvasCoords(currentX, currentY);
        this.overlay.clear();
        this.overlay.drawPoint(p1.x, p1.y);
        this.overlay.drawDashedLine(p1.x, p1.y, p2.x, p2.y);
    }

    _onEndDraft(data) {
        if (!this._planeReady) return;
        const { startX, startY, endX, endY } = data;
        const p1 = this._toCanvasCoords(startX, startY);
        const p2 = this._toCanvasCoords(endX, endY);

        this.mainCanvas.drawLine(p1.x, p1.y, p2.x, p2.y);
        this.mainCanvas.drawPoint(p1.x, p1.y);
        this.mainCanvas.drawPoint(p2.x, p2.y);

        this.overlay.clear();
    }

    _onCancelDraft() {
        this.overlay.clear();
    }
}

export default LayerManager;