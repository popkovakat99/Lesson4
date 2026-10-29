# Landing

- **Figma:** секция `Landing` (`195:2453`), фрейм `208:3395` (1920×6894), страница Screens
- **Роут:** `/landing`
- **Из базы:** `Button` (primary / secondary / ghost — в шапке, hero, тарифах, биллинге, «Как это работает»)
- **Локальные блоки** (`parts/`), по порядку на странице: `LandingHeader` (+ `LangSwitch`), `Hero`, `Features`, `HowItWorks`, `BillingBlock`, `Pricing`, `Regions`, `Privacy`, `Faq`, `Cta`, `LandingFooter`; общий заголовок секции — `SectionIntro`
- **Кандидаты на вынос в базу:**
  - карточка тарифа (`Pricing`) — повторяет `PlanCard` с экрана ServerCreate;
  - FAQ-аккордеон (`Faq`) — второй FAQ после BillingTopup;
  - карточка региона — родственник `RegionChip` с ServerCreate.
- **Mock:** весь текст — статикой из макета. FAQ не раскрывается (раскрыт первый вопрос, как в макете), полоса шагов не анимирована, кнопка «Пауза» ничего не делает.
- **Раскладка:** контейнер 1200px по центру, все сетки (2×2, 3, 4 колонки, 2 колонки) — `auto-fit`, на узком экране складываются в колонку.

## Отличия от макета (важно для дизайнера)

Лендинг в Figma импортирован из HTML и **не собран на дизайн-системе**: цвета прибиты hex, шрифты и отступы вне шкалы, инстансов компонентов нет. В коде всё переведено на токены ДС:

| В Figma | В коде |
|---|---|
| `#2563EB`, `#020617`, `#64748B`, `#E2E8F0`, `#F8FAFC`, `#16A34A`… | семантика: `--surface-action-primary`, `--text-strong`, `--text-muted`, `--border-default`, `--surface-subtle`, `--bg-success`… |
| H2 36 / 40 px | `DS/Heading/3xl` (32) |
| крупные числа 40 / 44 / 56 px | `DS/Heading/4xl` (48) |
| заголовки карточек 18 Semi Bold | `DS/Heading/lg` (18 Medium) |
| текст 15 / 16 / 17 px | `DS/Body/base` (16) |
| текст 13 / 14 px | `DS/Body/sm` (14) |
| подписи 10–12 px | `DS/Body/xs` (12) |
| надзаголовки Medium 12 | `DS/Label/xs` |
| радиус 12 | `--radius-lg` (16) |
| отступ секций 96 | `--space-16 + --space-8` |
| фон CTA `#1E3A8A` (accent-900) | `--surface-action-primary-hover` (accent-700) — семантики под accent-900 нет |
| фото на первом экране | тёмный плейсхолдер (`--text-strong`) с иконкой |
| QR-сетка из 49 квадратов | иконка QR |
