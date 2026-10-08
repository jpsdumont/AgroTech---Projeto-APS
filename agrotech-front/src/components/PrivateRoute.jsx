import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * Protege rotas filhas: se não autenticado, redireciona para /login.
 * Uso no App.jsx:
 *   <Route element={<PrivateRoute />}>
 *     <Route path="/fazendas" element={<MinhasFazendas />} />
 *   </Route>
 */
export default function PrivateRoute() {
  const { autenticado } = useAuth()
  return autenticado ? <Outlet /> : <Navigate to="/login" replace />
}
