class LayerManager {
    constructor(mainCanvas, overlay) {
        this.mainCanvas = mainCanvas;
        this.overlay = overlay;
        this.canvasDataCopy = null;
        this.hitTest = null;
        this.mainSnapshot = null;
    }

    init(canvasDataCopy, hitTest) {
        this.canvasDataCopy = canvasDataCopy;
        this.hitTest = hitTest;
    }

    startDrawing() {
        const w = this.mainCanvas.canvas.width;
        const h = this.mainCanvas.canvas.height;
        this.mainSnapshot = document.createElement('canvas');
        this.mainSnapshot.width = w;
        this.mainSnapshot.height = h;
        this.mainSnapshot.getContext('2d').drawImage(this.mainCanvas.canvas, 0, 0);
        this.mainCanvas.canvas.style.display = 'none';
    }

    finishDrawing() {
        this.mainCanvas.canvas.style.display = '';
        this.overlay.clear();
        this.mainSnapshot = null;
    }

    clearOverlay() {
        this.overlay.clear();
    }

    drawPreview(startX, startY, currentX, currentY) {
        this.overlay.clear();
        if (this.mainSnapshot) {
            this.overlay.ctx.drawImage(this.mainSnapshot, 0, 0);
        }
        this.overlay.drawDashedLine(startX, startY, currentX, currentY);
    }

    drawWall(x1, y1, x2, y2) {
        this.mainCanvas.drawLine(x1, y1, x2, y2);
    }

    drawPoint(x, y) {
        this.mainCanvas.drawPoint(x, y);
    }

    redrawAll() {
        if (!this.canvasDataCopy) return;
        const ctx = this.mainCanvas.ctx;
        const w = this.mainCanvas.canvas.width / (window.devicePixelRatio || 1);
        const h = this.mainCanvas.canvas.height / (window.devicePixelRatio || 1);
        ctx.clearRect(0, 0, w, h);

        for (const wallId in this.canvasDataCopy.walls) {
            const wall = this.canvasDataCopy.walls[wallId];
            const p1 = this.canvasDataCopy.getPoint(wall.pointStartId);
            const p2 = this.canvasDataCopy.getPoint(wall.pointEndId);
            if (p1 && p2) {
                this.drawWall(p1.x, p1.y, p2.x, p2.y);
            }
        }

        for (const pointId in this.canvasDataCopy.points) {
            const point = this.canvasDataCopy.points[pointId];
            this.drawPoint(point.x, point.y);
        }
    }
}

export default LayerManager;