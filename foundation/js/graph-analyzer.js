window.GraphAnalyzer = {
  MAX_GRAPH_STEPS: 10000,

  // Главный метод: поиск всех циклов, начинающихся с startPointId
  findAllCycles: function(startPointId, points, walls) {
    // 1. Построение графа смежности
    const adj = this._buildAdjacency(points, walls);

    const cycles = [];
    const cycleKeys = new Set(); // для дедупликации комнат по набору стен
    const usedRoutes = new Set(); // глобальный набор направленных маршрутов "pointId->wallId"
    const steps = { count: 0 }; // счётчик шагов

    // Текущий путь: массив объектов { pointId, wallId } (wallId для первого элемента null)
    const currentPath = [{ pointId: startPointId, wallId: null }];
    usedRoutes.clear(); // каждый запуск с чистого листа

    this._dfs(startPointId, adj, currentPath, usedRoutes, cycles, cycleKeys, steps);

    return cycles;
  },

  // Рекурсивный обход
  _dfs: function(currentPointId, adj, currentPath, usedRoutes, cycles, cycleKeys, steps) {
    steps.count++;
    if (steps.count > this.MAX_GRAPH_STEPS) {
      console.error('GraphAnalyzer: превышен лимит шагов. Остановка. Проверьте план на наличие ошибок.');
      return;
    }

    const routes = adj[currentPointId] || [];

    for (const route of routes) {
      const routeKey = `${currentPointId}|${route.wallId}`;
      if (usedRoutes.has(routeKey)) continue; // маршрут уже пройден в этом направлении

      // Добавляем маршрут в использованные
      usedRoutes.add(routeKey);

      const nextPointId = route.nextPointId;
      // Проверяем, не зациклились ли мы на уже посещённую точку (образование цикла)
      const existingIndex = currentPath.findIndex(step => step.pointId === nextPointId);

      if (existingIndex !== -1) {
        // Найден замкнутый цикл
        // Формируем точки: от existingIndex до конца текущего пути
        const cyclePoints = currentPath.slice(existingIndex).map(step => step.pointId);
        // Стены: от existingIndex+1 до конца + текущая стена route.wallId
        const cycleWalls = currentPath.slice(existingIndex + 1).map(step => step.wallId);
        cycleWalls.push(route.wallId);
        // Убираем null (первый элемент пути не имеет wallId)
        const filteredWalls = cycleWalls.filter(w => w !== null);

        if (filteredWalls.length >= 3) {
          const key = filteredWalls.slice().sort().join('|');
          if (!cycleKeys.has(key)) {
            cycleKeys.add(key);
            cycles.push({
              pointIds: cyclePoints,
              wallIds: filteredWalls
            });
          }
        }
      } else {
        // Продолжаем путь
        currentPath.push({ pointId: nextPointId, wallId: route.wallId });
        this._dfs(nextPointId, adj, currentPath, usedRoutes, cycles, cycleKeys, steps);
        // Backtracking
        currentPath.pop();
      }
    }
  },

  _buildAdjacency: function(points, walls) {
    const adj = {};
    // Инициализируем пустыми массивами для всех точек
    for (const pid in points) adj[pid] = [];
    for (const wid in walls) {
      const w = walls[wid];
      if (w.pointStartId && w.pointEndId) {
        adj[w.pointStartId].push({
          wallId: wid,
          nextPointId: w.pointEndId
        });
        adj[w.pointEndId].push({
          wallId: wid,
          nextPointId: w.pointStartId
        });
      }
    }
    return adj;
  }
};