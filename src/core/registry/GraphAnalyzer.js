import CanvasData from '../data/CanvasData.js';

class GraphAnalyzer {
    constructor() {
        this.MAX_GRAPH_STEPS = 10000;
    }

    findCycles(command) {
        if (command.type !== 'wallCreated' && command.type !== 'wallRemoved') {
            return [];
        }

        const startPointId = command.data?.pointEndId;
        if (!startPointId) return [];

        const graph = this._buildGraph();
        const path = { pointIds: [], wallIds: [] };
        const cycles = [];
        let steps = 0;

        this._dfs(startPointId, null, graph, path, cycles, steps);

        return cycles;
    }

    _buildGraph() {
        const graph = {};

        for (const pointId in CanvasData.points) {
            graph[pointId] = [];
        }

        for (const wallId in CanvasData.walls) {
            const wall = CanvasData.walls[wallId];
            const p1 = wall.pointStartId;
            const p2 = wall.pointEndId;

            if (graph[p1] && graph[p2]) {
                graph[p1].push({ pointId: p2, wallId });
                graph[p2].push({ pointId: p1, wallId });
            }
        }

        return graph;
    }

    _dfs(currentPointId, fromWallId, graph, path, cycles, steps) {
        steps++;
        if (steps > this.MAX_GRAPH_STEPS) return;

        // Добавляем точку и стену в путь
        path.pointIds.push(currentPointId);
        if (fromWallId) {
            path.wallIds.push(fromWallId);
        }

        const neighbors = graph[currentPointId] || [];
        for (const neighbor of neighbors) {
            // Не возвращаемся по той же стене
            if (neighbor.wallId === fromWallId) continue;

            const pointIndex = path.pointIds.indexOf(neighbor.pointId);
            if (pointIndex !== -1) {
                // Нашли цикл: от pointIndex до конца пути
                const cyclePointIds = path.pointIds.slice(pointIndex);
                const cycleWallIds = path.wallIds.slice(pointIndex);
                // Добавляем замыкающую стену
                cycleWallIds.push(neighbor.wallId);

                // Проверка на дубликат по ID стен
                const cycleKey = [...cycleWallIds].sort().join(',');
                const isDuplicate = cycles.some(c => [...c.wallIds].sort().join(',') === cycleKey);

                if (!isDuplicate) {
                    cycles.push({
                        pointIds: cyclePointIds,
                        wallIds: cycleWallIds
                    });
                }
                // Не идём в эту точку повторно
                continue;
            }

            // Идём дальше по неизведанному пути
            this._dfs(neighbor.pointId, neighbor.wallId, graph, path, cycles, steps);
        }

        // Откат: убираем текущую точку и стену из пути при возврате
        path.pointIds.pop();
        if (fromWallId) {
            path.wallIds.pop();
        }
    }
}

export default GraphAnalyzer;