import { Cpu, HardDrive, MemoryStick, Network } from 'lucide-react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../../components'
import { cx } from '../../../components/cx'
import styles from '../Landing.module.css'
import { SectionIntro } from './SectionIntro'

const SPEC_ICONS: Record<string, ReactNode> = {
  CPU: <Cpu size={14} />,
  RAM: <MemoryStick size={14} />,
  SSD: <HardDrive size={14} />,
  Трафик: <Network size={14} />,
}

/** Тексты карточек — из макета лендинга; plan — соответствующий тариф кабинета для «Выбрать» */
const PLANS = [
  { plan: 'starter', name: 'S · Lite', price: '5', perDay: '≈ $0.17 / день', specs: ['1 vCPU', '2 GB', '20 GB', '1 ТБ'] },
  { plan: 'standard', name: 'M · Standard', price: '10', perDay: '≈ $0.33 / день', specs: ['2 vCPU', '4 GB', '40 GB', '2 ТБ'], popular: true },
  { plan: 'performance', name: 'L · Pro', price: '20', perDay: '≈ $0.67 / день', specs: ['4 vCPU', '8 GB', '80 GB', '4 ТБ'] },
]

/** «Тарифы» — три карточки, средняя выделена. «Выбрать» → форма создания сервера с этим тарифом. */
export function Pricing() {
  const navigate = useNavigate()
  return (
    <section id="pricing" className={styles.section}>
      <div className={styles.container}>
        <SectionIntro
          center
          eyebrow="ТАРИФЫ"
          title="Цены в USDT. Списание помесячно из баланса."
          lead="Без скидок «на первый месяц», без скрытых сборов. Удалили сервер раньше — неиспользованные дни возвращаются на баланс."
        />
        <div className={styles.pricingGrid}>
          {PLANS.map((p) => (
            <article key={p.name} className={cx(styles.plan, p.popular && styles.planPopular)}>
              {p.popular && <span className={cx(styles.planBadge, 'ds-label-xs')}>Популярный</span>}
              <div className={styles.stepMeta}>
                <span className={cx(styles.muted, 'ds-body-sm')}>{p.name}</span>
                <span className={styles.planPrice}>
                  <span className={cx(styles.strong, 'ds-heading-4xl')}>{p.price}</span>
                  <span className={cx(styles.muted, 'ds-body-sm')}>USDT / месяц</span>
                </span>
                <span className={cx(styles.muted, 'ds-body-xs')}>{p.perDay}</span>
              </div>
              <div className={styles.planSpecs}>
                {Object.keys(SPEC_ICONS).map((label, i) => (
                  <span key={label} className={cx(styles.planSpec, 'ds-body-sm')}>
                    <span className={styles.muted} aria-hidden>
                      {SPEC_ICONS[label]}
                    </span>
                    <span className={styles.muted}>{label}</span>
                    <span className={cx(styles.default, 'ds-body-sm-medium')}>{p.specs[i]}</span>
                  </span>
                ))}
              </div>
              <Button type={p.popular ? 'primary' : 'secondary'} className={styles.fullWidth} onClick={() => navigate(`/servers/create?plan=${p.plan}`)}>
                Выбрать
              </Button>
            </article>
          ))}
        </div>
        <p className={cx(styles.p, styles.footnote, 'ds-body-xs')}>
          <span>Все цены — за календарный месяц. Минимальный платёж — 5 USDT.</span>
          <span>Цены ориентировочные на момент запуска MVP.</span>
        </p>
      </div>
    </section>
  )
}
