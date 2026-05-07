'use strict';
function getCellSize(unit) {
  switch (unit) {
    case 'm': return 20;  // 1 клетка = 1 метр, шаг 20px
    case 'cm': return 20; // 1 клетка = 10 см, шаг 20px
    case 'mm': return 20; // 1 клетка = 1 см (10 мм), шаг 20px
    default: return 20;
  }
}