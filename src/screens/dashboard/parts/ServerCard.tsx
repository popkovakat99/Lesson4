import type { ReactNode } from 'react'
import { ChevronRight, Clock, Copy, Cpu, HardDrive, MapPin, Server as ServerIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { copyText } from '../../../app/clipboard'
import { useToast } from '../../../app/toast'
import { Dropdown } from '../../../components'
import { cx } from '../../../components/cx'
import { days, daysSince, osById, planSpecs, regionById, shortDate } from '../../../data'
import type { Server } from '../../../data'
import { IconBadge, ServerStatusBadge } from '../../shared'
import styles from './parts.module.css'

function uptimeText(s: Server) {
  const created = `создан ${daysSince(s.createdAt) === 0 ? 'сегодня' : shortDate(s.createdAt)}`
  if (s.status === 'running') return `${days(Math.max(1, daysSince(s.createdAt)))} uptime · ${created}`
  if (s.status === 'stopped') return `остановлен · ${created}`
  return `— · ${created}`
}

/** Карточка сервера в списке (Figma: `ServerCard-*`). Данные — из мок-слоя. */
export function ServerCard({ server }: { server: Server }) {
  const navigate = useNavigate()
  const toast = useToast()
  const os = osById(server.os)
  const href = `/servers/${server.id}`

  const copyIp = async () => {
    const ok = await copyText(server.ip)
    toast(ok ? { variant: 'info', title: 'IP скопирован', description: server.ip } : { variant: 'warning', title: 'Не удалось скопировать', description: server.ip })
  }

  return (
    <div className={styles.serverCard}>
      <div className={styles.serverTop}>
        <IconBadge tone="action">
          <ServerIcon size={16} aria-hidden />
        </IconBadge>
        <a href={href} className={cx(styles.serverName, 'ds-heading-lg')} title={server.name}>
          {server.name}
        </a>
        <ServerStatusBadge status={server.status} />
        <Dropdown
          aria-label={`Действия с ${server.name}`}
          items={[
            { label: 'Открыть', onSelect: () => navigate(href) },
            { label: 'Перезагрузить', onSelect: () => navigate(`${href}?action=reboot`) },
            { label: 'Переустановить ОС', onSelect: () => navigate(`${href}?action=reinstall`) },
            { label: 'Удалить', destructive: true, onSelect: () => navigate(`${href}?action=delete`) },
          ]}
        />
      </div>
      <div className={styles.ipRow}>
        <span className={cx(styles.default, 'ds-body-sm-medium')}>{server.ip}</span>
        <button type="button" className={styles.iconBtn} aria-label="Скопировать IP" onClick={copyIp}>
          <Copy size={14} aria-hidden />
        </button>
      </div>
      <div className={styles.chips}>
        <SpecChip icon={<HardDrive size={12} />} label={`${os.name} ${os.version.replace(' LTS', '')}`} />
        <SpecChip icon={<MapPin size={12} />} label={regionById(server.region).city} />
        <SpecChip icon={<Cpu size={12} />} label={planSpecs(server.plan)} />
      </div>
      <div className={styles.serverFooter}>
        <span className={cx(styles.uptime, 'ds-body-xs')}>
          <Clock size={12} aria-hidden /> {uptimeText(server)}
        </span>
        <a href={href} className={cx(styles.link, 'ds-body-sm-medium')}>
          Детали <ChevronRight size={14} aria-hidden />
        </a>
      </div>
    </div>
  )
}

function SpecChip({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <span className={styles.chip}>
      <span className={styles.muted} aria-hidden>
        {icon}
      </span>
      <span className={cx(styles.default, 'ds-body-xs')}>{label}</span>
    </span>
  )
}
