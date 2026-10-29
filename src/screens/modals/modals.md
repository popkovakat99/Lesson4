# Модалки: Delete · Reinstall · Reboot

Три экрана-модалки в одной папке — общие стили содержимого (`modals.module.css`).

| Экран | Figma | Роут | Файл |
|---|---|---|---|
| Удаление сервера | `Screen/Modal/Delete` (`95:270`) | `/modals/delete` | `ModalDelete.tsx` |
| Переустановка ОС | `Screen/Modal/Reinstall` (`95:284`) | `/modals/reinstall` | `ModalReinstall.tsx` |
| Перезагрузка | `Screen/Modal/Reboot` (`95:313`) | `/modals/reboot` | `ModalReboot.tsx` |

- **Из базы:** `Modal` (каркас окна: заголовок, тело, ряд действий), `Button` (secondary «Отмена» + primary), `Input` (подтверждение именем), `OptionCard` (выбор ОС в Reinstall)
- **Общие блоки экранов:** `ModalStage` (окно по центру затемнённой подложки), `IconBadge` (иконка в заголовке)
- **Локальные блоки:** `RebootOption` (вариант soft/hard reboot) в `ModalReboot.tsx`
- **Кандидаты на вынос в базу:** `RebootOption` — по сути «карточка-радио» с иконкой и описанием; рядом с `OptionCard` это второй вариант выбора «один из» → повод добавить в базу вариант OptionCard горизонтальный
- **Mock:** окна статичные: не закрываются, кнопки ничего не делают, выбор зафиксирован как в макете.
- **Отличия от макета:**
  - в Figma у инстансов `Input` в Delete и Reinstall не заменён текст — стоит «Ваш Email / anton@mail.ru». В коде: поле без лейбла с подсказкой `vpn-ams-01`;
  - gap 20 между блоками окна в Figma вне шкалы отступов — в коде `--space-4` (16);
  - кнопка «Удалить навсегда» в макете — обычная primary (синяя), не destructive. Оставлено как в макете; destructive-варианта у Button в базе нет.
