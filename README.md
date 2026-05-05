# Дело.Сайт — Работающий прототип MVP

Мобильное веб-приложение для мастеров-ремонтников: расчёт смет, генерация договоров и планов помещений.

## Содержимое проекта
delo-site/
├── css/ ← Готовые стили Дизайнера
│ ├── global.css ← Сброс, переменные, тёмная тема
│ ├── components.css ← Кнопки, поля, модалки, тосты, дисклеймеры
│ └── pages/ ← Стили экранов (home, plan, hub, profile, tariffs, templates, archive, auth)
├── fonts/ ← InterVariable.woff2 (локально)
├── js/
│ ├── core/ ← Нерушимое ядро
│ │ ├── app.js ← Запуск приложения
│ │ ├── router.js ← Маршрутизация экранов
│ │ ├── store.js ← Единое состояние (localStorage)
│ │ ├── events.js ← Шина событий
│ │ └── tetris/ ← План помещения (killer-фича)
│ │ ├── tetris-canvas.js ← Сетка, zoom
│ │ ├── tetris-toolbar.js ← Панель инструментов
│ │ ├── tetris-dragdrop.js ← Перетаскивание
│ │ ├── tetris-room.js ← Логика помещения
│ │ ├── tetris-apartment.js ← Стыковка помещений
│ │ ├── tetris-validator.js ← Валидация
│ │ ├── roulette.js ← Рулетка
│ │ └── library/ ← Элементы (UI, store, shapes)
│ ├── features/ ← Надстройки
│ │ ├── estimator/ ← Смета (index, ui, logic, materials)
│ │ ├── contracts/ ← Договоры, акты, PDF (index, ui, pdfBuilder, actBuilder)
│ │ ├── ads/ ← Заглушка (v2)
│ │ └── parsing/ ← Заглушка (v2)
│ ├── shared/ ← Общие компоненты
│ │ ├── modal.js ← Модальные окна
│ │ ├── validator.js ← Валидация форм
│ │ └── toaster.js ← Тост-уведомления
│ └── config/
│ └── features.js ← Включение/выключение фич
├── pages/
│ ├── index.html ← Главный экран [DSN-001]
│ ├── plan.html ← План помещения [PLN-001]
│ ├── hub.html ← Хаб документов
│ ├── profile.html ← Профиль [PRF-001]
│ ├── tariffs.html ← Тарифы
│ ├── templates.html ← Шаблоны
│ ├── archive.html ← Архив
│ ├── auth.html ← Регистрация и Вход
│ ├── offer.html ← Договор-оферта [LEG-001]
│ └── privacy.html ← Политика конфиденциальности [LEG-003]
├── package.json
└── README.md ← Этот файл [DOC-001]

## Список файлов

**Ядро (core/):** app.js, router.js, store.js, events.js, tetris/ (8 модулей + 4 фигуры)

**Фичи (features/):** estimator/ (4 файла), contracts/ (4 файла), ads/ (заглушка), parsing/ (заглушка)

**Общие (shared/):** modal.js, validator.js, toaster.js

**Страницы (pages/):** index.html, plan.html, hub.html, profile.html, tariffs.html, templates.html, archive.html, auth.html, offer.html, privacy.html

## Инструкция по запуску

```bash
npm install
npm start

Откройте http://localhost:3000

Архитектурные правила
[AP-001] core/ не импортирует features/

[AP-002] Новые модули в отдельных папках features/

[AP-003] Фичи общаются через Events.emit / Events.on

[AP-004] Один файл — одна ответственность (≤150 строк)

[AP-005] Все данные в store.js, события в events.js

[AP-006] Фичи в config/features.js

[AP-007] Заглушки ads/ и parsing/ созданы

Юридические документы
LEG-001 — Договор-оферта (offer.html)

LEG-003 — Политика конфиденциальности (privacy.html)

LEG-T-001 — Договор подряда (шаблон)

LEG-T-003 — Акт выполненных работ (шаблон)

LEG-T-004 — Акт скрытых работ (шаблон)

LEG-T-005 — Дополнительное соглашение (шаблон)

Соответствие стандартам
✅ Семантическая вёрстка [A11Y-001]

✅ ARIA-атрибуты [A11Y-004], [A11Y-005], [A11Y-007]

✅ Schema.org [SEO-004]

✅ Mobile First, 375px [DSN-001]

✅ Тёмная тема [UI-001]



**package.json** — Конфигурация (исправлено)
```json
{
  "name": "delo-site-mvp",
  "version": "1.0.0",
  "description": "MVP мобильного веб-приложения «Дело.Сайт» для мастеров-ремонтников",
  "main": "index.html",
  "scripts": {
    "start": "npx serve . -p 3000",
    "dev": "npx serve . -p 3000 --no-clipboard"
  },
  "keywords": ["ремонт", "смета", "план помещения", "договор подряда"],
  "author": "Дело.Сайт",
  "license": "UNLICENSED",
  "devDependencies": {
    "serve": "^14.0.0"
  }
}