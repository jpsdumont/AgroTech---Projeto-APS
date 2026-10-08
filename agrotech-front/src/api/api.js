import axios from 'axios'

/**
 * Instância base do axios.
 * Em dev, o Vite faz proxy de /api/* → http://localhost:8080/*
 * então não precisamos colocar o host aqui.
 */
const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

/**
 * Injeta o token JWT no header Authorization de cada requisição.
 * Chamado uma vez após o login para configurar o interceptor.
 */
export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete api.defaults.headers.common['Authorization']
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Auth
// ─────────────────────────────────────────────────────────────────────────────

export const registro = (dados) =>
  api.post('/auth/registro', dados).then((r) => r.data)

export const login = (dados) =>
  api.post('/auth/login', dados).then((r) => r.data)

export const getMe = () =>
  api.get('/auth/me').then((r) => r.data)

// ─────────────────────────────────────────────────────────────────────────────
// Fazendas
// ─────────────────────────────────────────────────────────────────────────────

export const listarFazendas = () =>
  api.get('/fazendas').then((r) => r.data)

export const criarFazenda = (dados) =>
  api.post('/fazendas', dados).then((r) => r.data)

export const getFazenda = (id) =>
  api.get(`/fazendas/${id}`).then((r) => r.data)

export const atualizarFazenda = (id, dados) =>
  api.put(`/fazendas/${id}`, dados).then((r) => r.data)

export const removerFazenda = (id) =>
  api.delete(`/fazendas/${id}`)

// ─────────────────────────────────────────────────────────────────────────────
// Lotes
// ─────────────────────────────────────────────────────────────────────────────

export const listarLotes = (fazendaId) =>
  api.get(`/fazendas/${fazendaId}/lotes`).then((r) => r.data)

export const criarLote = (fazendaId, dados) =>
  api.post(`/fazendas/${fazendaId}/lotes`, { ...dados, fazendaId }).then((r) => r.data)

export const getLote = (id) =>
  api.get(`/lotes/${id}`).then((r) => r.data)

export const atualizarLote = (id, dados) =>
  api.put(`/lotes/${id}`, dados).then((r) => r.data)

export const removerLote = (id) =>
  api.delete(`/lotes/${id}`)

export default api
