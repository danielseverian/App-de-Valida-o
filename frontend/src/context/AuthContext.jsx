import { createContext, useContext, useMemo, useState } from 'react'

const AuthContext = createContext(null)
const STORAGE_KEY = 'oficina:auth'

// Recupera do navegador os dados da sessão anterior, caso existam.
function readStoredAuth() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(readStoredAuth)

  // Salva o token e os dados do usuário no estado e no localStorage.
  const signIn = ({ token, usuario }) => {
    const nextAuth = { token, usuario }
    setAuth(nextAuth)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextAuth))
  }

  // Remove os dados da autenticação ao sair do sistema.
  const signOut = () => {
    setAuth(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  const value = useMemo(
    () => ({
      usuario: auth?.usuario ?? null,
      token: auth?.token ?? null,
      isAuthenticated: Boolean(auth?.token),
      signIn,
      signOut,
    }),
    [auth],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Hook utilizado pelos componentes para acessar os dados de autenticação.
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth precisa ser usado dentro de um <AuthProvider>')
  }
  return context
}
