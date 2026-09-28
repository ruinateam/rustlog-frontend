# Rustlog Frontend

Веб-интерфейс для [rustlog](https://github.com/ruinateam/rustlog): просмотр логов Twitch-чата по каналам и пользователям.

## Возможности

- Explorer: выбор канала/пользователя и периода, поток сообщений и локальный поиск. `channel` и `username` хранятся в URL и синхронизируются с кнопками Back/Forward.
- Отрисовка emotes Twitch, 7TV, BTTV и FFZ; каталоги emotes загружаются один раз на поток, а не на каждую строку.
- Chat badges рядом с именами: глобальные и канальные.
- Настройки отображения (timestamp, имена, emotes, порядок сообщений) сохраняются в localStorage.
- Name history, статистика, случайное сообщение, страница opt-out и документация API.

## Стек

React 18, TypeScript, Vite, styled-components, MUI, react-query, react-window.

## Запуск для разработки

Нужны Node.js 18+ и yarn (`corepack enable`).

```bash
yarn install
yarn start
```

Dev-сервер обращается к backend по адресу из `.env.development`:

```text
VITE_API_BASE_URL=http://localhost:8026
```

## Сборка и проверки

```bash
yarn typecheck
yarn build
```

`yarn build` складывает результат в `dist/`. Этот каталог встраивается в Rust-бинарь rustlog, поэтому отдельный веб-сервер для production не нужен: статику отдаёт сам backend.
