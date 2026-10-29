// Навигация поверх базовых компонентов: они рендерят обычные <a href>, а здесь клики превращаются
// в переходы роутера (без перезагрузки и потери состояния). Базу при этом не трогаем.
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

/** Префикс публикации: '/' локально, '/Lesson4/' на GitHub Pages (из vite `base`) */
const BASE = import.meta.env.BASE_URL

/** basename для BrowserRouter: '/Lesson4' или '' */
export const ROUTER_BASENAME = BASE.replace(/\/$/, '')

/** Адрес внутреннего экрана с учётом префикса публикации — для обычных <a href> (открытие в новой вкладке тоже работает) */
export const appHref = (path: string) => ROUTER_BASENAME + path

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
      // Внутренний путь — переход роутера (префикс публикации снимаем: роутер добавит его сам)
      if (href.startsWith('/') && !href.startsWith('//')) {
        e.preventDefault()
        const path = ROUTER_BASENAME && href.startsWith(ROUTER_BASENAME + '/') ? href.slice(ROUTER_BASENAME.length) : href
        navigate(path)
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
