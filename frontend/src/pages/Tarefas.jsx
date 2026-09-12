import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { listarTarefas, cadastrarTarefa, excluirTarefa, editarTarefa } from '../services/tarefasService'
import './Tarefas.css'
import TarefaModal from '../components/TarefaModal'

// Converte a data recebida do backend para o formato dia/mês/ano.
function formatarData(data) {
    if (!data) return '-'

    const [ano, mes, dia] = data.split('T')[0].split('-')
    return `${dia}/${mes}/${ano}`
}

// Converte o valor salvo no banco para um texto amigável.
function formatarStatus(status) {
    const statusFormatados = {
        pendente: 'Pendente',
        em_andamento: 'Em andamento',
        concluido: 'Concluída',
    }

    return statusFormatados[status] ?? status
}

export default function Tarefas() {
    const { token, signOut } = useAuth()
    const navigate = useNavigate()

    // Controla a lista, a abertura do modal e a tarefa selecionada.
    const [tarefas, setTarefas] = useState([])
    const [modalAberto, setModalAberto] = useState(false)
    const [tarefaSelecionada, setTarefaSelecionada] = useState(null)

    // Busca no backend as tarefas pertencentes ao usuário autenticado.
    async function carregarTarefas() {
        const data = await listarTarefas(token)
        setTarefas(data)
    }

    // Carrega as tarefas quando o token de autenticação estiver disponível.
    useEffect(() => {
        if (token) {
            carregarTarefas()
        }
    }, [token])

    // Edita a tarefa selecionada ou cadastra uma nova tarefa.
    async function handleSalvar(dadosTarefa) {
        if (tarefaSelecionada) {
            await editarTarefa(token, tarefaSelecionada.id, dadosTarefa)
        } else {
            await cadastrarTarefa(token, dadosTarefa)
        }

        await carregarTarefas()
        fecharModal()
    }

    // Solicita confirmação antes de excluir a tarefa.
    async function handleExcluir(id) {
        const confirmou = window.confirm(
            'Deseja realmente excluir esta tarefa?',
        )

        if (!confirmou) return

        await excluirTarefa(token, id)
        await carregarTarefas()
    }

    // Limpa a seleção e fecha o formulário de cadastro ou edição.
    function fecharModal() {
        setTarefaSelecionada(null)
        setModalAberto(false)
    }

    function handleSair() {
        signOut()
        navigate('/login')
    }

    return (
        <main className="tarefas-page">
            <button type="button" className="botao-sair" onClick={handleSair}>
                Sair
            </button>

            <section className="tarefas-container">
                <button type="button" className="botao-cadastrar" onClick={() => {
                    setTarefaSelecionada(null)
                    setModalAberto(true)
                }}>
                    Cadastrar
                </button>

                <table className="tarefas-tabela">
                    <thead>
                        <tr>
                            <th>Tarefa</th>
                            <th>Começa</th>
                            <th>Termina</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                    </thead>

                    <tbody>
                        {tarefas.map((tarefa) => (
                            <tr key={tarefa.id}>
                                <td>{tarefa.nome}</td>
                                <td>{formatarData(tarefa.data_come)}</td>
                                <td>{formatarData(tarefa.data_termi)}</td>
                                <td>
                                    <span className="status">
                                        {formatarStatus(tarefa.status)}
                                    </span>
                                </td>
                                <td className="acoes-tarefa">
                                    <button type="button" className="botao-editar" onClick={() => {
                                        setTarefaSelecionada(tarefa)
                                        setModalAberto(true)
                                    }}>
                                        Editar
                                    </button>

                                    <button type="button" className="botao-excluir" onClick={() => handleExcluir(tarefa.id)}>
                                        Excluir
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
            {
                modalAberto && (
                    <TarefaModal
                        tarefa={tarefaSelecionada}
                        onClose={fecharModal}
                        onSave={handleSalvar}
                    />
                )
            }
        </main >
    )
}