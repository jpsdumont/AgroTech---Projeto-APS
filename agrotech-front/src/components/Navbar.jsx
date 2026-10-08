import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { setAuthToken } from '../api/api'

const estilos = {
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.75rem 1.5rem',
    background: '#1a5e20',
    color: '#fff',
  },
  titulo: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    textDecoration: 'none',
    color: '#fff',
  },
  info: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    fontSize: '0.9rem',
  },
  botao: {
    background: '#c62828',
    color: '#fff',
    border: 'none',
    padding: '0.4rem 0.9rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.85rem',
  },
}

export default function Navbar() {
  const { autenticado, usuario, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    setAuthToken(null)
    navigate('/login')
  }

  return (
    <nav style={estilos.nav}>
      <Link to="/fazendas" style={estilos.titulo}>🌾 AgroTech</Link>

      {autenticado && (
        <div style={estilos.info}>
          <span>Olá, {usuario?.nome}</span>
          <button style={estilos.botao} onClick={handleLogout}>
            Sair
          </button>
        </div>
      )}
    </nav>
  )
}
