import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { useToast } from '../../app/toast'
import { Button, Input, Modal } from '../../components'
import { cx } from '../../components/cx'
import { refundFor, useApp, usdt } from '../../data'
import type { Server } from '../../data'
import { Banner, IconBadge, ModalOverlay, modalScreenClass } from '../shared'
import styles from './modals.module.css'

export interface DeleteDialogProps {
  server: Server
  onClose: () => void
  /** Сервер удалён — экран решает, куда уйти */
  onDeleted: () => void
}

/** Удаление сервера (Figma: `Screen/Modal/Delete`). Кнопка активна только при точном вводе имени. */
export function DeleteDialog({ server, onClose, onDeleted }: DeleteDialogProps) {
  const { actions } = useApp()
  const toast = useToast()
  const [value, setValue] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refund = refundFor(server)
  const matches = value.trim() === server.name
  const typo = value.length > 0 && !server.name.startsWith(value.trim())

  const submit = async (e?: FormEvent) => {
    e?.preventDefault()
    if (!matches || busy) return
    setBusy(true)
    setError(null)
    try {
      const back = await actions.deleteServer(server.id)
      toast({ variant: 'success', title: `Сервер ${server.name} удалён`, description: `${usdt(back)} вернулись на баланс` })
      onDeleted()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось удалить сервер')
      setBusy(false)
    }
  }

  return (
    <ModalOverlay onClose={onClose} locked={busy}>
      <form onSubmit={submit}>
        <Modal
          className={modalScreenClass}
          style={{ width: 480 }}
          title={
            <span className={styles.title}>
              <IconBadge surface="error" tone="error">
                <Trash2 size={18} aria-hidden />
              </IconBadge>
              Удалить сервер {server.name}?
            </span>
          }
          actions={
            <>
              <Button type="secondary" onClick={onClose} disabled={busy}>
                Отмена
              </Button>
              <Button type="primary" htmlType="submit" state={busy ? 'loading' : matches ? 'default' : 'disabled'}>
                Удалить навсегда
              </Button>
            </>
          }
        >
          <div className={styles.body}>
            <span>
              После удаления сервер и все его данные будут безвозвратно утеряны. Средства за неиспользованный период (~{usdt(refund)}) вернутся на
              баланс.
            </span>
            <div className={styles.info}>
              <InfoRow label="Возврат на баланс" value={usdt(refund)} />
              <InfoRow label="Grace period" value="30 секунд" />
              <InfoRow label="После удаления" value="восстановление невозможно" />
            </div>
            <div className={styles.field}>
              <span className={cx(styles.default, 'ds-body-xs')}>
                Введите <strong>{server.name}</strong> для подтверждения
              </span>
              <Input
                aria-label="Имя сервера для подтверждения"
                placeholder={server.name}
                value={value}
                autoFocus
                autoComplete="off"
                state={typo ? 'error' : 'default'}
                disabled={busy}
                onChange={(e) => setValue(e.target.value)}
              />
              {typo && <span className={cx(styles.error, 'ds-body-xs')}>Имя не совпадает с {server.name}</span>}
            </div>
            {error && <Banner tone="error" title="Удаление не прошло">{error}</Banner>}
          </div>
        </Modal>
      </form>
    </ModalOverlay>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.infoRow}>
      <span className={cx(styles.muted, 'ds-body-xs')}>{label}</span>
      <span className={cx(styles.default, 'ds-body-sm-medium')}>{value}</span>
    </div>
  )
}
