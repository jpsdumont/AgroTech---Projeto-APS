import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { registro as apiRegistro } from '../api/api'

const estilos = {
  container: {
    maxWidth: '420px',
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
  erroCampo: { color: '#c62828', fontSize: '0.8rem', marginTop: '0.25rem' },
  erroGeral: { color: '#c62828', marginBottom: '0.75rem', fontSize: '0.9rem' },
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
  link: { display: 'block', textAlign: 'center', marginTop: '1rem', color: '#1a5e20' },
}

export default function Registro() {
  const [form, setForm] = useState({ nome: '', email: '', senha: '' })
  const [erros, setErros] = useState({})   // erros por campo (400)
  const [erroGeral, setErroGeral] = useState('')
  const [carregando, setCarregando] = useState(false)
  const navigate = useNavigate()

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setErros((prev) => ({ ...prev, [e.target.name]: '' }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErros({})
    setErroGeral('')
    setCarregando(true)
    try {
      await apiRegistro(form)
      // Registro OK → redireciona para o login
      navigate('/login')
    } catch (err) {
      const status = err.response?.status
      const data = err.response?.data

      if (status === 400 && data?.erros) {
        // Erros de validação por campo
        setErros(data.erros)
      } else if (status === 409) {
        setErroGeral(data?.mensagem || 'E-mail já cadastrado')
      } else {
        setErroGeral('Erro ao criar conta. Tente novamente.')
      }
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div style={estilos.container}>
      <h2 style={estilos.titulo}>🌾 AgroTech — Criar conta</h2>

      {erroGeral && <p style={estilos.erroGeral}>{erroGeral}</p>}

      <form onSubmit={handleSubmit}>
        <div style={estilos.grupo}>
          <label style={estilos.label} htmlFor="nome">Nome</label>
          <input
            id="nome"
            name="nome"
            type="text"
            autoComplete="name"
            required
            value={form.nome}
            onChange={handleChange}
            style={estilos.input}
          />
          {erros.nome && <span style={estilos.erroCampo}>{erros.nome}</span>}
        </div>

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
          {erros.email && <span style={estilos.erroCampo}>{erros.email}</span>}
        </div>

        <div style={estilos.grupo}>
          <label style={estilos.label} htmlFor="senha">Senha</label>
          <input
            id="senha"
            name="senha"
            type="password"
            autoComplete="new-password"
            required
            minLength={6}
            value={form.senha}
            onChange={handleChange}
            style={estilos.input}
          />
          {erros.senha && <span style={estilos.erroCampo}>{erros.senha}</span>}
        </div>

        <button type="submit" style={estilos.botao} disabled={carregando}>
          {carregando ? 'Criando conta...' : 'Criar conta'}
        </button>
      </form>

      <Link to="/login" style={estilos.link}>
        Já tem conta? Entrar
      </Link>
    </div>
  )
}
