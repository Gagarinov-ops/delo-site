class HitTest {
    constructor(dispatcher, canvasDataCopy, viewport) {
        this.dispatcher = dispatcher;
        this.canvasDataCopy = canvasDataCopy;
        this.viewport = viewport;
        this.currentZoom = 1;
        this.currentZoomLevel = 4;

        this.onDrawPreview = null;
        this.onClearOverlay = null;
        this.onDrawLine = null;
        this.onDrawPoint = null;

        this.dispatcher.on('cameraChanged', this._onCameraChanged.bind(this));
        this.dispatcher.on('toolResult', this._onToolResult.bind(this));
        this.dispatcher.on('commandApproved', this._onCommandApproved.bind(this));
        this.dispatcher.on('zoomChanged', (data) => {
            this.currentZoomLevel = data.zoomLevel;
        });
    }

    _onCameraChanged(data) {
        this.currentZoom = data.zoom;
    }

    // Перевод миллиметров в координаты canvas (без pan)
    toScreen(worldX, worldY) {
        return {
            x: worldX * this.currentZoom,
            y: worldY * this.currentZoom
        };
    }

    snapToGrid(worldX, worldY) {
        if (this.currentZoomLevel >= 2) {
            const step = 5;
            return {
                x: Math.round(worldX / step) * step,
                y: Math.round(worldY / step) * step
            };
        } else if (this.currentZoomLevel === 1) {
            const step5 = 5;
            const step1 = 1;
            const to5 = {
                x: Math.round(worldX / step5) * step5,
                y: Math.round(worldY / step5) * step5
            };
            const dist5 = Math.hypot(to5.x - worldX, to5.y - worldY);
            if (dist5 <= 5 * 0.5) {
                return to5;
            } else {
                return {
                    x: Math.round(worldX / step1) * step1,
                    y: Math.round(worldY / step1) * step1
                };
            }
        } else {
            const step = 1;
            return {
                x: Math.round(worldX / step) * step,
                y: Math.round(worldY / step) * step
            };
        }
    }

    snap(worldX, worldY) {
        return this.snapToGrid(worldX, worldY);
    }

    _onToolResult(data) {
        if (!data.toolResult) return;

        if (data.gesture === 'pointerup') {
            if (this.onClearOverlay) this.onClearOverlay();
            return;
        }

        const snappedStart = this.snap(data.toolResult.startX, data.toolResult.startY);
        const snappedCurrent = this.snap(data.toolResult.currentX, data.toolResult.currentY);

        const screenStart = this.toScreen(snappedStart.x, snappedStart.y);
        const screenCurrent = this.toScreen(snappedCurrent.x, snappedCurrent.y);

        if (this.onDrawPreview) {
            this.onDrawPreview(screenStart.x, screenStart.y, screenCurrent.x, screenCurrent.y);
        }
    }

    _onCommandApproved(entry) {
        if (entry.type !== 'wallCreated') return;

        const wall = this.canvasDataCopy.getWall(this.canvasDataCopy._lastAdded.wallId);
        if (!wall) return;

        const p1 = this.canvasDataCopy.getPoint(wall.pointStartId);
        const p2 = this.canvasDataCopy.getPoint(wall.pointEndId);
        if (!p1 || !p2) return;

        const screenP1 = this.toScreen(p1.x, p1.y);
        const screenP2 = this.toScreen(p2.x, p2.y);

        if (this.onDrawLine) {
            this.onDrawLine(screenP1.x, screenP1.y, screenP2.x, screenP2.y);
        }
        if (this.onDrawPoint) {
            this.onDrawPoint(screenP1.x, screenP1.y);
            this.onDrawPoint(screenP2.x, screenP2.y);
        }
    }

    redrawAll() {
        const walls = Object.values(this.canvasDataCopy.walls);
        const points = Object.values(this.canvasDataCopy.points);

        walls.forEach(wall => {
            const p1 = this.canvasDataCopy.getPoint(wall.pointStartId);
            const p2 = this.canvasDataCopy.getPoint(wall.pointEndId);
            if (p1 && p2 && this.onDrawLine) {
                const screenP1 = this.toScreen(p1.x, p1.y);
                const screenP2 = this.toScreen(p2.x, p2.y);
                this.onDrawLine(screenP1.x, screenP1.y, screenP2.x, screenP2.y);
            }
        });

        points.forEach(point => {
            if (this.onDrawPoint) {
                const screenP = this.toScreen(point.x, point.y);
                this.onDrawPoint(screenP.x, screenP.y);
            }
        });
    }
}

export default HitTest;