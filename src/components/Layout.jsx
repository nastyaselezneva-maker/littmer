import { NavLink, Outlet } from 'react-router-dom'
import useTwemoji from '../hooks/useTwemoji'
import useAuth from '../hooks/useAuth'

function Layout() {
  useTwemoji()
  const { currentUser, logout, isAuthenticated } = useAuth()

  return (
    <div className="app">
      <header className="header">
        <nav className="nav">
          <NavLink to="/" className="logo">NorskApp</NavLink>
          <div className="nav-links">
            <NavLink to="/texts">Тексты</NavLink>
            <NavLink to="/dictionary">Словарь</NavLink>
            {isAuthenticated ? (
              <div className="nav-user-inline">
                <span className="nav-username">{currentUser}</span>
                <button className="nav-logout" onClick={logout} title="Выйти">
                  Выход
                </button>
              </div>
            ) : (
              <NavLink to="/login" className="nav-login-link">Войти</NavLink>
            )}
          </div>
        </nav>
      </header>

      <main className="main">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
