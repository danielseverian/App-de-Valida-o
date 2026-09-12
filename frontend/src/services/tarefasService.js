const API_URL = import.meta.env.VITE_API_URL

// Busca todas as tarefas do usuário autenticado.
export async function listarTarefas(token) {
    const response = await fetch(`${API_URL}/tarefas`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    })

    return response.json()
}

// Cadastra uma nova tarefa.
export async function cadastrarTarefa(token, tarefa) {
    await fetch(`${API_URL}/tarefas`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(tarefa),
    })
}

// Exclui uma tarefa pelo seu identificador.
export async function excluirTarefa(token, id) {
    await fetch(`${API_URL}/tarefas/${id}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
}

// Atualiza os dados de uma tarefa existente.
export async function editarTarefa(token, id, tarefa) {
    await fetch(`${API_URL}/tarefas/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(tarefa),
    })
}