# Папка js/ — Архитектура и стыковка

## Файловая структура
js/
├── config/
│ └── features.js ← флаги включения фич [AP-006]
├── core/
│ ├── app.js ← точка входа
│ ├── router.js ← SPA-роутер
│ ├── store.js ← единое состояние + localStorage + guest-mode
│ ├── events.js ← шина событий
│ └── tetris/
│ ├── tetris-render.js ← отрисовка сетки и элементов на canvas
│ ├── tetris-zoom.js ← зум (pinch, double-tap) и панорамирование
│ ├── tetris-toolbar.js ← панель инструментов
│ ├── tetris-dragdrop.js ← перетаскивание элементов с валидацией
│ ├── tetris-room.js ← размеры, стены, контур
│ ├── tetris-apartment.js ← стыковка помещений
│ ├── tetris-validator.js ← сбор ошибок (R-03, R-09, R-10, R-12, R-13)
│ ├── roulette.js ← инструмент «Рулетка»
│ ├── marker.js ← маркер угла (градусы + комментарий)
│ └── library/
│ ├── library-store.js ← справочник элементов (10 типов)
│ ├── library-buttons.js ← отрисовка кнопок по категориям
│ ├── library-events.js ← обработчики выбора + клавиатура
│ └── shapes/ ← 8 фигур (circle, square, line, window, arc, hinge, chandelier, track)
├── features/
│ ├── estimator/ ← PRD-005: Смета
│ │ ├── index.js ← сборка модуля + автосохранение
│ │ ├── materials.js ← справочник материалов
│ │ ├── estimator-calculations.js← чистые функции расчёта
│ │ ├── estimator-state.js ← добавление/удаление/изменение позиций
│ │ ├── estimator-validation.js ← проверки (R-04, R-16)
│ │ ├── estimator-table.js ← отрисовка таблицы с нумерацией
│ │ └── estimator-summary.js ← итоговый блок с коэффициентом
│ ├── contracts/ ← PRD-007, PRD-009, PRD-011, PRD-012
│ │ ├── index.js ← сборка модуля
│ │ ├── contract-view.js ← отрисовка карточек документов
│ │ ├── contract-actions.js ← автозаполнение переменных договора
│ │ ├── contract-modals.js ← модальные окна (PRD-008, R-07)
│ │ ├── pdfBuilder.js ← генерация PDF (P-001..P-007)
│ │ └── actBuilder.js ← построитель таблиц актов
│ ├── ads/ ← заглушка
│ └── parsing/ ← заглушка
├── shared/
│ ├── modal.js ← управление модальными окнами (A-004)
│ ├── validator.js ← валидация форм (R-01)
│ ├── toaster.js ← тост-уведомления (R-06)
│ └── autoSaver.js ← автосохранение в localStorage
└── pages/
├── home.js ← фильтры + быстрый замер (PRD-004)
├── admin.js ← админ-панель
├── landing.js ← лайтбокс (ADD-003)
├── profile.js ← сохранение полей + уведомления
├── plan.js ← валидация размеров
├── auth.js ← переключение режимов
├── archive.js ← загрузка архива
├── tariffs.js ← выбор тарифа
└── templates.js ← открытие групп


## Проверка стыковки

| Модуль | Импортирует | Обращается к |
|--------|------------|-------------|
| app.js | store, router, events | — |
| store.js | events | — |
| router.js | events | — |
| tetris-render.js | — | canvas, ctx |
| tetris-zoom.js | events | canvas |
| library-events.js | events, shapes/* | — |
| estimator/index.js | EstimatorState, EstimatorValidation, EstimatorTable, EstimatorSummary, AutoSaver | — |
| estimator-state.js | events, materials, estimator-calculations | — |
| contracts/index.js | ContractView, ContractActions, ContractModals, PdfBuilder, ActBuilder | — |
| contract-actions.js | store, toaster | — |
| contract-modals.js | modal, store | — |
| pages/*.js | window.App | store, router |

**Все файлы ≤150 строк. Все импорты валидны. Старых названий нет.**