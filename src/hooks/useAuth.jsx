import { createContext, useContext, useState, useEffect } from 'react'

const USERS_KEY = 'norsk-users'
const CURRENT_USER_KEY = 'norsk-current-user'

// Хеширование пароля через Web Crypto API (SHA-256).
// Не идеально безопасно, но лучше чем хранить открытый пароль.
async function hashPassword(password) {
  const encoder = new TextEncoder()
  const data = encoder.encode(password + 'norsk-salt-2026')
  const hash = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

function loadUsers() {
  const saved = localStorage.getItem(USERS_KEY)
  return saved ? JSON.parse(saved) : {}
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    return localStorage.getItem(CURRENT_USER_KEY)
  })

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(CURRENT_USER_KEY, currentUser)
    } else {
      localStorage.removeItem(CURRENT_USER_KEY)
    }
  }, [currentUser])

  async function register(username, password) {
    const users = loadUsers()
    if (users[username]) {
      return { ok: false, error: 'Пользователь с таким именем уже существует' }
    }
    if (username.length < 3) {
      return { ok: false, error: 'Имя должно быть не менее 3 символов' }
    }
    if (password.length < 4) {
      return { ok: false, error: 'Пароль должен быть не менее 4 символов' }
    }
    const passwordHash = await hashPassword(password)
    users[username] = { passwordHash, createdAt: new Date().toISOString() }
    saveUsers(users)
    setCurrentUser(username)
    return { ok: true }
  }

  async function login(username, password) {
    const users = loadUsers()
    const user = users[username]
    if (!user) {
      return { ok: false, error: 'Пользователь не найден' }
    }
    const passwordHash = await hashPassword(password)
    if (user.passwordHash !== passwordHash) {
      return { ok: false, error: 'Неверный пароль' }
    }
    setCurrentUser(username)
    return { ok: true }
  }

  function logout() {
    setCurrentUser(null)
  }

  const value = { currentUser, register, login, logout, isAuthenticated: !!currentUser }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default function useAuth() {
  return useContext(AuthContext)
}
