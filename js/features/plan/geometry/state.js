'use strict';

/**
 * GeometryState — хранилище геометрических точек комнат
 * joints: ключ — contourId комнаты, значение — массив точек [{x,y}, ...]
 */

try {
  const GeometryState = {
    joints: {}
  };

  window.GeometryState = GeometryState;

} catch (error) {
  console.error('GeometryState init error:', error);
}