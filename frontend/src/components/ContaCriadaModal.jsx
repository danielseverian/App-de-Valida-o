import { useState } from 'react'
import './ContaCriadaModal.css'

// Exibe a confirmação do cadastro e orienta o usuário a verificar o e-mail.
export default function ContaCriadaModal({ email, onConfirm, loading, error }) {
    const [tentouConfirmar, setTentouConfirmar] = useState(false)

    function handleConfirmar() {
        setTentouConfirmar(true)
        onConfirm()
    }

    return (
        <div className="conta-criada-overlay" role="presentation">
            <div
                className="conta-criada-modal"
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="conta-criada-titulo"
            >
                <h2 id="conta-criada-titulo" className="conta-criada-modal__titulo">
                    Sua conta foi criada com sucesso!
                </h2>

                <p className="conta-criada-modal__texto">
                    Foi enviado um link para verificação no e-mail!
                    <br />
                    <strong>{email || 'o e-mail que foi registrado'}</strong>
                </p>

                <p className="conta-criada-modal__texto conta-criada-modal__texto--muted">
                    (Verifique também a caixa de spam caso não tenha recebido)
                </p>

                {tentouConfirmar && error && (
                    <p role="alert" className="conta-criada-modal__erro">
                        {error}
                    </p>
                )}

                <button
                    type="button"
                    className="conta-criada-modal__botao"
                    onClick={handleConfirmar}
                    disabled={loading}
                >
                    {loading ? 'Confirmando...' : 'Já confirmei, entrar'}
                </button>
            </div>
        </div>
    )
}