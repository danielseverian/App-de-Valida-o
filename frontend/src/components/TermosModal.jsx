import { useEffect, useRef, useState } from 'react'
import { termosDeUso, politicaPrivacidade } from '../data/termosContent'
import './TermosModal.css'

const CONTEUDO = {
  termos: termosDeUso,
  privacidade: politicaPrivacidade,
}

// Distância (em px) até o fim do scroll a partir da qual já consideramos "leu tudo".
const TOLERANCIA_SCROLL = 16

/**
 * Modal com o texto completo de "Termos de Uso" ou "Política de Privacidade".
 * O botão "Confirmar" só aparece depois que a pessoa rola o conteúdo até o final,
 * garantindo que ela pelo menos passou pelo texto antes de poder aceitar.
 */
export default function TermosModal({ tipo, onClose, onConfirm }) {
  const conteudo = CONTEUDO[tipo]
  const corpoRef = useRef(null)
  const [podeConfirmar, setPodeConfirmar] = useState(false)

  useEffect(() => {
    setPodeConfirmar(false)
  }, [tipo])

  useEffect(() => {
    // Se o texto já couber sem precisar rolar, libera o Confirmar direto.
    const el = corpoRef.current
    if (el && el.scrollHeight <= el.clientHeight + TOLERANCIA_SCROLL) {
      setPodeConfirmar(true)
    }
  }, [tipo])

  if (!conteudo) return null

  function handleScroll(event) {
    const el = event.target
    const chegouAoFim = el.scrollTop + el.clientHeight >= el.scrollHeight - TOLERANCIA_SCROLL
    if (chegouAoFim) setPodeConfirmar(true)
  }

  return (
    <div className="termos-modal-overlay" role="presentation" onClick={onClose}>
      <div
        className="termos-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="termos-modal-titulo"
        onClick={(event) => event.stopPropagation()}
      >
        <button className="termos-modal__fechar" onClick={onClose} aria-label="Fechar">
          ×
        </button>

        <h2 id="termos-modal-titulo" className="termos-modal__titulo">
          {conteudo.titulo}
        </h2>

        <div className="termos-modal__corpo" ref={corpoRef} onScroll={handleScroll}>
          {conteudo.intro && <p>{conteudo.intro}</p>}

          {conteudo.secoes.map((secao) => (
            <div key={secao.titulo} className="termos-modal__secao">
              <h3>{secao.titulo}</h3>
              {secao.paragrafos.map((paragrafo, index) => (
                <p key={index}>{paragrafo}</p>
              ))}
              {secao.lista && (
                <ul>
                  {secao.lista.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {podeConfirmar && (
          <button className="termos-modal__confirmar" onClick={onConfirm}>
            Confirmar
          </button>
        )}
      </div>
    </div>
  )
}
