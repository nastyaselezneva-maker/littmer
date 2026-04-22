import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Texts from './pages/Texts'
import Reader from './pages/Reader'
import Dictionary from './pages/Dictionary'
import Login from './pages/Login'
import { AuthProvider } from './hooks/useAuth'
import { DictionaryProvider } from './hooks/useDictionary'
import useAuth from './hooks/useAuth'
import './App.css'

// Защищённый роут — перенаправляет на /login, если не авторизован
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

// Публичный роут — если уже авторизован, отправляет на главную
function PublicRoute({ children }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <Navigate to="/" replace /> : children
}

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Home />} />
        <Route path="/texts" element={<Texts />} />
        <Route path="/texts/:id" element={<Reader />} />
        <Route path="/dictionary" element={<Dictionary />} />
      </Route>
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DictionaryProvider>
          <AppRoutes />
        </DictionaryProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
