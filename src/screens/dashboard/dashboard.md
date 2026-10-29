# Dashboard

- **Figma:** `Screen/Dashboard` (`86:199`), страница Screens
- **Роут:** `/dashboard`
- **Из базы:** `Button` (primary/secondary + иконки), `Badge` (success/warning)
- **Общие блоки экранов** (`src/screens/shared`): `AppHeader`, `IconBadge`, `EventList` + `EventRow`
- **Локальные блоки** (`parts/`): `StatCard` (показатель с иконкой), `ServerCard` (карточка сервера) + `SpecChip`
- **Кандидаты на вынос в базу:** `ServerCard` (список серверов появится и на других экранах), `StatCard`
- **Mock:** весь контент — статикой из макета (баланс 142.50 USDT, 3 сервера, 4 операции). Логики, данных и обработчиков нет.
- **Раскладка:** StatsRow → авто-сетка (≥260px на карточку), ServersGrid (wrap) → авто-сетка (≥320px), QuickActions → flex-wrap.
- **Иконки:** Lucide по названиям слоёв макета (`icon-server`, `icon-wallet`, …).
