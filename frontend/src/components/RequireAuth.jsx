import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Impede o acesso à página de tarefas quando o usuário não está autenticado.
export default function RequireAuth({ children }) {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}
