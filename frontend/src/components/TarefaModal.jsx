import { useState } from 'react'
import './TarefaModal.css'

export default function TarefaModal({ onClose, onSave, tarefa }) {
    // Se uma tarefa foi recebida, preenche o formulário para edição.
    // Caso contrário, inicia os campos vazios para um novo cadastro.
    const [formulario, setFormulario] = useState({
        nome: tarefa?.nome ?? '',
        status: tarefa?.status ?? 'pendente',
        data_come: tarefa?.data_come ?? '',
        data_termi: tarefa?.data_termi ?? '',
    })

    // Atualiza o campo correspondente ao atributo "name" do input.
    function handleChange(event) {
        const { name, value } = event.target

        setFormulario({
            ...formulario,
            [name]: value,
        })
    }

    // Envia os dados preenchidos para a função recebida em onSave.
    function handleSubmit(event) {
        event.preventDefault()
        onSave(formulario)
    }

    return (
        <div className="modal-fundo">
            <div className="modal-container">
                <div className="modal-cabecalho">
                    <h2>{tarefa ? 'Editar Tarefa' : 'Cadastro de Tarefa'}</h2>
                </div>

                <div className="modal-conteudo">
                    <form className="modal-formulario" onSubmit={handleSubmit}>
                        <label>
                            Título
                            <input type="text" name="nome" value={formulario.nome} onChange={handleChange} required />
                        </label>

                        <div className="modal-linha">
                            <label>
                                Status
                                {tarefa ? (
                                    <select
                                        name="status"
                                        value={formulario.status}
                                        onChange={handleChange}
                                    >
                                        <option value="pendente">Pendente</option>
                                        <option value="em_andamento">Em andamento</option>
                                        <option value="concluido">Concluída</option>
                                    </select>
                                ) : (
                                    <input type="text" value="Pendente" readOnly />
                                )}
                                {/* O status só pode ser alterado durante a edição da tarefa. */}
                            </label>

                            <label>
                                Início
                                <input type="date" name="data_come" value={formulario.data_come} onChange={handleChange} required />
                            </label>

                            <label>
                                Término
                                <input type="date" name="data_termi" value={formulario.data_termi} onChange={handleChange} required />
                            </label>
                        </div>

                        {/* Salvar envia o formulário; Cancelar apenas fecha o modal. */}
                        <div className="modal-acoes">
                            <button type="submit" className="botao-salvar">
                                Salvar
                            </button>

                            <button type="button" className="botao-cancelar" onClick={onClose}>
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
