import { useState } from 'react'
import type { ReactNode } from 'react'
import {
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Card,
  Dropdown,
  IconButton,
  Input,
  LinkItem,
  Modal,
  Navbar,
  OptionCard,
  PageButton,
  Pagination,
  Select,
  StepItem,
  Tab,
  Table,
  Tabs,
  Toast,
  Tooltip,
} from './components'
import type { ButtonState, ButtonType } from './components'
import styles from './Showcase.module.css'

/* ---------- данные для демо ---------- */

const SEMANTIC_GROUPS: Array<{ title: string; tokens: string[] }> = [
  {
    title: 'Поверхности',
    tokens: [
      'surface-default',
      'surface-subtle',
      'surface-muted',
      'surface-action-primary',
      'surface-action-primary-hover',
      'surface-action-secondary-hover',
      'surface-action-ghost-hover',
      'surface-success-subtle',
      'surface-warning-subtle',
      'surface-error-subtle',
    ],
  },
  {
    title: 'Текст',
    tokens: [
      'text-default',
      'text-strong',
      'text-muted',
      'text-disabled',
      'text-on-action',
      'text-action',
      'text-success',
      'text-warning',
      'text-error',
    ],
  },
  {
    title: 'Обводки',
    tokens: ['border-default', 'border-strong', 'border-action', 'border-focus-ring', 'border-error'],
  },
  { title: 'Состояния', tokens: ['bg-success', 'bg-warning', 'bg-error', 'bg-info'] },
]

const TEXT_STYLES: Array<{ name: string; className: string; sample: string }> = [
  { name: 'DS/Heading/4xl', className: 'ds-heading-4xl', sample: 'H1 — hero' },
  { name: 'DS/Heading/3xl', className: 'ds-heading-3xl', sample: 'H2 — заголовок страницы' },
  { name: 'DS/Heading/2xl', className: 'ds-heading-2xl', sample: 'H3 — раздел страницы' },
  { name: 'DS/Heading/xl', className: 'ds-heading-xl', sample: 'H4 — карточка' },
  { name: 'DS/Heading/lg', className: 'ds-heading-lg', sample: 'Подзаголовок секции' },
  { name: 'DS/Body/base', className: 'ds-body-base', sample: 'Крупный body для длинных описаний' },
  { name: 'DS/Body/sm', className: 'ds-body-sm', sample: 'Body — основной текст списков и абзацев' },
  { name: 'DS/Body/sm Medium', className: 'ds-body-sm-medium', sample: 'Body Medium — кнопки и акценты' },
  { name: 'DS/Body/xs', className: 'ds-body-xs', sample: 'Подпись или метка интерфейса' },
  { name: 'DS/Label/xs', className: 'ds-label-xs', sample: 'БАЛАНС · СОЗДАН · ОС' },
]

const BUTTON_TYPES: ButtonType[] = ['primary', 'secondary', 'ghost']
const BUTTON_STATES: ButtonState[] = ['default', 'hover', 'disabled', 'loading', 'focus']
const BUTTON_LABELS: Record<ButtonType, string> = {
  primary: 'Primary action',
  secondary: 'Secondary',
  ghost: 'Ghost',
}

const SSH_KEYS = [
  { value: 'laptop', label: 'anton-laptop (Ed25519)' },
  { value: 'work', label: 'work-pc (RSA 4096)' },
  { value: 'ci', label: 'ci-runner (Ed25519)' },
]

const DROPDOWN_ITEMS = [{ label: 'Перезагрузить' }, { label: 'Консоль' }, { label: 'Удалить', destructive: true }]

interface Payment {
  date: string
  amount: string
  kind: string
  status: string
  hash: string
}

const PAYMENTS: Payment[] = [
  { date: '12 апр', amount: '+50.00', kind: 'Пополнение TON', status: 'Зачислено', hash: '5FHn2x...kL3M' },
  { date: '01 апр', amount: '−10.00', kind: 'Списание (vpn-ams-01)', status: 'Готово', hash: '—' },
  { date: '23 мар', amount: '+100.00', kind: 'Пополнение TRC-20', status: 'Зачислено', hash: '8HKp3w...rT9Q' },
]

const PAYMENT_COLUMNS = [
  { key: 'date', header: 'ДАТА', width: 120, render: (r: Payment) => r.date },
  { key: 'amount', header: 'СУММА', width: 100, render: (r: Payment) => r.amount },
  { key: 'kind', header: 'ТИП', width: 200, render: (r: Payment) => r.kind },
  { key: 'status', header: 'СТАТУС', width: 130, render: (r: Payment) => r.status },
  { key: 'hash', header: 'ХЕШ', width: 120, render: (r: Payment) => r.hash },
]

/* ---------- раскладка страницы ---------- */

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className={styles.section}>
      <h2 className={`${styles.sectionTitle} ds-heading-2xl`}>{title}</h2>
      {children}
    </section>
  )
}

function Demo({ name, children }: { name: string; children: ReactNode }) {
  return (
    <div className={styles.demo}>
      <div className={`${styles.demoName} ds-label-xs`}>{name}</div>
      <div className={styles.demoBody}>{children}</div>
    </div>
  )
}

function Cell({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className={styles.cell}>
      {children}
      <span className={`${styles.cellLabel} ds-body-xs`}>{label}</span>
    </div>
  )
}

/* ---------- страница ---------- */

export function Showcase() {
  const [ssh, setSsh] = useState('laptop')
  const [tab, setTab] = useState('Обзор')
  const [page, setPage] = useState(2)
  const [os, setOs] = useState('ubuntu')

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className="ds-heading-3xl">CryptoVPS — дизайн-система в React</h1>
        <p className={`${styles.lead} ds-body-base`}>
          Зеркало Figma-файла: токены из <code>ds/foundation.md</code>, 18 компонентов из{' '}
          <code>ds/components.md</code>. Имена 1:1 с Figma.
        </p>
      </header>

      <Section title="Палитра — Semantic">
        {SEMANTIC_GROUPS.map((group) => (
          <div key={group.title} className={styles.group}>
            <h3 className={`${styles.groupTitle} ds-heading-lg`}>{group.title}</h3>
            <div className={styles.swatches}>
              {group.tokens.map((token) => (
                <div key={token} className={styles.swatch}>
                  <div className={styles.swatchColor} style={{ background: `var(--${token})` }} />
                  <code className={`${styles.swatchName} ds-body-xs`}>{token}</code>
                </div>
              ))}
            </div>
          </div>
        ))}
      </Section>

      <Section title="Шкала текста — TextStyles">
        <div className={styles.typeScale}>
          {TEXT_STYLES.map((s) => (
            <div key={s.name} className={styles.typeRow}>
              <code className={`${styles.typeName} ds-body-xs`}>{s.name}</code>
              <span className={s.className}>{s.sample}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Компоненты">
        <h3 className={`${styles.groupTitle} ds-heading-lg`}>Действия</h3>

        <Demo name="Button · Type × State (3 × 5)">
          <div className={styles.matrix}>
            {BUTTON_TYPES.map((t) => (
              <div key={t} className={styles.row}>
                {BUTTON_STATES.map((s) => (
                  <Cell key={s} label={`${t} / ${s}`}>
                    <Button type={t} state={s}>
                      {BUTTON_LABELS[t]}
                    </Button>
                  </Cell>
                ))}
              </div>
            ))}
          </div>
        </Demo>

        <Demo name="IconButton · Type × State (2 × 3)">
          {(['primary', 'secondary'] as const).map((t) => (
            <div key={t} className={styles.row}>
              {(['default', 'hover', 'disabled'] as const).map((s) => (
                <Cell key={s} label={`${t} / ${s}`}>
                  <IconButton type={t} state={s} aria-label="Действие" />
                </Cell>
              ))}
            </div>
          ))}
        </Demo>

        <h3 className={`${styles.groupTitle} ds-heading-lg`}>Ввод</h3>

        <Demo name="Input · State (4)">
          <div className={styles.row}>
            <Cell label="default">
              <Input className={styles.w260} label="Email" defaultValue="anton@mail.ru" />
            </Cell>
            <Cell label="error">
              <Input className={styles.w260} label="Email — invalid" state="error" defaultValue="anton@" />
            </Cell>
            <Cell label="focus">
              <Input className={styles.w260} label="Email" state="focus" defaultValue="anton@mail.ru" />
            </Cell>
            <Cell label="disabled">
              <Input className={styles.w260} label="Email — недоступно" state="disabled" defaultValue="disabled@example.com" />
            </Cell>
          </div>
        </Demo>

        <Demo name="Select · State (5)">
          <div className={`${styles.row} ${styles.tallRow}`}>
            <Cell label="default (кликабельный)">
              <Select options={SSH_KEYS} value={ssh} onChange={setSsh} />
            </Cell>
            <Cell label="open">
              <Select options={SSH_KEYS} value={ssh} state="open" />
            </Cell>
            <Cell label="error">
              <Select options={SSH_KEYS} placeholder="Ошибка валидации" state="error" errorMessage="Выберите SSH-ключ" />
            </Cell>
            <Cell label="hover">
              <Select options={SSH_KEYS} value={ssh} state="hover" />
            </Cell>
            <Cell label="disabled">
              <Select options={SSH_KEYS} placeholder="недоступно" state="disabled" />
            </Cell>
          </div>
        </Demo>

        <Demo name="Dropdown · State (3)">
          <div className={`${styles.row} ${styles.tallRow}`}>
            <Cell label="closed (кликабельный)">
              <Dropdown items={DROPDOWN_ITEMS} />
            </Cell>
            <Cell label="open">
              <Dropdown items={DROPDOWN_ITEMS} state="open" />
            </Cell>
            <Cell label="hover">
              <Dropdown items={DROPDOWN_ITEMS} state="hover" />
            </Cell>
          </div>
        </Demo>

        <h3 className={`${styles.groupTitle} ds-heading-lg`}>Контейнеры</h3>

        <Demo name="Card · Type × State (2 × 2)">
          <div className={styles.row}>
            {(['static', 'interactive'] as const).map((t) =>
              (['default', 'hover'] as const).map((s) => (
                <Cell key={t + s} label={`${t} / ${s}`}>
                  <Card className={styles.w280} type={t} state={s} title="vpn-ams-01">
                    185.23.45.67 · Ubuntu 22.04 · 2 CPU / 4 GB
                  </Card>
                </Cell>
              )),
            )}
          </div>
        </Demo>

        <Demo name="Modal">
          <Modal
            title="Перезагрузить сервер?"
            actions={
              <>
                <Button type="secondary">Отмена</Button>
                <Button type="primary">Перезагрузить</Button>
              </>
            }
          >
            Soft reboot — корректное завершение процессов.
          </Modal>
        </Demo>

        <h3 className={`${styles.groupTitle} ds-heading-lg`}>Навигация</h3>

        <Demo name="Navbar">
          <Navbar
            className={styles.w440}
            items={[{ label: 'Серверы', active: true }, { label: 'Биллинг' }, { label: 'Статус' }]}
          />
        </Demo>

        <Demo name="Tabs · State (3) + полоса вкладок">
          <div className={styles.row}>
            <Cell label="default">
              <Tab>Обзор</Tab>
            </Cell>
            <Cell label="active">
              <Tab state="active">Обзор</Tab>
            </Cell>
            <Cell label="hover">
              <Tab state="hover">Обзор</Tab>
            </Cell>
          </div>
          <Tabs items={['Обзор', 'Сеть', 'Управление']} value={tab} onChange={setTab} />
        </Demo>

        <Demo name="Breadcrumb · State (2) + путь">
          <div className={styles.row}>
            <Cell label="default">
              <BreadcrumbItem>Серверы</BreadcrumbItem>
            </Cell>
            <Cell label="current">
              <BreadcrumbItem state="current">Создать</BreadcrumbItem>
            </Cell>
          </div>
          <Breadcrumb items={[{ label: 'Серверы' }, { label: 'vpn-ams-01' }, { label: 'Управление' }]} />
        </Demo>

        <Demo name="Pagination · State (3) + строка">
          <div className={styles.row}>
            <Cell label="default">
              <PageButton>1</PageButton>
            </Cell>
            <Cell label="active">
              <PageButton state="active">2</PageButton>
            </Cell>
            <Cell label="hover">
              <PageButton state="hover">3</PageButton>
            </Cell>
          </div>
          <Pagination page={page} total={12} onChange={setPage} />
        </Demo>

        <h3 className={`${styles.groupTitle} ds-heading-lg`}>Фидбэк</h3>

        <Demo name="Badge · Variant (4)">
          <div className={styles.row}>
            <Badge variant="success">Работает</Badge>
            <Badge variant="warning">Внимание</Badge>
            <Badge variant="error">Ошибка</Badge>
            <Badge variant="neutral">Остановлен</Badge>
          </div>
        </Demo>

        <Demo name="Tooltip · Placement (2)">
          <div className={styles.row}>
            <Cell label="top">
              <Tooltip placement="top">Подсказка</Tooltip>
            </Cell>
            <Cell label="bottom">
              <Tooltip placement="bottom">Подсказка</Tooltip>
            </Cell>
          </div>
        </Demo>

        <Demo name="Toast · Variant (4)">
          <div className={styles.stack}>
            <Toast variant="success" title="Зачислено 50.00 USDT" description="Новый баланс: 192.50 USDT" />
            <Toast variant="warning" title="Баланс заканчивается" description="Серверы остановятся через 6 часов" />
            <Toast variant="error" title="Транзакция отклонена" description="Попробуйте снова или смените сеть" />
            <Toast variant="info" title="Курс зафиксирован на 30 минут" description="После истечения создайте новый запрос" />
          </div>
        </Demo>

        <h3 className={`${styles.groupTitle} ds-heading-lg`}>Данные</h3>

        <Demo name="Table · Density (2)">
          <div className={styles.stack}>
            <Cell label="compact">
              <Table density="compact" columns={PAYMENT_COLUMNS} rows={PAYMENTS} rowKey={(r) => r.date} />
            </Cell>
            <Cell label="default">
              <Table density="default" columns={PAYMENT_COLUMNS} rows={PAYMENTS} rowKey={(r) => r.date} />
            </Cell>
          </div>
        </Demo>

        <h3 className={`${styles.groupTitle} ds-heading-lg`}>Особенные</h3>

        <Demo name="OptionCard · State (2) — кликабельные">
          <div className={styles.row} role="radiogroup">
            <OptionCard
              state={os === 'ubuntu' ? 'selected' : 'default'}
              title="Ubuntu"
              subtitle="22.04 LTS"
              onClick={() => setOs('ubuntu')}
            />
            <OptionCard
              state={os === 'debian' ? 'selected' : 'default'}
              title="Debian"
              subtitle="12"
              onClick={() => setOs('debian')}
            />
          </div>
        </Demo>

        <Demo name="StepItem">
          <div className={`${styles.stack} ${styles.w440}`}>
            <StepItem number={1} title="Выберите сеть и сумму" description="TON быстрее и дешевле, TRC-20 — проверенный стандарт." />
            <StepItem number={2} title="Отсканируйте QR или скопируйте адрес" description="Отправьте точную сумму на полученный адрес." />
          </div>
        </Demo>

        <Demo name="LinkItem">
          <div className={styles.row}>
            <LinkItem>Почему только USDT?</LinkItem>
            <LinkItem>Как работает fund-first биллинг?</LinkItem>
          </div>
        </Demo>
      </Section>
    </div>
  )
}
