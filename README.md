# CryptoVPS — дизайн-система в React

Компонентная база и каталог Storybook для CryptoVPS — сервиса VPS с оплатой в USDT. Код — зеркало дизайн-системы из Figma: имена токенов и компонентов совпадают 1:1 (`surface-default` в Figma → `--surface-default` в коде, `Button` → `<Button>`).

**Стек:** Vite · React 19 · TypeScript · CSS Modules · Storybook 10

## Быстрый старт

Нужен Node.js 18+.

```bash
npm install
npm run storybook   # каталог компонентов → http://localhost:6006
npm run dev         # тестовая страница Showcase → http://localhost:5173
npm run build       # проверка типов + production-сборка
```

## Что внутри

```
src/
  tokens/            дизайн-токены (CSS-переменные)
    primitives.css     слой 1 — Primitive: палитра, размеры шрифта, радиусы, отступы, тени, анимация
    semantics.css      слой 2 — Semantic: смысловые токены, каждый ссылается на примитив через var()
    typography.css     TextStyles: классы .ds-heading-*, .ds-body-*, .ds-label-* (без цвета)
  components/        UI-кит — 18 компонентов, по папке на компонент
    <Name>/<Name>.tsx            компонент
    <Name>/<Name>.module.css     стили (только на токенах)
    <Name>/<Name>.stories.tsx    stories для Storybook
    index.ts                     общий реэкспорт
  foundation/        страницы Foundation в Storybook (читают значения прямо из src/tokens/)
  sandboxes/         песочницы Storybook: компоненты в связке
  Showcase.tsx       тестовая страница: палитра, шкала текста, все компоненты
.storybook/          конфиг Storybook (токены и шрифт Inter подключены в preview)
```

## Прототип: экраны и мок-данные

`npm run dev` → `/` — индекс со всеми экранами (плитки из `src/screens/registry.ts`).

| Экран | Роут |
|-------|------|
| Dashboard | `/dashboard` |
| Создание сервера | `/servers/create` (`?plan=starter\|standard\|performance`) |
| Страница сервера | `/servers/:id` (`?action=reboot\|reinstall\|delete` открывает модалку) |
| Пополнение баланса | `/billing/topup` (`?ttl=10` — короткий таймер курса для теста) |
| Модалки | `/modals/delete`, `/modals/reinstall`, `/modals/reboot` |
| Лендинг | `/landing` |

- `src/screens/` — экраны, собранные из базы; общие блоки — `src/screens/shared/`.
- `src/data/` — **мок-слой** (без бэкенда): состояние + действия через `useApp()`, сохраняется в `localStorage`. Подробности и способы проверки краевых случаев — `src/data/data.md`.
- `src/app/` — уведомления (Toast), перехват внутренних ссылок для роутера, прокрутка.
- Деплой — Vercel, `vercel.json` (SPA-fallback: все пути → `index.html`).

## Токены

Два слоя, как в Figma Variables:

- **Primitive** — сырые значения (`--accent-500: #2563EB`, `--space-4: 16px`). В компонентах напрямую не используются.
- **Semantic** — смысловые имена со ссылкой на примитив (`--surface-action-primary: var(--accent-500)`). Компоненты и экраны используют **только этот слой**.

Правило: никаких прибитых hex/px там, где есть токен. Цвет в TextStyle не входит — задаётся отдельной семантикой (`--text-default`, `--text-muted`, …).

## Компоненты

| Группа | Компоненты |
|--------|------------|
| Действия | `Button`, `IconButton` |
| Ввод | `Input`, `Select`, `Dropdown` |
| Контейнеры | `Card`, `Modal` |
| Навигация | `Navbar`, `Tabs` (+ `Tab`), `Breadcrumb` (+ `BreadcrumbItem`), `Pagination` (+ `PageButton`) |
| Фидбэк | `Badge`, `Tooltip`, `Toast` |
| Данные | `Table` |
| Domain | `OptionCard`, `StepItem`, `LinkItem` |

Варианты и состояния — пропсами с именами из Figma (`type`, `state`, `variant`, `density`, `placement`). Интерактивные состояния (hover, focus, disabled) работают нативно; проп `state` позволяет зафиксировать состояние для сверки.

```tsx
import { Button, Input, Badge } from './components'

<Button type="primary">Создать сервер</Button>
<Input label="Имя сервера" state="error" />
<Badge variant="success">Работает</Badge>
```

## Storybook

- **Foundation** — Primitive и Semantic токены, типографика.
- **Components** — у каждого компонента autodocs-страница (таблица пропсов с контролами, Show code), stories на каждое состояние и `AllVariants` — вся матрица вариантов на одном холсте.
- **Sandboxes** — модальное окно, форма, навигация, данные и обратная связь.

Анимации появления и переходы отключаются при системной настройке `prefers-reduced-motion: reduce`.
