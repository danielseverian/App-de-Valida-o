import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import TextInput from '../components/TextInput'
import Button from '../components/Button'
import { login } from '../services/authService'
import { useAuth } from '../context/AuthContext'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Login() {
  const navigate = useNavigate()
  const { signIn } = useAuth()

  // Controla os campos, mensagens de erro e carregamento do formulário.
  const [form, setForm] = useState({ email: '', senha: '' })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [loading, setLoading] = useState(false)

  // Atualiza o campo alterado e remove sua mensagem de erro.
  function handleChange(field) {
    return (event) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }))
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  // Verifica se o e-mail e a senha foram preenchidos corretamente.
  function validate() {
    const nextErrors = {}

    if (!form.email.trim()) {
      nextErrors.email = 'Informe seu e-mail.'
    } else if (!EMAIL_REGEX.test(form.email)) {
      nextErrors.email = 'Informe um e-mail válido.'
    }

    if (!form.senha) {
      nextErrors.senha = 'Informe sua senha.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  // Envia as credenciais, salva a autenticação e abre a página de tarefas.
  async function handleSubmit(event) {
    event.preventDefault()
    setFormError('')

    if (!validate()) return

    setLoading(true)
    try {
      const data = await login(form)
      signIn(data)
      navigate('/tarefas')
    } catch (error) {
      setFormError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Login"
      subtitle="Seja Bem-vindo de Volta!"
      footer={
        <p>
          Não tem uma conta? <Link to="/cadastro">Criar conta</Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} noValidate>
        <TextInput
          label="E-mail"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={handleChange('email')}
          error={errors.email}
          required
        />

        <div style={{ marginTop: '16px' }}>
          <TextInput
            label="Senha"
            type="password"
            autoComplete="current-password"
            value={form.senha}
            onChange={handleChange('senha')}
            error={errors.senha}
            required
          />
        </div>

        {formError && (
          <p role="alert" style={{ color: '#ffb4b4', fontWeight: 600, marginTop: '8px' }}>
            {formError}
          </p>
        )}

        <div style={{ marginTop: '24px' }}>
          <Button type="submit" loading={loading}>
            Entrar
          </Button>
        </div>
      </form>
    </AuthLayout>
  )
}
