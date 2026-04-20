import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Texts from './pages/Texts'
import Reader from './pages/Reader'
import Dictionary from './pages/Dictionary'
import { DictionaryProvider } from './hooks/useDictionary'
import './App.css'

function App() {
  return (
    <DictionaryProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/texts" element={<Texts />} />
            <Route path="/texts/:id" element={<Reader />} />
            <Route path="/dictionary" element={<Dictionary />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </DictionaryProvider>
  )
}

export default App
