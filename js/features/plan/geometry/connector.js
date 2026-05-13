'use strict';

/**
 * GeometryConnector — прослойка между полем ввода и солвером
 * Принимает данные, вызывает GeometrySolver и обновляет отрисовку.
 * Геометрия временно отключена (режим «Собрать»).
 * stitch() теперь делегирует поиск контура в DetectRoom.
 */

try {
  const GeometryConnector = {
    applyWallLength(roomId, wallIndex, newLength) {
      // Временно отключено. Будет использоваться в режиме «Собрать».
      return null;
    },

    stitch(lines) {
      // Используем готовый поиск замкнутого контура
      const contour = DetectRoom.detect();
      if (contour && contour.walls && contour.walls.length >= 3) {
        RoomBuilder.build(contour);
      } else {
        alert('Не удалось собрать замкнутый контур');
      }
    }
  };

  window.GeometryConnector = GeometryConnector;

} catch (error) {
  console.error('GeometryConnector init error:', error);
}