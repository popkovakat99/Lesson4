// Экраны-модалки из реестра (/modals/*): тот же диалог для первого сервера пользователя.
// Закрытие — на страницу этого сервера; если серверов нет — пустое состояние.
import { Server as ServerIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components'
import { useApp } from '../../data'
import type { Server } from '../../data'
import { EmptyState, ModalOverlay } from '../shared'
import { DeleteDialog } from './DeleteDialog'
import { RebootDialog } from './RebootDialog'
import { ReinstallDialog } from './ReinstallDialog'

function useDemoServer(): [Server | undefined, () => void] {
  const { data } = useApp()
  const navigate = useNavigate()
  const server = data.servers[0]
  return [server, () => navigate(server ? `/servers/${server.id}` : '/dashboard')]
}

function NoServer() {
  const navigate = useNavigate()
  return (
    <ModalOverlay onClose={() => navigate('/dashboard')}>
      <div style={{ width: 420, maxWidth: '100%' }}>
        <EmptyState
          icon={<ServerIcon size={18} />}
          title="Нет серверов"
          action={<Button onClick={() => navigate('/servers/create')}>Создать сервер</Button>}
        >
          Окно работает с конкретным сервером — сначала создайте хотя бы один.
        </EmptyState>
      </div>
    </ModalOverlay>
  )
}

export function ModalDelete() {
  const [server, close] = useDemoServer()
  const navigate = useNavigate()
  if (!server) return <NoServer />
  return <DeleteDialog server={server} onClose={close} onDeleted={() => navigate('/dashboard')} />
}

export function ModalReinstall() {
  const [server, close] = useDemoServer()
  if (!server) return <NoServer />
  return <ReinstallDialog server={server} onClose={close} />
}

export function ModalReboot() {
  const [server, close] = useDemoServer()
  if (!server) return <NoServer />
  return <RebootDialog server={server} onClose={close} />
}
