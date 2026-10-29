// Уведомления поверх экранов: стек базовых Toast в правом нижнем углу, автоскрытие через 4.5 с.
import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { Toast } from '../components'
import type { ToastVariant } from '../components'
import styles from './toast.module.css'

interface ToastItem {
  id: number
  variant: ToastVariant
  title: string
  description?: string
}

type PushToast = (t: Omit<ToastItem, 'id'>) => void

const ToastContext = createContext<PushToast | null>(null)

let nextId = 1

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])

  const remove = useCallback((id: number) => setItems((all) => all.filter((t) => t.id !== id)), [])

  const push = useCallback<PushToast>(
    (t) => {
      const id = nextId++
      setItems((all) => [...all.slice(-3), { ...t, id }])
      setTimeout(() => remove(id), 4500)
    },
    [remove],
  )

  const value = useMemo(() => push, [push])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className={styles.stack} aria-live="polite">
        {items.map((t) => (
          <Toast key={t.id} variant={t.variant} title={t.title} description={t.description} onClose={() => remove(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast(): PushToast {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast вне ToastProvider')
  return ctx
}
