import { useNavigate } from 'react-router-dom'
import './AuthLayout.css'

/**
 * Estrutura visual compartilhada por Login, Cadastro, etc:
 * botão "Voltar" opcional, título grande, subtítulo e um bloco central com o formulário.
 */
export default function AuthLayout({ title, subtitle, children, footer, showBack = false, maxWidth }) {
  const navigate = useNavigate()

  return (
    <div className="auth-screen">
      {showBack && (
        <button className="auth-screen__back" onClick={() => navigate(-1)}>
          <span aria-hidden="true">‹</span> Voltar
        </button>
      )}

      <div className="auth-screen__content" style={maxWidth ? { maxWidth } : undefined}>
        <h1 className="auth-screen__title">{title}</h1>
        {subtitle && <p className="auth-screen__subtitle">{subtitle}</p>}

        <div className="auth-screen__form">{children}</div>

        {footer && <div className="auth-screen__footer">{footer}</div>}
      </div>
    </div>
  )
}
