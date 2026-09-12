import './Button.css'

/**
 * Botão em formato de pílula, seguindo o protótipo (Entrar, Salvar, Cadastrar...).
 * variant: 'primary' | 'success' | 'danger' | 'ghost'
 */
export default function Button({
  children,
  variant = 'primary',
  type = 'button',
  disabled = false,
  loading = false,
  onClick,
  fullWidth = true,
}) {
  return (
    <button
      type={type}
      className={`btn btn--${variant} ${fullWidth ? 'btn--full' : ''}`}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? 'Carregando...' : children}
    </button>
  )
}
