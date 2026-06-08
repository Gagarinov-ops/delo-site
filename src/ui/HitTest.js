class HitTest {
    constructor(dispatcher, canvasDataCopy) {
        this.dispatcher = dispatcher;
        this.canvasDataCopy = canvasDataCopy;
        this.currentZoomLevel = 4;
        this.layerManager = null;

        this.dispatcher.on('cameraChanged', (data) => {
            this.currentZoomLevel = data.currentZoomLevel;
        });
        this.dispatcher.on('toolResult', this._onToolResult.bind(this));
        this.dispatcher.on('commandApproved', this._onCommandApproved.bind(this));
        this.dispatcher.on('zoomChanged', (data) => {
            this.currentZoomLevel = data.zoomLevel;
        });
    }

    setLayerManager(lm) {
        this.layerManager = lm;
    }

    toScreen(worldX, worldY) {
        // canvas фиксированного размера, масштабирование через CSS
        return { x: worldX, y: worldY };
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

    lineIntersection(x1, y1, x2, y2, x3, y3, x4, y4) {
        const d = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
        if (Math.abs(d) < 1e-10) return null;
        const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / d;
        const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / d;
        if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
            return { x: x1 + t * (x2 - x1), y: y1 + t * (y2 - y1) };
        }
        return null;
    }

    detectAndSplit(newStartX, newStartY, newEndX, newEndY) {
        const intersections = [];
        for (const wallId in this.canvasDataCopy.walls) {
            const wall = this.canvasDataCopy.walls[wallId];
            const p1 = this.canvasDataCopy.getPoint(wall.pointStartId);
            const p2 = this.canvasDataCopy.getPoint(wall.pointEndId);
            if (!p1 || !p2) continue;
            const intersection = this.lineIntersection(
                newStartX, newStartY, newEndX, newEndY,
                p1.x, p1.y, p2.x, p2.y
            );
            if (intersection) {
                const snapPoint = this.snap(intersection.x, intersection.y);
                intersections.push({
                    intersectionPoint: { x: snapPoint.x, y: snapPoint.y },
                    existingWallId: wallId,
                    parentSplit: [
                        { startX: p1.x, startY: p1.y, endX: snapPoint.x, endY: snapPoint.y },
                        { startX: snapPoint.x, startY: snapPoint.y, endX: p2.x, endY: p2.y }
                    ],
                    newSplit: [
                        { startX: newStartX, startY: newStartY, endX: snapPoint.x, endY: snapPoint.y },
                        { startX: snapPoint.x, startY: snapPoint.y, endX: newEndX, endY: newEndY }
                    ]
                });
            }
        }
        return intersections.length > 0 ? intersections : null;
    }

    _onToolResult(data) {
        if (!data.toolResult) return;

        if (data.gesture === 'pointerdown') {
            if (this.layerManager) this.layerManager.startDrawing();
            return;
        }

        if (data.gesture === 'pointerup') {
            if (this.layerManager) this.layerManager.finishDrawing();
            return;
        }

        const snappedStart = this.snap(data.toolResult.startX, data.toolResult.startY);
        const snappedCurrent = this.snap(data.toolResult.currentX, data.toolResult.currentY);

        const screenStart = this.toScreen(snappedStart.x, snappedStart.y);
        const screenCurrent = this.toScreen(snappedCurrent.x, snappedCurrent.y);

        if (this.layerManager) {
            this.layerManager.drawPreview(screenStart.x, screenStart.y, screenCurrent.x, screenCurrent.y);
        }
    }

    _onCommandApproved(entry) {
        if (entry.type === 'wallCreated') {
            const wall = this.canvasDataCopy.getWall(this.canvasDataCopy._lastAdded.wallId);
            if (!wall) return;
            const p1 = this.canvasDataCopy.getPoint(wall.pointStartId);
            const p2 = this.canvasDataCopy.getPoint(wall.pointEndId);
            if (!p1 || !p2) return;
            const screenP1 = this.toScreen(p1.x, p1.y);
            const screenP2 = this.toScreen(p2.x, p2.y);
            if (this.layerManager) {
                this.layerManager.drawWall(screenP1.x, screenP1.y, screenP2.x, screenP2.y);
                this.layerManager.drawPoint(screenP1.x, screenP1.y);
                this.layerManager.drawPoint(screenP2.x, screenP2.y);
            }
        } else if (entry.type === 'wallSplit') {
            if (this.layerManager) this.layerManager.redrawAll();
        }
    }
}

export default HitTest;