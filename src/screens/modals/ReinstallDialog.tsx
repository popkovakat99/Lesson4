import { RefreshCw, TriangleAlert } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { useToast } from '../../app/toast'
import { Button, Input, Modal, OptionCard } from '../../components'
import { cx } from '../../components/cx'
import { OS_LIST, osById, useApp } from '../../data'
import type { OsId, Server } from '../../data'
import { IconBadge, ModalOverlay, modalScreenClass } from '../shared'
import styles from './modals.module.css'

export interface ReinstallDialogProps {
  server: Server
  onClose: () => void
}

/** Переустановка ОС (Figma: `Screen/Modal/Reinstall`). Выбор дистрибутива + подтверждение именем. */
export function ReinstallDialog({ server, onClose }: ReinstallDialogProps) {
  const { actions } = useApp()
  const toast = useToast()
  const [os, setOs] = useState<OsId>(server.os)
  const [value, setValue] = useState('')
  const [busy, setBusy] = useState(false)

  const matches = value.trim() === server.name
  const typo = value.length > 0 && !server.name.startsWith(value.trim())

  const submit = async (e?: FormEvent) => {
    e?.preventDefault()
    if (!matches || busy) return
    setBusy(true)
    await actions.reinstallServer(server.id, os)
    const info = osById(os)
    toast({ variant: 'info', title: 'Переустановка запущена', description: `${server.name} → ${info.name} ${info.version}, займёт около минуты` })
    onClose()
  }

  return (
    <ModalOverlay onClose={onClose} locked={busy}>
      <form onSubmit={submit}>
        <Modal
          className={modalScreenClass}
          style={{ width: 520 }}
          title={
            <span className={styles.title}>
              <IconBadge tone="action">
                <RefreshCw size={18} aria-hidden />
              </IconBadge>
              Переустановить ОС
            </span>
          }
          actions={
            <>
              <Button type="secondary" onClick={onClose} disabled={busy}>
                Отмена
              </Button>
              <Button type="primary" htmlType="submit" state={busy ? 'loading' : matches ? 'default' : 'disabled'}>
                Переустановить
              </Button>
            </>
          }
        >
          <div className={styles.body}>
            <span>Выберите дистрибутив и подтвердите. Все данные на сервере будут удалены, восстановление невозможно.</span>
            <div className={styles.osRow} role="radiogroup" aria-label="Дистрибутив">
              {OS_LIST.map((o) => (
                <OptionCard
                  key={o.id}
                  className={styles.option}
                  state={os === o.id ? 'selected' : 'default'}
                  title={o.name}
                  subtitle={o.version}
                  disabled={busy}
                  onClick={() => setOs(o.id)}
                />
              ))}
            </div>
            <div className={styles.warn}>
              <TriangleAlert size={18} aria-hidden />
              <span className="ds-body-sm-medium">Все данные будут удалены безвозвратно</span>
            </div>
            <div className={styles.field}>
              <span className={cx(styles.default, 'ds-body-xs')}>
                Введите <strong>{server.name}</strong> для подтверждения
              </span>
              <Input
                aria-label="Имя сервера для подтверждения"
                placeholder={server.name}
                value={value}
                autoComplete="off"
                state={typo ? 'error' : 'default'}
                disabled={busy}
                onChange={(e) => setValue(e.target.value)}
              />
              {typo && <span className={cx(styles.error, 'ds-body-xs')}>Имя не совпадает с {server.name}</span>}
            </div>
          </div>
        </Modal>
      </form>
    </ModalOverlay>
  )
}
