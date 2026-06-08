/**
 * Валидация дубликатов стен.
 * Используется HitTest'ом перед сохранением.
 */
class DuplicateValidator {
    constructor(canvasDataCopy) {
        this.canvasDataCopy = canvasDataCopy;
    }

    /**
     * Проверяет, существует ли уже стена с такими же конечными точками.
     */
    isDuplicateWall(startX, startY, endX, endY) {
        for (const wallId in this.canvasDataCopy.walls) {
            const wall = this.canvasDataCopy.walls[wallId];
            const p1 = this.canvasDataCopy.getPoint(wall.pointStartId);
            const p2 = this.canvasDataCopy.getPoint(wall.pointEndId);
            if (!p1 || !p2) continue;
            if ((Math.abs(p1.x - startX) < 0.001 && Math.abs(p1.y - startY) < 0.001 &&
                 Math.abs(p2.x - endX) < 0.001 && Math.abs(p2.y - endY) < 0.001) ||
                (Math.abs(p1.x - endX) < 0.001 && Math.abs(p1.y - endY) < 0.001 &&
                 Math.abs(p2.x - startX) < 0.001 && Math.abs(p2.y - startY) < 0.001)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Проверяет, лежат ли обе точки нового отрезка на одной существующей стене.
     */
    isCollinearWithExistingWall(startX, startY, endX, endY) {
        for (const wallId in this.canvasDataCopy.walls) {
            const wall = this.canvasDataCopy.walls[wallId];
            const p1 = this.canvasDataCopy.getPoint(wall.pointStartId);
            const p2 = this.canvasDataCopy.getPoint(wall.pointEndId);
            if (!p1 || !p2) continue;

            const onSegment = (px, py) => {
                const cross = (px - p1.x) * (p2.y - p1.y) - (py - p1.y) * (p2.x - p1.x);
                if (Math.abs(cross) > 0.001) return false;
                const dot = (px - p1.x) * (p2.x - p1.x) + (py - p1.y) * (p2.y - p1.y);
                if (dot < 0) return false;
                const len2 = (p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2;
                if (dot > len2) return false;
                return true;
            };

            if (onSegment(startX, startY) && onSegment(endX, endY)) {
                return true;
            }
        }
        return false;
    }
}

export default DuplicateValidator;