import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  getFazenda,
  atualizarFazenda,
  listarLotes,
  criarLote,
  atualizarLote,
  removerLote,
} from '../api/api'

const LOTE_VAZIO = { nome: '', quantidade: '', tipo: '', pasto: '' }

const estilos = {
  voltar: { color: '#1a5e20', cursor: 'pointer', marginBottom: '1rem', display: 'inline-block', fontSize: '0.9rem' },
  secao: { marginBottom: '2rem' },
  tituloFazenda: { color: '#1a5e20', display: 'flex', alignItems: 'center', gap: '1rem' },
  botaoEditar: {
    background: 'transparent', border: '1px solid #1a5e20', color: '#1a5e20',
    padding: '0.3rem 0.7rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem',
  },
  infoLocal: { color: '#666', marginBottom: '0.5rem' },
  headerLotes: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' },
  botaoPrimario: {
    background: '#1a5e20', color: '#fff', border: 'none', padding: '0.5rem 1rem',
    borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem',
  },
  tabela: { width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' },
  th: { background: '#1a5e20', color: '#fff', padding: '0.6rem 0.75rem', textAlign: 'left' },
  td: { padding: '0.6rem 0.75rem', borderBottom: '1px solid #eee' },
  botaoAcao: {
    background: '#388e3c', color: '#fff', border: 'none', padding: '0.3rem 0.6rem',
    borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', marginRight: '0.4rem',
  },
  botaoPerigo: {
    background: '#c62828', color: '#fff', border: 'none', padding: '0.3rem 0.6rem',
    borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem',
  },
  modal: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
  },
  modalConteudo: {
    background: '#fff', padding: '2rem', borderRadius: '8px', width: '100%', maxWidth: '460px',
  },
  grupo: { display: 'flex', flexDirection: 'column', marginBottom: '0.9rem' },
  label: { marginBottom: '0.25rem', fontWeight: '500', fontSize: '0.9rem' },
  input: { padding: '0.45rem', borderRadius: '4px', border: '1px solid #aaa', fontSize: '0.95rem' },
  acoesBotoes: { display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' },
  erro: { color: '#c62828', marginBottom: '0.75rem', fontSize: '0.9rem' },
  vazio: { color: '#666', fontStyle: 'italic' },
}

export default function FazendaDetalhe() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [fazenda, setFazenda] = useState(null)
  const [lotes, setLotes] = useState([])
  const [carregando, setCarregando] = useState(true)

  // Modal de lote (cria/edita)
  const [modalLote, setModalLote] = useState(false)
  const [loteEditando, setLoteEditando] = useState(null)  // null = criação
  const [formLote, setFormLote] = useState(LOTE_VAZIO)
  const [salvandoLote, setSalvandoLote] = useState(false)
  const [erroLote, setErroLote] = useState('')

  // Edição inline da fazenda
  const [editandoFazenda, setEditandoFazenda] = useState(false)
  const [formFazenda, setFormFazenda] = useState({ nome: '', localizacao: '' })
  const [salvandoFazenda, setSalvandoFazenda] = useState(false)

  useEffect(() => {
    carregarTudo()
  }, [id])

  async function carregarTudo() {
    try {
      const [f, ls] = await Promise.all([getFazenda(id), listarLotes(id)])
      setFazenda(f)
      setFormFazenda({ nome: f.nome, localizacao: f.localizacao || '' })
      setLotes(ls)
    } catch {
      alert('Fazenda não encontrada.')
      navigate('/fazendas')
    } finally {
      setCarregando(false)
    }
  }

  // ──────────── Fazenda ────────────

  async function handleSalvarFazenda(e) {
    e.preventDefault()
    setSalvandoFazenda(true)
    try {
      const atualizada = await atualizarFazenda(id, formFazenda)
      setFazenda(atualizada)
      setEditandoFazenda(false)
    } catch {
      alert('Erro ao atualizar fazenda.')
    } finally {
      setSalvandoFazenda(false)
    }
  }

  // ──────────── Lotes ────────────

  function abrirModalNovo() {
    setLoteEditando(null)
    setFormLote(LOTE_VAZIO)
    setErroLote('')
    setModalLote(true)
  }

  function abrirModalEditar(lote) {
    setLoteEditando(lote)
    setFormLote({
      nome: lote.nome,
      quantidade: lote.quantidade ?? '',
      tipo: lote.tipo ?? '',
      pasto: lote.pasto ?? '',
    })
    setErroLote('')
    setModalLote(true)
  }

  async function handleSalvarLote(e) {
    e.preventDefault()
    setSalvandoLote(true)
    setErroLote('')
    try {
      const payload = {
        ...formLote,
        fazendaId: Number(id),
        quantidade: formLote.quantidade !== '' ? Number(formLote.quantidade) : null,
      }
      if (loteEditando) {
        const atualizado = await atualizarLote(loteEditando.id, payload)
        setLotes((prev) => prev.map((l) => (l.id === atualizado.id ? atualizado : l)))
      } else {
        const novo = await criarLote(Number(id), payload)
        setLotes((prev) => [...prev, novo])
      }
      setModalLote(false)
    } catch (err) {
      setErroLote(err.response?.data?.mensagem || 'Erro ao salvar lote.')
    } finally {
      setSalvandoLote(false)
    }
  }

  async function handleRemoverLote(lote) {
    if (!window.confirm(`Remover lote "${lote.nome}"?`)) return
    try {
      await removerLote(lote.id)
      setLotes((prev) => prev.filter((l) => l.id !== lote.id))
    } catch {
      alert('Erro ao remover lote.')
    }
  }

  if (carregando) return <p>Carregando...</p>

  return (
    <div>
      {/* Voltar */}
      <span style={estilos.voltar} onClick={() => navigate('/fazendas')}>
        ← Minhas Fazendas
      </span>

      {/* ── Cabeçalho da Fazenda ── */}
      <div style={estilos.secao}>
        {editandoFazenda ? (
          <form onSubmit={handleSalvarFazenda}>
            <div style={estilos.grupo}>
              <label style={estilos.label}>Nome da Fazenda *</label>
              <input
                type="text" required style={estilos.input}
                value={formFazenda.nome}
                onChange={(e) => setFormFazenda((p) => ({ ...p, nome: e.target.value }))}
              />
            </div>
            <div style={estilos.grupo}>
              <label style={estilos.label}>Localização</label>
              <input
                type="text" style={estilos.input}
                value={formFazenda.localizacao}
                onChange={(e) => setFormFazenda((p) => ({ ...p, localizacao: e.target.value }))}
              />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="submit" style={estilos.botaoPrimario} disabled={salvandoFazenda}>
                {salvandoFazenda ? 'Salvando...' : 'Salvar'}
              </button>
              <button type="button" style={estilos.botaoPerigo} onClick={() => setEditandoFazenda(false)}>
                Cancelar
              </button>
            </div>
          </form>
        ) : (
          <>
            <h2 style={estilos.tituloFazenda}>
              {fazenda.nome}
              <button style={estilos.botaoEditar} onClick={() => setEditandoFazenda(true)}>
                ✏ Editar
              </button>
            </h2>
            {fazenda.localizacao && (
              <p style={estilos.infoLocal}>📍 {fazenda.localizacao}</p>
            )}
          </>
        )}
      </div>

      {/* ── Lotes ── */}
      <div style={estilos.secao}>
        <div style={estilos.headerLotes}>
          <h3>Lotes ({lotes.length})</h3>
          <button style={estilos.botaoPrimario} onClick={abrirModalNovo}>
            + Novo Lote
          </button>
        </div>

        {lotes.length === 0 ? (
          <p style={estilos.vazio}>Nenhum lote cadastrado nesta fazenda.</p>
        ) : (
          <table style={estilos.tabela}>
            <thead>
              <tr>
                <th style={estilos.th}>Nome</th>
                <th style={estilos.th}>Tipo</th>
                <th style={estilos.th}>Qtd.</th>
                <th style={estilos.th}>Pasto</th>
                <th style={estilos.th}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {lotes.map((l) => (
                <tr key={l.id}>
                  <td style={estilos.td}>{l.nome}</td>
                  <td style={estilos.td}>{l.tipo || '—'}</td>
                  <td style={estilos.td}>{l.quantidade ?? '—'}</td>
                  <td style={estilos.td}>{l.pasto || '—'}</td>
                  <td style={estilos.td}>
                    <button style={estilos.botaoAcao} onClick={() => abrirModalEditar(l)}>
                      Editar
                    </button>
                    <button style={estilos.botaoPerigo} onClick={() => handleRemoverLote(l)}>
                      Remover
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Modal de Lote (criar / editar) ── */}
      {modalLote && (
        <div style={estilos.modal} onClick={() => setModalLote(false)}>
          <div style={estilos.modalConteudo} onClick={(e) => e.stopPropagation()}>
            <h3>{loteEditando ? 'Editar Lote' : 'Novo Lote'}</h3>
            {erroLote && <p style={estilos.erro}>{erroLote}</p>}
            <form onSubmit={handleSalvarLote}>
              <div style={estilos.grupo}>
                <label style={estilos.label}>Nome *</label>
                <input
                  type="text" required style={estilos.input}
                  value={formLote.nome}
                  onChange={(e) => setFormLote((p) => ({ ...p, nome: e.target.value }))}
                />
              </div>
              <div style={estilos.grupo}>
                <label style={estilos.label}>Tipo (ex: novilhas, engorda)</label>
                <input
                  type="text" style={estilos.input}
                  value={formLote.tipo}
                  onChange={(e) => setFormLote((p) => ({ ...p, tipo: e.target.value }))}
                />
              </div>
              <div style={estilos.grupo}>
                <label style={estilos.label}>Quantidade de animais</label>
                <input
                  type="number" min={0} style={estilos.input}
                  value={formLote.quantidade}
                  onChange={(e) => setFormLote((p) => ({ ...p, quantidade: e.target.value }))}
                />
              </div>
              <div style={estilos.grupo}>
                <label style={estilos.label}>Pasto / Piquete</label>
                <input
                  type="text" style={estilos.input}
                  value={formLote.pasto}
                  onChange={(e) => setFormLote((p) => ({ ...p, pasto: e.target.value }))}
                />
              </div>
              <div style={estilos.acoesBotoes}>
                <button
                  type="button"
                  style={{ ...estilos.botaoPerigo }}
                  onClick={() => setModalLote(false)}
                >
                  Cancelar
                </button>
                <button type="submit" style={estilos.botaoPrimario} disabled={salvandoLote}>
                  {salvandoLote ? 'Salvando...' : (loteEditando ? 'Salvar' : 'Criar')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
