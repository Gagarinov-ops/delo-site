import CanvasData from '../data/CanvasData.js';

class Calculator {
    recalculate(command) {
        if (command.type === 'wallCreated') {
            return this.recalculateWall(command);
        }
        // Остальные команды — позже
    }

    recalculateWall(command) {
        const pointStartId = command.data.pointStartId;
        const pointEndId = command.data.pointEndId;

        const p1 = CanvasData.points[pointStartId];
        const p2 = CanvasData.points[pointEndId];

        if (!p1 || !p2) return;

        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const length = Math.round(Math.sqrt(dx * dx + dy * dy));

        const wallId = command.data.wallId;
        if (wallId && CanvasData.walls[wallId]) {
            CanvasData.walls[wallId].length = length;
        }
    }
}

export default Calculator;