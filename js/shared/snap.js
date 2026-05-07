'use strict';
function snap(x, y, step) {
  return {
    x: Math.round(x / step) * step,
    y: Math.round(y / step) * step
  };
}