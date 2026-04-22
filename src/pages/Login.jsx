import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

function Login() {
  const navigate = useNavigate()
  const { login, register } = useAuth()
  const [mode, setMode] = useState('login') // 'login' или 'register'
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const action = mode === 'login' ? login : register
    const result = await action(username.trim(), password)

    setLoading(false)

    if (result.ok) {
      navigate('/')
    } else {
      setError(result.error)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">
          {mode === 'login' ? 'Вход' : 'Регистрация'}
        </h1>
        <p className="login-subtitle">
          {mode === 'login'
            ? 'Войдите, чтобы продолжить свой словарь'
            : 'Создайте аккаунт для своего словаря'}
        </p>

        <form onSubmit={handleSubmit} className="login-form">
          <label className="login-field">
            <span className="login-label">Имя пользователя</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="login-input"
              placeholder="например, anna"
              required
              autoFocus
            />
          </label>

          <label className="login-field">
            <span className="login-label">Пароль</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
              placeholder="минимум 4 символа"
              required
            />
          </label>

          {error && <div className="login-error">{error}</div>}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Подождите...' : mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
          </button>
        </form>

        <div className="login-switch">
          {mode === 'login' ? (
            <>
              Нет аккаунта?{' '}
              <button
                type="button"
                className="login-switch-btn"
                onClick={() => { setMode('register'); setError('') }}
              >
                Зарегистрироваться
              </button>
            </>
          ) : (
            <>
              Уже есть аккаунт?{' '}
              <button
                type="button"
                className="login-switch-btn"
                onClick={() => { setMode('login'); setError('') }}
              >
                Войти
              </button>
            </>
          )}
        </div>

        <p className="login-hint">
          Это локальная авторизация — все данные хранятся на этом устройстве.
        </p>
      </div>
    </div>
  )
}

export default Login
