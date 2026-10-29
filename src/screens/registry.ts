import type { ComponentType } from 'react'
import { BillingTopup } from './billing-topup/BillingTopup'
import { Dashboard } from './dashboard/Dashboard'
import { Landing } from './landing/Landing'
import { ModalDelete, ModalReboot, ModalReinstall } from './modals/ModalScreens'
import { ServerCreate } from './server-create/ServerCreate'
import { ServerDetails } from './server-details/ServerDetails'

export interface ScreenEntry {
  id: string
  /** Название экрана для плитки */
  name: string
  /** Одна строка — что на экране */
  description: string
  /** Путь для плитки индекса (конкретный адрес) */
  route: string
  /** Шаблон пути для роутера, если отличается от route (например, /servers/:id) */
  path?: string
  component: ComponentType
  /** Группа плиток на индекс-странице */
  group: 'Кабинет' | 'Модальные окна' | 'Маркетинг'
  /** Фрейм в Figma — для сверки */
  figma: string
}

/** Реестр экранов — единый источник для роутинга и индекс-страницы. Новый экран = новая запись здесь. */
export const screens: ScreenEntry[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    description: 'Баланс, прогноз, быстрые действия, карточки серверов и последние операции',
    route: '/dashboard',
    component: Dashboard,
    group: 'Кабинет',
    figma: '86:199',
  },
  {
    id: 'server-create',
    name: 'Создание сервера',
    description: 'Выбор ОС, региона, тарифа, SSH-ключа и имени + итоговая панель «Ваш сервер»',
    route: '/servers/create',
    component: ServerCreate,
    group: 'Кабинет',
    figma: '89:209',
  },
  {
    id: 'server-details',
    name: 'Страница сервера',
    description: 'Вкладки, конфигурация, текущая нагрузка, графики метрик за 24 часа и события',
    route: '/servers/vpn-ams-01',
    path: '/servers/:id',
    component: ServerDetails,
    group: 'Кабинет',
    figma: '91:241',
  },
  {
    id: 'billing-topup',
    name: 'Пополнение баланса',
    description: 'Адрес и QR для оплаты, сумма и курс, шаги «Как это работает», FAQ',
    route: '/billing/topup',
    // /billing/topup/done — успешное зачисление (тот же экран, отдельный адрес для воронки юзер-тестов)
    path: '/billing/topup/*',
    component: BillingTopup,
    group: 'Кабинет',
    figma: '93:262',
  },
  {
    id: 'modal-delete',
    name: 'Удаление сервера',
    description: 'Подтверждение удаления: возврат средств, grace period, ввод имени сервера',
    route: '/modals/delete',
    component: ModalDelete,
    group: 'Модальные окна',
    figma: '95:270',
  },
  {
    id: 'modal-reinstall',
    name: 'Переустановка ОС',
    description: 'Выбор дистрибутива, предупреждение о потере данных, подтверждение именем',
    route: '/modals/reinstall',
    component: ModalReinstall,
    group: 'Модальные окна',
    figma: '95:284',
  },
  {
    id: 'modal-reboot',
    name: 'Перезагрузка',
    description: 'Выбор soft или hard reboot перед перезагрузкой сервера',
    route: '/modals/reboot',
    component: ModalReboot,
    group: 'Модальные окна',
    figma: '95:313',
  },
  {
    id: 'landing',
    name: 'Лендинг',
    description: 'Hero, преимущества, 4 шага, биллинг, тарифы, регионы, приватность, FAQ, призыв',
    route: '/landing',
    component: Landing,
    group: 'Маркетинг',
    figma: '208:3395',
  },
]
