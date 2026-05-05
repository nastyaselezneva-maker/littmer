import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

function Login() {
  const navigate = useNavigate()
  const { login, register, resetPassword } = useAuth()
  const [mode, setMode] = useState('login') // 'login' | 'register' | 'reset'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setInfo('')
    setLoading(true)

    let result
    if (mode === 'login') {
      result = await login(email.trim(), password)
    } else if (mode === 'register') {
      result = await register(email.trim(), password)
    } else if (mode === 'reset') {
      result = await resetPassword(email.trim())
    }

    setLoading(false)

    if (!result.ok) {
      setError(result.error)
      return
    }

    if (mode === 'register' && result.needsEmailConfirmation) {
      setInfo('Мы отправили письмо на твой email. Перейди по ссылке, чтобы подтвердить аккаунт.')
      return
    }

    if (mode === 'reset') {
      setInfo('Если такой email зарегистрирован, на него придёт ссылка для сброса пароля.')
      return
    }

    navigate('/')
  }

  function switchMode(newMode) {
    setMode(newMode)
    setError('')
    setInfo('')
  }

  const titles = {
    login: 'Вход',
    register: 'Регистрация',
    reset: 'Сброс пароля',
  }

  const subtitles = {
    login: 'Войди, чтобы продолжить свой словарь',
    register: 'Создай аккаунт за пару кликов',
    reset: 'Введи email — пришлём ссылку для сброса',
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">{titles[mode]}</h1>
        <p className="login-subtitle">{subtitles[mode]}</p>

        {mode === 'register' && (
          <ul className="login-benefits">
            <li><strong>Словарь между устройствами</strong> — собранные слова доступны на телефоне, ноутбуке, планшете.</li>
            <li><strong>Прогресс не теряется</strong> — даже если очистишь кэш или сменишь браузер.</li>
            <li><strong>Карточки «Учить»</strong> — твои слова превращаются во флешкарты для повторения.</li>
            <li><strong>Восстановление пароля</strong> — забыл? пришлём ссылку на email.</li>
          </ul>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <label className="login-field">
            <span className="login-label">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="login-input"
              placeholder="anna@example.com"
              required
              autoFocus
            />
          </label>

          {mode !== 'reset' && (
            <label className="login-field">
              <span className="login-label">Пароль</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-input"
                placeholder="минимум 6 символов"
                required
                minLength={6}
              />
            </label>
          )}

          {error && <div className="login-error">{error}</div>}
          {info && <div className="login-info">{info}</div>}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading
              ? 'Подождите...'
              : mode === 'login' ? 'Войти'
              : mode === 'register' ? 'Зарегистрироваться'
              : 'Прислать ссылку'}
          </button>
        </form>

        <div className="login-switch">
          {mode === 'login' && (
            <>
              Нет аккаунта?{' '}
              <button type="button" className="login-switch-btn" onClick={() => switchMode('register')}>
                Зарегистрироваться
              </button>
              <br />
              Забыл пароль?{' '}
              <button type="button" className="login-switch-btn" onClick={() => switchMode('reset')}>
                Восстановить
              </button>
            </>
          )}
          {mode === 'register' && (
            <>
              Уже есть аккаунт?{' '}
              <button type="button" className="login-switch-btn" onClick={() => switchMode('login')}>
                Войти
              </button>
            </>
          )}
          {mode === 'reset' && (
            <button type="button" className="login-switch-btn" onClick={() => switchMode('login')}>
              ← Назад ко входу
            </button>
          )}
        </div>

        <p className="login-hint">
          Можно пользоваться приложением и без регистрации — данные будут храниться только в этом браузере.
        </p>
      </div>
    </div>
  )
}

export default Login
