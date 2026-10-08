import { createContext, useContext, useState, useCallback } from 'react'

/**
 * AuthContext — gerencia o estado de autenticação globalmente.
 *
 * O token JWT fica em memória (estado React), nunca em localStorage,
 * conforme requisito de segurança do projeto.
 */
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)  // { id, nome, email, criadoEm }
  const [token, setToken] = useState(null)       // string JWT

  /** Chamado após login bem-sucedido. */
  const login = useCallback((tokenJwt, dadosUsuario) => {
    setToken(tokenJwt)
    setUsuario(dadosUsuario)
  }, [])

  /** Limpa o estado de autenticação (logout). */
  const logout = useCallback(() => {
    setToken(null)
    setUsuario(null)
  }, [])

  const autenticado = !!token

  return (
    <AuthContext.Provider value={{ usuario, token, autenticado, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

/** Hook para consumir o contexto em qualquer componente. */
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>')
  return ctx
}
