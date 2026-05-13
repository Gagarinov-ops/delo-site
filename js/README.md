# Клиентский JavaScript: Архитектура и стыковка

## Файловая структура
js/
├── config/
│   └── features.js ← флаги включения фич [AP-006]
├── core/
│   ├── app.js ← точка входа
│   ├── router.js ← роутер
│   ├── store.js ← единое состояние
│   └── events.js ← шина событий
├── features/
│   ├── plan/ ← План помещения
│   │   ├── core/ ← Фундамент
│   │   ├── tools/ ← Инструменты
│   │   ├── room/ ← Логика комнат
│   │   └── geometry/ ← Геометрическое ядро
│   ├── estimator/ ← Смета
│   ├── contracts/ ← Договоры и акты
│   └── ads/, parsing/ ← Заглушки v2
├── shared/
│   ├── snap.js, unit-utils.js, alphabet.js, canvas-utils.js ← Утилиты
│   ├── modal.js, validator.js, toaster.js ← Общие компоненты
│   └── autoSaver.js ← Автосохранение
└── pages/
    ├── plan.js ← Запуск модуля Плана
    ├── home.js, admin.js, landing.js, ... ← Логика страниц

## Ключевые правила стыковки
- Ядро (core/) не зависит от фич (features/).
- Фичи общаются через события (events.js) и store.js.
- Все файлы ≤150 строк. Один файл — одна ответственность.