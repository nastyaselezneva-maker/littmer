import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // При первой загрузке достаём сохранённую сессию
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    // Подписываемся на изменения авторизации (login, logout, refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })

    return () => subscription.unsubscribe()
  }, [])

  const currentUser = session?.user?.email || null
  const userId = session?.user?.id || null
  const isAuthenticated = !!session

  async function register(email, password) {
    if (!email.includes('@')) {
      return { ok: false, error: 'Введите корректный email' }
    }
    if (password.length < 6) {
      return { ok: false, error: 'Пароль должен быть не менее 6 символов' }
    }
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) {
      return { ok: false, error: translateAuthError(error.message) }
    }
    // Если email-подтверждение включено, session = null до клика по ссылке
    if (!data.session) {
      return { ok: true, needsEmailConfirmation: true }
    }
    return { ok: true }
  }

  async function login(email, password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      return { ok: false, error: translateAuthError(error.message) }
    }
    return { ok: true }
  }

  async function logout() {
    await supabase.auth.signOut()
  }

  async function resetPassword(email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    })
    if (error) return { ok: false, error: translateAuthError(error.message) }
    return { ok: true }
  }

  const value = {
    currentUser,
    userId,
    register,
    login,
    logout,
    resetPassword,
    isAuthenticated,
    loading,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

function translateAuthError(msg) {
  const m = msg.toLowerCase()
  if (m.includes('invalid login') || m.includes('invalid credentials')) return 'Неверный email или пароль'
  if (m.includes('already registered') || m.includes('already been')) return 'Пользователь с таким email уже существует'
  if (m.includes('email not confirmed')) return 'Email не подтверждён. Проверь почту.'
  if (m.includes('weak password')) return 'Слишком простой пароль'
  if (m.includes('rate limit')) return 'Слишком много попыток. Подожди немного.'
  return msg
}

export default function useAuth() {
  return useContext(AuthContext)
}
