import { NavLink, Outlet } from 'react-router-dom'

function Layout() {
  return (
    <div className="app">
      <header className="header">
        <nav className="nav">
          <NavLink to="/" className="logo">NorskApp</NavLink>
          <div className="nav-links">
            <NavLink to="/texts">Тексты</NavLink>
            <NavLink to="/dictionary">Словарь</NavLink>
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
