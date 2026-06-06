import CanvasData from '../data/CanvasData.js';

class Calculator {
    recalculate(command) {
        if (command.type === 'wallCreated' || command.type === 'wallRemoved' || command.type === 'pointMoved') {
            // Пересчитываем затронутую стену
            const wallId = command.data?.wallId;
            if (wallId) this.recalculateWall(command);

            // Пересчитываем затронутые комнаты
            const roomId = command.data?.roomId;
            if (roomId) this.recalculateRoom(roomId);
        }
        if (command.type === 'roomCreated' || command.type === 'roomHeightUpdated') {
            const roomId = command.data?.roomId;
            if (roomId) this.recalculateRoom(roomId);
        }
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

    recalculateRoom(roomId) {
        const room = CanvasData.rooms[roomId];
        if (!room) return;

        // Собираем точки комнаты
        const points = room.pointIds.map(id => CanvasData.points[id]).filter(Boolean);
        if (points.length < 3) return;

        // 1. Периметр (сумма длин всех стен)
        let perimeter = 0;
        for (const wallId of room.wallIds) {
            const wall = CanvasData.walls[wallId];
            if (wall && wall.length !== null) {
                perimeter += wall.length;
            }
        }
        room.perimeter = Math.round(perimeter);

        // 2. Площадь пола (формула Гаусса / шнуровка)
        let floorArea = 0;
        const n = points.length;
        for (let i = 0; i < n; i++) {
            const p1 = points[i];
            const p2 = points[(i + 1) % n]; // следующая точка, замыкаем на первую
            floorArea += p1.x * p2.y - p2.x * p1.y;
        }
        floorArea = Math.abs(floorArea) / 2;
        room.floorArea = Math.round(floorArea); // мм², целое

        // 3. Площадь стен (периметр × высота)
        const height = room.height || 2500; // стандартная высота 2500 мм
        room.wallArea = Math.round(perimeter * height); // мм²
    }

    recalculateAllRooms() {
        for (const roomId in CanvasData.rooms) {
            this.recalculateRoom(roomId);
        }
    }
}

export default Calculator;