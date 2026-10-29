// Навигация поверх базовых компонентов: они рендерят обычные <a href>, а здесь клики превращаются
// в переходы роутера (без перезагрузки и потери состояния). Базу при этом не трогаем.
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

/** Перехватывает клики по внутренним ссылкам и якорям. */
export function LinkInterceptor() {
  const navigate = useNavigate()

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = (e.target as HTMLElement | null)?.closest('a')
      if (!a || a.target || a.hasAttribute('download')) return
      const href = a.getAttribute('href')
      if (!href) return

      // href="#" — заглушка у базовых компонентов: не прыгаем наверх
      if (href === '#') {
        e.preventDefault()
        return
      }
      // Якорь на текущей странице — плавная прокрутка
      if (href.startsWith('#')) {
        e.preventDefault()
        document.getElementById(href.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        history.replaceState(null, '', href)
        return
      }
      // Внутренний путь — переход роутера
      if (href.startsWith('/') && !href.startsWith('//')) {
        e.preventDefault()
        navigate(href)
      }
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [navigate])

  return null
}

/** При смене экрана — наверх; при переходе с якорем (/landing#pricing) — к секции. */
export function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      // ждём, пока экран отрисуется
      requestAnimationFrame(() => document.getElementById(hash.slice(1))?.scrollIntoView({ block: 'start' }))
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash])

  return null
}
