import { Power, RotateCw, TriangleAlert } from 'lucide-react'
import { useState } from 'react'
import type { ReactNode } from 'react'
import { useToast } from '../../app/toast'
import { Button, Modal } from '../../components'
import { cx } from '../../components/cx'
import { useApp } from '../../data'
import type { Server } from '../../data'
import { IconBadge, ModalOverlay, modalScreenClass } from '../shared'
import styles from './modals.module.css'

type Mode = 'soft' | 'hard'

/** Вариант перезагрузки (Figma: `Opt`) — карточка-радио. */
function RebootOption(props: { icon: ReactNode; title: string; text: string; selected: boolean; onSelect: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={props.selected}
      disabled={props.disabled}
      onClick={props.onSelect}
      className={cx(styles.opt, props.selected && styles.optSelected)}
    >
      <span className={cx(styles.optHead, 'ds-body-sm-medium')}>
        {props.icon}
        {props.title}
      </span>
      <span className={cx(styles.muted, 'ds-body-xs')}>{props.text}</span>
    </button>
  )
}

export interface RebootDialogProps {
  server: Server
  onClose: () => void
}

/** Перезагрузка сервера (Figma: `Screen/Modal/Reboot`). */
export function RebootDialog({ server, onClose }: RebootDialogProps) {
  const { actions } = useApp()
  const toast = useToast()
  const [mode, setMode] = useState<Mode>('soft')
  const [busy, setBusy] = useState(false)
  const unavailable = server.status !== 'running'

  const submit = async () => {
    setBusy(true)
    await actions.rebootServer(server.id, mode)
    toast({
      variant: 'info',
      title: `${mode === 'soft' ? 'Soft' : 'Hard'} reboot: ${server.name}`,
      description: 'Сервер будет недоступен около 30 секунд',
    })
    onClose()
  }

  return (
    <ModalOverlay onClose={onClose} locked={busy}>
      <Modal
        className={modalScreenClass}
        style={{ width: 419 }}
        title={
          <span className={styles.title}>
            <IconBadge tone="action">
              <Power size={18} aria-hidden />
            </IconBadge>
            Перезагрузить {server.name}
          </span>
        }
        actions={
          <>
            <Button type="secondary" onClick={onClose} disabled={busy}>
              Отмена
            </Button>
            <Button type="primary" state={busy ? 'loading' : unavailable ? 'disabled' : 'default'} onClick={submit}>
              Перезагрузить
            </Button>
          </>
        }
      >
        <div className={styles.body}>
          <span>
            {unavailable
              ? 'Сервер сейчас не работает — перезагрузить можно только запущенный сервер.'
              : 'Выберите тип перезагрузки. После reboot сервер будет недоступен ~30 секунд.'}
          </span>
          <div className={styles.options} role="radiogroup" aria-label="Тип перезагрузки">
            <RebootOption
              selected={mode === 'soft'}
              disabled={busy || unavailable}
              onSelect={() => setMode('soft')}
              icon={<RotateCw size={18} aria-hidden />}
              title="Soft reboot"
              text="Корректное завершение процессов · рекомендуется"
            />
            <RebootOption
              selected={mode === 'hard'}
              disabled={busy || unavailable}
              onSelect={() => setMode('hard')}
              icon={<TriangleAlert size={18} aria-hidden />}
              title="Hard reboot"
              text="Принудительная перезагрузка · только при зависании"
            />
          </div>
        </div>
      </Modal>
    </ModalOverlay>
  )
}
