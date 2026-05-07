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
          <NavLink to="/" className="logo">
            <svg className="logo-icon" viewBox="0 0 40 30" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <rect x="3" y="6" width="34" height="20" rx="2" fill="#c5462e" stroke="#2a2418" strokeWidth="2" />
              <path d="M3 6 L20 18 L37 6" fill="#e0a84a" stroke="#2a2418" strokeWidth="2" strokeLinejoin="round" />
              <path d="M14 22 Q20 26 26 22" fill="none" stroke="#fff8e8" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span>Litt<em>Mer</em></span>
          </NavLink>
          <div className="nav-links">
            <NavLink to="/texts">Тексты</NavLink>
            <NavLink to="/vocabulary">Лексика</NavLink>
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
