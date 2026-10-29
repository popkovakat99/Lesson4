import { useEffect } from 'react'
import type { ReactNode } from 'react'
import styles from './ModalOverlay.module.css'

export interface ModalOverlayProps {
  children: ReactNode
  onClose: () => void
  /** Пока идёт действие — не закрываем по фону и Esc */
  locked?: boolean
}

/** Слой модального окна: затемнение, закрытие по Esc и клику по фону, блокировка прокрутки страницы. */
export function ModalOverlay({ children, onClose, locked }: ModalOverlayProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !locked) onClose()
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose, locked])

  return (
    <div className={styles.backdrop} onMouseDown={(e) => e.target === e.currentTarget && !locked && onClose()}>
      {children}
    </div>
  )
}

/** Класс для базового `Modal` на экранах: отступы и тень из макетов `Screen/Modal/*`. */
export const modalScreenClass = styles.modal
