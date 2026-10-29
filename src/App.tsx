import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { LinkInterceptor, ROUTER_BASENAME, ScrollManager } from './app/navigation'
import { ToastProvider } from './app/toast'
import { AppDataProvider } from './data'
import { Showcase } from './Showcase'
import { ScreensIndex } from './screens/ScreensIndex'
import { screens } from './screens/registry'

/**
 * Роутинг строится из реестра экранов: `/` — индекс, у каждого экрана свой путь, `/showcase` — витрина ДС.
 * AppDataProvider — единый мок-слой данных, ToastProvider — уведомления, LinkInterceptor — переходы по <a href>.
 */
export function App() {
  return (
    <BrowserRouter basename={ROUTER_BASENAME}>
      <AppDataProvider>
        <ToastProvider>
          <LinkInterceptor />
          <ScrollManager />
          <Routes>
            <Route path="/" element={<ScreensIndex />} />
            {screens.map((s) => (
              <Route key={s.id} path={s.path ?? s.route} element={<s.component />} />
            ))}
            <Route path="/showcase" element={<Showcase />} />
            <Route path="*" element={<ScreensIndex />} />
          </Routes>
        </ToastProvider>
      </AppDataProvider>
    </BrowserRouter>
  )
}
