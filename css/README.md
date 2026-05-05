# Дело.Сайт — UI Kit и Design Spec MVP (Полная версия)

Дизайн-система и верстка для мобильного веб-приложения «Дело.Сайт». Mobile First (375px), тёмная тема, юридические тексты, лендинг и админка.

## Содержимое папки
*   `css/` — CSS-файлы проекта.
*   `README.md` — Этот файл.

## Перечень файлов

*   **css/global.css** — Сброс, переменные, шрифты, тёмная тема [UI-001].
*   **css/components.css** — Кнопки, поля, карточки, модалки, таб-бар, тосты, дисклеймеры [DISCLAIMER-001..003], панель фильтров, двухколоночная сетка, метрики.
*   **css/pages/home.css** — Главный экран: фильтры, «Быстрый замер» [DSN-001-UPD].
*   **css/pages/plan.css** — План помещения: дуга, шарнир, освещение, маркер угла [PLN-001-UPD], [DISCLAIMER-002].
*   **css/pages/hub.css** — Хаб документов, модальное окно PDF [DISCLAIMER-003].
*   **css/pages/profile.css** — Профиль, уведомления (push/email/SMS) [PRF-001-UPD].
*   **css/pages/tariffs.css** — Тарифы.
*   **css/pages/templates.css** — Библиотека шаблонов.
*   **css/pages/archive.css** — Архив.
*   **css/pages/auth.css** — Регистрация/Вход, чек-бокс оферты [DISCLAIMER-001].
*   **css/pages/estimate.css** — Смета: двухколоночная компоновка [EST-001-UPD].
*   **css/pages/landing.css** — Лендинг: оффер, лайтбокс, футер [PRD-001].
*   **css/pages/admin.css** — Админка CEO: метрики, пользователи, блокировка [ADM-001].

## Инструкция по сборке

1.  Копируйте папку в проект.
2.  Подключите в `<head>`:
    ```html
    <link rel="stylesheet" href="css/global.css">
    <link rel="stylesheet" href="css/components.css">
    <link rel="stylesheet" href="css/pages/landing.css">  <!-- для лендинга -->
    <link rel="stylesheet" href="css/pages/home.css">     <!-- для главной -->
    <!-- и остальные файлы страниц по необходимости -->