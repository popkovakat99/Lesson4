# Project

Запись среды для следующих директив (метрики, обновления).

- **Живая ссылка:** https://popkovakat99.github.io/Lesson4/
- **Путь деплоя:** сервис — GitHub Pages (сборка через GitHub Actions, `.github/workflows/pages.yml`)
- **Обновление:** пуш в `main` → сайт пересобирается сам (~1–2 мин)
- **Репозиторий:** https://github.com/popkovakat99/Lesson4 (публичный), ветка `main`
- **Что в репозитории:** React-база (токены, 18 компонентов, Storybook), 8 экранов из Figma, мок-слой данных `src/data/`
- **Не в репозитории:** `ds/`, `directives/`, `execution/`, `CLAUDE.md` (агентская среда), `node_modules/`, `dist/`, `.tmp/`, `.env*`
- **SPA-маршрутизация:** `dist/404.html` = копия `index.html` (собирается в CI), сборка с `BASE_PATH=/Lesson4/`
