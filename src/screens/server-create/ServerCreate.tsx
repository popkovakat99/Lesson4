import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useToast } from '../../app/toast'
import { Input, OptionCard, Select } from '../../components'
import { cx } from '../../components/cx'
import {
  OS_LIST,
  PLANS,
  REGIONS,
  SERVER_NAME_MAX,
  forecastDays,
  forecastWithExtra,
  osById,
  planById,
  regionById,
  useApp,
  validateServerName,
} from '../../data'
import type { OsId, PlanId, RegionId } from '../../data'
import { AppHeader, PageHeader } from '../shared'
import { FormSection } from './parts/FormSection'
import { PlanCard } from './parts/PlanCard'
import { RegionChip } from './parts/RegionChip'
import { SummaryPanel } from './parts/SummaryPanel'
import styles from './ServerCreate.module.css'

const isPlan = (v: string | null): v is PlanId => PLANS.some((p) => p.id === v)

/** Создание сервера (Figma: `Screen/ServerCreate`). Форма → валидация → создание → страница сервера. */
export function ServerCreate() {
  const { data, actions } = useApp()
  const navigate = useNavigate()
  const toast = useToast()
  const [params] = useSearchParams()

  const [os, setOs] = useState<OsId>('ubuntu')
  const [region, setRegion] = useState<RegionId>('ams')
  const [plan, setPlan] = useState<PlanId>(() => (isPlan(params.get('plan')) ? (params.get('plan') as PlanId) : 'standard'))
  const [sshKey, setSshKey] = useState<string | undefined>(data.sshKeys[0]?.id)
  const [customName, setCustomName] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [error, setError] = useState<string>()

  // Автоимя os-region-номер, пока пользователь не ввёл своё
  const autoName = useMemo(() => {
    const base = `${osById(os).slug}-${region}`
    for (let i = 1; i < 100; i++) {
      const candidate = `${base}-${String(i).padStart(2, '0')}`
      if (!data.servers.some((s) => s.name === candidate)) return candidate
    }
    return `${base}-${Date.now() % 1000}`
  }, [os, region, data.servers])
  const name = customName ?? autoName

  const planInfo = planById(plan)
  const shortfall = Math.max(0, Math.round((planInfo.price - data.balance) * 100) / 100)
  const nameError = validateServerName(name, data.servers)
  const sshError = sshKey ? null : 'Выберите SSH-ключ или добавьте новый'
  const showNameError = (submitted || customName !== null) && nameError
  const keyLabel = data.sshKeys.find((k) => k.id === sshKey)

  const submit = async () => {
    setSubmitted(true)
    if (nameError || sshError || shortfall > 0 || status === 'loading') return
    setStatus('loading')
    setError(undefined)
    try {
      const server = await actions.createServer({ name: name.trim(), os, region, plan, sshKey: sshKey as string })
      toast({ variant: 'success', title: `Сервер ${server.name} создаётся`, description: `Списано ${planInfo.price.toFixed(2)} USDT · деплой до 60 секунд` })
      navigate(`/servers/${server.id}`)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Неизвестная ошибка'
      setStatus('error')
      setError(msg)
      toast({ variant: 'error', title: 'Не удалось создать сервер', description: msg })
    }
  }

  const addKey = () => {
    const key = actions.addSshKey()
    setSshKey(key.id)
    toast({ variant: 'success', title: `Ключ ${key.name} добавлен`, description: 'В реальном продукте здесь будет загрузка публичного ключа' })
  }

  return (
    <div className={styles.page}>
      <AppHeader />
      <PageHeader
        breadcrumb={[{ label: 'Серверы', href: '/dashboard' }, 'Создать']}
        title={<h1 className={cx(styles.h1, 'ds-heading-3xl')}>Создание сервера</h1>}
      />

      <main className={styles.body}>
        <div className={styles.form}>
          <FormSection title="Операционная система" hint="Все дистрибутивы — Linux LTS, x86_64">
            <div className={styles.optionGrid} role="radiogroup" aria-label="Операционная система">
              {OS_LIST.map((o) => (
                <OptionCard
                  key={o.id}
                  className={styles.option}
                  state={os === o.id ? 'selected' : 'default'}
                  title={o.name}
                  subtitle={o.hint}
                  onClick={() => setOs(o.id)}
                />
              ))}
            </div>
          </FormSection>

          <FormSection title="Регион" hint="Чем ближе — меньше задержки">
            <div className={styles.wrapRow} role="radiogroup" aria-label="Регион">
              {REGIONS.map((r) => (
                <RegionChip key={r.id} flag={r.flag} city={r.city} ping={`ping ${r.ping} мс`} selected={region === r.id} onSelect={() => setRegion(r.id)} />
              ))}
            </div>
          </FormSection>

          <FormSection title="Тариф" hint="Можно поменять позже">
            <div className={styles.planGrid} role="radiogroup" aria-label="Тариф">
              {PLANS.map((p) => (
                <PlanCard
                  key={p.id}
                  name={p.name}
                  popular={p.popular}
                  selected={plan === p.id}
                  unaffordable={p.price > data.balance}
                  onSelect={() => setPlan(p.id)}
                  specs={[['CPU', `${p.cpu} vCPU`], ['RAM', `${p.ram} GB`], ['SSD', `${p.ssd} GB`], ['Трафик', `${p.traffic} TB`]]}
                  price={`$${p.price}`}
                  perDay={`≈ ${(p.price / 30).toFixed(2)} USDT/день`}
                />
              ))}
            </div>
          </FormSection>

          <FormSection title="SSH-ключ" hint="Используется для доступа к серверу по SSH">
            <div className={styles.sshRow}>
              <Select
                options={data.sshKeys.map((k) => ({ value: k.id, label: `${k.name} (${k.type})` }))}
                value={sshKey}
                onChange={setSshKey}
                placeholder="Нет ключей"
                state={submitted && sshError ? 'error' : 'default'}
                errorMessage={sshError ?? undefined}
              />
              <button type="button" className={cx(styles.action, 'ds-body-sm-medium')} onClick={addKey}>
                + Добавить новый ключ
              </button>
            </div>
          </FormSection>

          <FormSection title="Имя сервера" hint="Автогенерация: os-region-номер. Можно изменить">
            <div className={styles.field}>
              <Input
                aria-label="Имя сервера"
                value={name}
                maxLength={SERVER_NAME_MAX + 10}
                state={showNameError ? 'error' : 'default'}
                onChange={(e) => setCustomName(e.target.value)}
              />
              {showNameError ? (
                <span className={cx(styles.errorText, 'ds-body-xs')}>{nameError}</span>
              ) : (
                <span className={cx(styles.hint, 'ds-body-xs')}>
                  {name.length}/{SERVER_NAME_MAX} · латиница, цифры и дефис
                  {customName !== null && (
                    <>
                      {' · '}
                      <button type="button" className={styles.inlineLink} onClick={() => setCustomName(null)}>
                        вернуть автоимя
                      </button>
                    </>
                  )}
                </span>
              )}
            </div>
          </FormSection>
        </div>

        <div className={styles.summary}>
          <SummaryPanel
            items={[
              ['ОС', `${osById(os).name} ${osById(os).version.replace(' LTS', '')}`],
              ['Регион', regionById(region).city],
              ['Тариф', planInfo.name],
              ['SSH-ключ', keyLabel?.name ?? ''],
              ['Имя', name],
            ]}
            price={planInfo.price}
            forecastNow={forecastDays(data)}
            forecastAfter={forecastWithExtra(data, planInfo.price)}
            shortfall={shortfall}
            status={status}
            error={error}
            onSubmit={submit}
            onTopup={() => navigate('/billing/topup')}
          />
        </div>
      </main>
    </div>
  )
}
