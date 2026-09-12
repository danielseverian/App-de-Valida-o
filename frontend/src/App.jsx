import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Cadastro from './pages/Cadastro'
import Tarefas from './pages/Tarefas'
import RequireAuth from './components/RequireAuth'

export default function App() {
  return (
    <Routes>
      {/* Redireciona a rota inicial para a tela de login. */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Rotas públicas: não exigem autenticação. */}
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />

      {/* Rota protegida: somente usuários autenticados podem acessar. */}
      <Route path="/tarefas" element={<RequireAuth><Tarefas /></RequireAuth>} />

      {/* Qualquer endereço inexistente retorna para o login. */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}