// Мок-вход/регистрация с лендинга: настоящей авторизации нет.
import { useNavigate } from 'react-router-dom'
import { useToast } from '../../../app/toast'
import { useApp } from '../../../data'

export function useAuthActions() {
  const navigate = useNavigate()
  const toast = useToast()
  const { data, actions } = useApp()

  return {
    /** «Войти» — в кабинет с текущими данными (по умолчанию — демо) */
    signIn: () => {
      if (data.scenario === 'empty' && data.servers.length === 0) actions.setScenario('demo')
      navigate('/dashboard')
    },
    /** «Создать аккаунт» — кабинет нового пользователя: без серверов, баланс 0 */
    signUp: () => {
      actions.setScenario('empty')
      toast({ variant: 'success', title: 'Аккаунт создан', description: 'Мок: пополните баланс и поднимите первый сервер' })
      navigate('/dashboard')
    },
  }
}
