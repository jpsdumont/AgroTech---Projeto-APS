import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { listarFazendas, criarFazenda, removerFazenda } from '../api/api'

const estilos = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  titulo: { color: '#1a5e20' },
  botaoPrimario: {
    background: '#1a5e20', color: '#fff', border: 'none', padding: '0.5rem 1rem',
    borderRadius: '4px', cursor: 'pointer', fontSize: '0.95rem',
  },
  botaoPerigo: {
    background: '#c62828', color: '#fff', border: 'none', padding: '0.35rem 0.75rem',
    borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem', marginLeft: '0.5rem',
  },
  botaoSecundario: {
    background: '#388e3c', color: '#fff', border: 'none', padding: '0.35rem 0.75rem',
    borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem',
  },
  lista: { listStyle: 'none', padding: 0 },
  itemFazenda: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '1rem', border: '1px solid #ddd', borderRadius: '6px', marginBottom: '0.75rem',
    background: '#f9f9f9',
  },
  infoFazenda: { flex: 1 },
  nomeFazenda: { fontSize: '1.1rem', fontWeight: '600', color: '#1a5e20' },
  localFazenda: { color: '#666', fontSize: '0.9rem' },
  totalLotes: { color: '#444', fontSize: '0.85rem' },
  acoes: { display: 'flex', gap: '0.5rem' },
  modal: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
  },
  modalConteudo: {
    background: '#fff', padding: '2rem', borderRadius: '8px', width: '100%', maxWidth: '420px',
  },
  grupo: { display: 'flex', flexDirection: 'column', marginBottom: '1rem' },
  label: { marginBottom: '0.3rem', fontWeight: '500' },
  input: { padding: '0.5rem', borderRadius: '4px', border: '1px solid #aaa', fontSize: '1rem' },
  acoesBotoes: { display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' },
  erro: { color: '#c62828', marginBottom: '0.75rem', fontSize: '0.9rem' },
  vazio: { color: '#666', fontStyle: 'italic' },
}

export default function MinhasFazendas() {
  const [fazendas, setFazendas] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [modalAberto, setModalAberto] = useState(false)
  const [form, setForm] = useState({ nome: '', localizacao: '' })
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    carregarFazendas()
  }, [])

  async function carregarFazendas() {
    try {
      const dados = await listarFazendas()
      setFazendas(dados)
    } catch {
      setErro('Erro ao carregar fazendas.')
    } finally {
      setCarregando(false)
    }
  }

  async function handleCriar(e) {
    e.preventDefault()
    setSalvando(true)
    setErro('')
    try {
      const nova = await criarFazenda(form)
      setFazendas((prev) => [...prev, nova])
      setModalAberto(false)
      setForm({ nome: '', localizacao: '' })
    } catch (err) {
      setErro(err.response?.data?.mensagem || 'Erro ao criar fazenda.')
    } finally {
      setSalvando(false)
    }
  }

  async function handleRemover(id, nome) {
    if (!window.confirm(`Remover "${nome}"? Os lotes serão removidos junto.`)) return
    try {
      await removerFazenda(id)
      setFazendas((prev) => prev.filter((f) => f.id !== id))
    } catch {
      alert('Erro ao remover fazenda.')
    }
  }

  return (
    <div>
      <div style={estilos.header}>
        <h2 style={estilos.titulo}>Minhas Fazendas</h2>
        <button style={estilos.botaoPrimario} onClick={() => setModalAberto(true)}>
          + Nova Fazenda
        </button>
      </div>

      {carregando && <p>Carregando...</p>}
      {!carregando && fazendas.length === 0 && (
        <p style={estilos.vazio}>Nenhuma fazenda cadastrada ainda.</p>
      )}

      <ul style={estilos.lista}>
        {fazendas.map((f) => (
          <li key={f.id} style={estilos.itemFazenda}>
            <div style={estilos.infoFazenda}>
              <div style={estilos.nomeFazenda}>{f.nome}</div>
              {f.localizacao && <div style={estilos.localFazenda}>📍 {f.localizacao}</div>}
              <div style={estilos.totalLotes}>🐄 {f.totalLotes} lote{f.totalLotes !== 1 ? 's' : ''}</div>
            </div>
            <div style={estilos.acoes}>
              <button
                style={estilos.botaoSecundario}
                onClick={() => navigate(`/fazendas/${f.id}`)}
              >
                Ver detalhes
              </button>
              <button
                style={estilos.botaoPerigo}
                onClick={() => handleRemover(f.id, f.nome)}
              >
                Remover
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Modal de criação */}
      {modalAberto && (
        <div style={estilos.modal} onClick={() => setModalAberto(false)}>
          <div style={estilos.modalConteudo} onClick={(e) => e.stopPropagation()}>
            <h3>Nova Fazenda</h3>
            {erro && <p style={estilos.erro}>{erro}</p>}
            <form onSubmit={handleCriar}>
              <div style={estilos.grupo}>
                <label style={estilos.label} htmlFor="nome">Nome *</label>
                <input
                  id="nome" name="nome" type="text" required
                  value={form.nome}
                  onChange={(e) => setForm((p) => ({ ...p, nome: e.target.value }))}
                  style={estilos.input}
                />
              </div>
              <div style={estilos.grupo}>
                <label style={estilos.label} htmlFor="localizacao">Localização</label>
                <input
                  id="localizacao" name="localizacao" type="text"
                  value={form.localizacao}
                  onChange={(e) => setForm((p) => ({ ...p, localizacao: e.target.value }))}
                  style={estilos.input}
                />
              </div>
              <div style={estilos.acoesBotoes}>
                <button
                  type="button"
                  style={{ ...estilos.botaoPerigo, marginLeft: 0 }}
                  onClick={() => setModalAberto(false)}
                >
                  Cancelar
                </button>
                <button type="submit" style={estilos.botaoPrimario} disabled={salvando}>
                  {salvando ? 'Salvando...' : 'Criar Fazenda'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
