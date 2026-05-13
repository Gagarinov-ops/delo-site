# Модуль «План помещения»

## Структура
- **core/** — фундамент: state.js, actions.js, grid.js, draw-line.js
- toolbar.js — панель инструментов
- element-library.js — каталог готовых элементов
- render.js — отрисовка линий и элементов
- render-room.js — отрисовка комнат (заливка, стены, подписи)
- dfs-utils.js — алгоритмы поиска циклов
- detect-room.js — публичный API поиска контура
- room-builder.js — сборка объекта комнаты
- drag-shape.js — перетаскивание линий
- wall-geometry.js — расчёт геометрии при изменении стены
- wall-input.js — поле ввода длины стены
- input-dispatcher.js — диспетчер событий канваса