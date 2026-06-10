class HitTest {
    constructor(dispatcher, canvasDataCopy, duplicateValidator) {
        this.dispatcher = dispatcher;
        this.canvasDataCopy = canvasDataCopy;
        this.duplicateValidator = duplicateValidator;
        this.currentZoomLevel = 4;

        // Временный объект для накопления данных жеста
        this._pendingWall = null;

        this.dispatcher.on('toolResult', this._onToolResult.bind(this));
        this.dispatcher.on('cancelDraft', this._onCancelDraft.bind(this)); // Новая подписка
        this.dispatcher.on('zoomChanged', (data) => {
            this.currentZoomLevel = data.zoomLevel;
        });
    }

    // Отправляет запрос в CanvasDataCopy через диспетчер, возвращает ближайшую точку или null
    findNearestPoint(worldX, worldY, radius = 5) {
        const request = { x: worldX, y: worldY, radius, result: null };
        this.dispatcher.emit('hitTest:findNearestPoint', request);
        return request.result; // синхронно заполняется подписчиком (CanvasDataCopy)
    }

    snapToGrid(worldX, worldY) {
        const step = 5;
        return {
            x: Math.round(worldX / step) * step,
            y: Math.round(worldY / step) * step
        };
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

        const gesture = data.gesture;
        const toolData = data.toolResult;

        if (gesture === 'pointerdown') {
            // 1. Поиск существующей точки через событие
            const existing = this.findNearestPoint(toolData.startX, toolData.startY);
            let finalX, finalY;
            if (existing) {
                finalX = existing.x;
                finalY = existing.y;
            } else {
                // 2. Если нет — привязка к узлу сетки
                const snapped = this.snap(toolData.startX, toolData.startY);
                finalX = snapped.x;
                finalY = snapped.y;
            }
            this._pendingWall = {
                startX: finalX,
                startY: finalY,
                endX: null,
                endY: null
            };
            // Событие для LayerManager: начальная точка определена
            this.dispatcher.emit('startDraft', {
                point: { x: finalX, y: finalY }
            });
            return;
        }

        if (gesture === 'pointermove' && toolData.currentX !== undefined) {
            if (!this._pendingWall) return;
            const snappedCurrent = this.snap(toolData.currentX, toolData.currentY);
            // Событие для LayerManager: превью линии
            this.dispatcher.emit('moveDraft', {
                startX: this._pendingWall.startX,
                startY: this._pendingWall.startY,
                currentX: snappedCurrent.x,
                currentY: snappedCurrent.y
            });
            return;
        }

        if (gesture === 'pointerup' && toolData.endX !== undefined) {
            if (!this._pendingWall) return;

            // Поиск существующей точки для конечной координаты
            const existingEnd = this.findNearestPoint(toolData.endX, toolData.endY);
            let finalEndX, finalEndY;
            if (existingEnd) {
                finalEndX = existingEnd.x;
                finalEndY = existingEnd.y;
            } else {
                const snappedEnd = this.snap(toolData.endX, toolData.endY);
                finalEndX = snappedEnd.x;
                finalEndY = snappedEnd.y;
            }

            this._pendingWall.endX = finalEndX;
            this._pendingWall.endY = finalEndY;

            const startX = this._pendingWall.startX;
            const startY = this._pendingWall.startY;
            const endX = finalEndX;
            const endY = finalEndY;

            // Валидация дубликатов
            if (this.duplicateValidator) {
                if (this.duplicateValidator.isDuplicateWall(startX, startY, endX, endY) ||
                    this.duplicateValidator.isCollinearWithExistingWall(startX, startY, endX, endY)) {
                    // Сообщаем LayerManager отменить превью
                    this.dispatcher.emit('draftCancelled');
                    this._pendingWall = null;
                    return;
                }
            }

            // Проверка пересечений
            const intersections = this.detectAndSplit(startX, startY, endX, endY);
            if (intersections) {
                this.canvasDataCopy.applyWallSplit(intersections);
                this.dispatcher.emit('wallSplit', { intersections });
            } else {
                this.canvasDataCopy.saveFromToolResult({ startX, startY, endX, endY });
                this.dispatcher.emit('wallCreated', {
                    pointStart: { x: startX, y: startY },
                    pointEnd: { x: endX, y: endY }
                });
            }

            // Событие для LayerManager: фиксация стены
            this.dispatcher.emit('endDraft', {
                startX, startY,
                endX, endY
            });

            this._pendingWall = null;
            return;
        }

        // Если pointerup без endX (отмена жеста)
        if (gesture === 'pointerup') {
            this.dispatcher.emit('draftCancelled');
            this._pendingWall = null;
        }
    }

    // Новая команда отмены
    _onCancelDraft(data) {
        // 1. Сбрасываем временный объект (откат состояния)
        this._pendingWall = null;
        // 2. Дублируем приказ дальше — для LayerManager
        this.dispatcher.emit('draftCancelled');
    }
}

export default HitTest;