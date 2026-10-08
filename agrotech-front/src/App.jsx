import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import PrivateRoute from './components/PrivateRoute'
import Login from './pages/Login'
import Registro from './pages/Registro'
import MinhasFazendas from './pages/MinhasFazendas'
import FazendaDetalhe from './pages/FazendaDetalhe'

export default function App() {
  return (
    <>
      <Navbar />
      <main style={{ padding: '1.5rem' }}>
        <Routes>
          {/* Rotas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />

          {/* Rotas protegidas */}
          <Route element={<PrivateRoute />}>
            <Route path="/fazendas" element={<MinhasFazendas />} />
            <Route path="/fazendas/:id" element={<FazendaDetalhe />} />
          </Route>

          {/* Redireciona a raiz para /fazendas */}
          <Route path="/" element={<Navigate to="/fazendas" replace />} />
          <Route path="*" element={<Navigate to="/fazendas" replace />} />
        </Routes>
      </main>
    </>
  )
}
