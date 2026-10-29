# ServerCreate

- **Figma:** `Screen/ServerCreate` (`89:209`), страница Screens
- **Роут:** `/servers/create`
- **Из базы:** `OptionCard` (выбор ОС), `Select` (SSH-ключ), `Input` (имя сервера), `Button` (primary, в сводке), `Breadcrumb` (через PageHeader)
- **Общие блоки экранов:** `AppHeader`, `PageHeader`
- **Локальные блоки** (`parts/`): `FormSection` (заголовок + подсказка секции), `RegionChip` (регион с флагом и пингом), `PlanCard` (тариф), `SummaryPanel` («Ваш сервер»)
- **Кандидаты на вынос в базу:** `PlanCard` — тот же блок есть на лендинге (секция «Тарифы»); `RegionChip` — близок к `OptionCard`, стоит обсудить вариант OptionCard с флагом
- **Mock:** выбор зафиксирован как в макете (Ubuntu, Амстердам, Standard). Логики выбора, валидации и отправки нет.
- **Раскладка:** форма FILL + сводка 416px; на узком экране сводка переносится вниз. OSRow и PlanRow → авто-сетки.
- **Отличие от макета:** в Figma у инстанса `Input` под «Имя сервера» не заменён текст — стоит «Email / anton@mail.ru». В коде: поле без лейбла со значением `ubuntu-ams-03` (как в сводке).
