import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { login as apiLogin, setAuthToken } from '../api/api'

const estilos = {
  container: {
    maxWidth: '400px',
    margin: '3rem auto',
    padding: '2rem',
    border: '1px solid #ccc',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  titulo: { textAlign: 'center', marginBottom: '1.5rem', color: '#1a5e20' },
  grupo: { display: 'flex', flexDirection: 'column', marginBottom: '1rem' },
  label: { marginBottom: '0.3rem', fontWeight: '500' },
  input: { padding: '0.5rem', borderRadius: '4px', border: '1px solid #aaa', fontSize: '1rem' },
  botao: {
    width: '100%',
    padding: '0.7rem',
    background: '#1a5e20',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
    marginTop: '0.5rem',
  },
  erro: { color: '#c62828', marginBottom: '0.75rem', fontSize: '0.9rem' },
  link: { display: 'block', textAlign: 'center', marginTop: '1rem', color: '#1a5e20' },
}

export default function Login() {
  const [form, setForm] = useState({ email: '', senha: '' })
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    setCarregando(true)
    try {
      // 1. Autentica e recebe o token
      const { token } = await apiLogin(form)

      // 2. Configura o token no axios para as próximas requisições
      setAuthToken(token)

      // 3. Busca os dados do usuário autenticado
      const { getMe } = await import('../api/api')
      const usuario = await getMe()

      // 4. Salva no contexto
      login(token, usuario)

      navigate('/fazendas')
    } catch (err) {
      const mensagem = err.response?.data?.mensagem
      setErro(mensagem || 'E-mail ou senha inválidos')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div style={estilos.container}>
      <h2 style={estilos.titulo}>🌾 AgroTech — Entrar</h2>

      {erro && <p style={estilos.erro}>{erro}</p>}

      <form onSubmit={handleSubmit}>
        <div style={estilos.grupo}>
          <label style={estilos.label} htmlFor="email">E-mail</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={form.email}
            onChange={handleChange}
            style={estilos.input}
          />
        </div>

        <div style={estilos.grupo}>
          <label style={estilos.label} htmlFor="senha">Senha</label>
          <input
            id="senha"
            name="senha"
            type="password"
            autoComplete="current-password"
            required
            value={form.senha}
            onChange={handleChange}
            style={estilos.input}
          />
        </div>

        <button type="submit" style={estilos.botao} disabled={carregando}>
          {carregando ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <Link to="/registro" style={estilos.link}>
        Não tem conta? Cadastre-se
      </Link>
    </div>
  )
}
