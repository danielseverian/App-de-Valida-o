import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import TextInput from '../components/TextInput'
import Button from '../components/Button'
import TermosModal from '../components/TermosModal'
import ContaCriadaModal from '../components/ContaCriadaModal'
import { cadastrar, login } from '../services/authService'
import { useAuth } from '../context/AuthContext'
import './Cadastro.css'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const INITIAL_FORM = {
  nome: '',
  email: '',
  senha: '',
  confirmarSenha: '',
}

export default function Cadastro() {
  const navigate = useNavigate()
  const { signIn } = useAuth()

  // Estados responsáveis pelos dados do formulário e pela interface da página.
  const [form, setForm] = useState(INITIAL_FORM)
  const [aceitaTermos, setAceitaTermos] = useState(false)
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [loading, setLoading] = useState(false)
  const [modalAberto, setModalAberto] = useState(null) // 'termos' | 'privacidade' | null
  const [contaCriada, setContaCriada] = useState(false)
  const [confirmando, setConfirmando] = useState(false)
  const [confirmarErro, setConfirmarErro] = useState('')

  // Atualiza apenas o campo que foi alterado pelo usuário.
  function handleChange(field) {
    return (event) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }))
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  // Valida os campos antes de enviar os dados ao backend.
  function validate() {
    const nextErrors = {}

    if (!form.nome.trim()) {
      nextErrors.nome = 'Informe seu nome completo.'
    }

    if (!form.email.trim()) {
      nextErrors.email = 'Informe seu e-mail.'
    } else if (!EMAIL_REGEX.test(form.email)) {
      nextErrors.email = 'Informe um e-mail válido.'
    }

    if (!form.senha) {
      nextErrors.senha = 'Crie uma senha.'
    } else if (form.senha.length < 6) {
      nextErrors.senha = 'A senha precisa ter pelo menos 6 caracteres.'
    }

    if (form.confirmarSenha !== form.senha) {
      nextErrors.confirmarSenha = 'As senhas não coincidem.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  // Impede o recarregamento da página, valida e realiza o cadastro.
  async function handleSubmit(event) {
    event.preventDefault()
    setFormError('')

    const isValid = validate()

    if (!aceitaTermos) {
      setFormError('Você precisa aceitar os Termos de Uso e a Política de Privacidade para continuar.')
    }

    if (!isValid || !aceitaTermos) return

    setLoading(true)
    try {
      await cadastrar(form)
      setContaCriada(true)
    } catch (error) {
      setFormError(error.message)
    } finally {
      setLoading(false)
    }
  }

  // Após a confirmação do email, realiza o login e redireciona o usuário.
  async function handleConfirmarEmail() {
    setConfirmarErro('')
    setConfirmando(true)
    try {
      const data = await login({ email: form.email, senha: form.senha })
      signIn(data)
      navigate('/login')
    } catch (error) {
      setConfirmarErro(error.message)
    } finally {
      setConfirmando(false)
    }
  }

  return (
    <AuthLayout
      title="Crie sua conta"
      subtitle="Preencha os dados abaixo para criar sua conta"
      showBack
      maxWidth="700px"
      footer={
        <p>
          Já tem uma conta? <Link to="/login">Entrar</Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} noValidate>
        <TextInput
          label="Nome completo"
          autoComplete="name"
          value={form.nome}
          onChange={handleChange('nome')}
          error={errors.nome}
          required
        />

        <div className="cadastro-field-gap">
          <TextInput
            label="E-mail"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={handleChange('email')}
            error={errors.email}
            required
          />
        </div>

        <div className="cadastro-field-gap cadastro-senhas">
          <TextInput
            label="Senha"
            type="password"
            autoComplete="new-password"
            value={form.senha}
            onChange={handleChange('senha')}
            error={errors.senha}
            required
          />
          <TextInput
            label="Confirmar senha"
            type="password"
            autoComplete="new-password"
            value={form.confirmarSenha}
            onChange={handleChange('confirmarSenha')}
            error={errors.confirmarSenha}
            required
          />
        </div>

        <label className="cadastro-termos">
          <input
            type="checkbox"
            checked={aceitaTermos}
            onChange={(event) => setAceitaTermos(event.target.checked)}
          />
          <span>
            Li e concordo com os{' '}
            <button
              type="button"
              className="cadastro-termos__link"
              onClick={(event) => {
                event.preventDefault()
                event.stopPropagation()
                setModalAberto('termos')
              }}
            >
              Termos de Uso
            </button>{' '}
            e{' '}
            <button
              type="button"
              className="cadastro-termos__link"
              onClick={(event) => {
                event.preventDefault()
                event.stopPropagation()
                setModalAberto('privacidade')
              }}
            >
              Política de Privacidade
            </button>
          </span>
        </label>

        {formError && (
          <p role="alert" className="cadastro-error">
            {formError}
          </p>
        )}

        <div className="cadastro-field-gap">
          <Button type="submit" loading={loading}>
            Criar conta
          </Button>
        </div>
      </form>

      {modalAberto && (
        <TermosModal
          tipo={modalAberto}
          onClose={() => setModalAberto(null)}
          onConfirm={() => {
            setAceitaTermos(true)
            setModalAberto(null)
          }}
        />
      )}

      {contaCriada && (
        <ContaCriadaModal
          email={form.email}
          onConfirm={handleConfirmarEmail}
          loading={confirmando}
          error={confirmarErro}
        />
      )}
    </AuthLayout>
  )
}
