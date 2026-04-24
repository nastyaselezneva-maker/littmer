import { NavLink, Link, Outlet, useLocation } from 'react-router-dom'
import useTwemoji from '../hooks/useTwemoji'
import useAuth from '../hooks/useAuth'

function Layout() {
  useTwemoji()
  const { currentUser, logout, isAuthenticated } = useAuth()
  const location = useLocation()
  const isCardsMode = location.pathname === '/dictionary' && location.search.includes('mode=cards')
  const isDictList = location.pathname === '/dictionary' && !isCardsMode

  return (
    <div className="app">
      <header className="header">
        <nav className="nav">
          <NavLink to="/" className="logo">LittMer</NavLink>
          <div className="nav-links">
            <NavLink to="/texts">Тексты</NavLink>
            <Link to="/dictionary" className={isDictList ? 'active' : ''}>Словарь</Link>
            <Link to="/dictionary?mode=cards" className={isCardsMode ? 'active' : ''}>Учить</Link>
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
