// Funções responsáveis pela comunicação entre o frontend e as rotas de autenticação do backend.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api' // Endereço-base utilizado em todas as requisições de autenticação.


// Função auxiliar que centraliza o envio das requisições e o tratamento da resposta.
async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    const message = data?.message || 'Não foi possível completar a solicitação.'
    throw new Error(message)
  }

  return data
}

/**
 * POST /auth/login
 * body: { email, senha }
 * espera receber: { token, usuario: { id, nome, email } }
 */

// Envia e-mail e senha para autenticar o usuário.
export function login({ email, senha }) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, senha }),
  })
}

/**
 * POST /auth/cadastro
 * body: { nome, email, senha }
 * espera receber: { mensagem, usuario: { id, nome, email } }.
 * O backend (Supabase) envia um e-mail com o link de confirmação da conta.
 */

// Envia os dados necessários para cadastrar um novo usuário.
export function cadastrar({ nome, email, senha }) {
  return request('/auth/cadastro', {
    method: 'POST',
    body: JSON.stringify({ nome, email, senha }),
  })
}