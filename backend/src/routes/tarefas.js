import { supabase } from '../lib/supabase.js';
import { autenticar } from '../middlewares/autenticar.js';

const STATUS_VALIDOS = ['pendente', 'em_andamento', 'concluido'];

function validarCamposTarefa(body) {
  const { nome, status, data_come, data_termi } = body;

  if (!nome || typeof nome !== 'string' || nome.trim() === '') {
    return 'Campo "nome" é obrigatório';
  }

  if (!data_come) {
    return 'Campo "data_come" é obrigatório';
  }

  if (!data_termi) {
    return 'Campo "data_termi" é obrigatório';
  }

  if (new Date(data_termi) < new Date(data_come)) {
    return 'Campo "data_termi" não pode ser anterior a "data_come"';
  }

  if (status !== undefined && !STATUS_VALIDOS.includes(status)) {
    return `Campo "status" deve ser um de: ${STATUS_VALIDOS.join(', ')}`;
  }

  return null;
}

export async function tarefasRoutes(fastify) {
  // POST /tarefas
  fastify.post('/tarefas', { preHandler: autenticar }, async (request, reply) => {
    const erro = validarCamposTarefa(request.body);
    if (erro) return reply.code(400).send({ erro });

    const {
      nome,
      status = 'pendente',
      data_come,
      data_termi,
    } = request.body;

    const { data: tarefa, error } = await request.supabaseUser
        .from('tarefas')
        .insert({
          nome,
          status,
          data_come,
          data_termi,
          user_id: request.userId,
        })
        .select()
        .single();

    if (error) return reply.code(400).send({ erro: error.message });

    return reply.code(201).send(tarefa);
});

  // GET /tarefas
  fastify.get('/tarefas', { preHandler: autenticar }, async (request, reply) => {
    const { data: tarefas, error } = await request.supabaseUser
      .from('tarefas')
      .select('*')
      .eq('user_id', request.userId);

    if (error) return reply.code(400).send({ erro: error.message });

    return reply.send(tarefas);
  });

  // PUT /tarefas/:id 
  fastify.put('/tarefas/:id', { preHandler: autenticar }, async (request, reply) => {
    const { id } = request.params;

    const erro = validarCamposTarefa(request.body);
    if (erro) return reply.code(400).send({ erro });

    const {
      nome,
      status = 'pendente',
      data_come,
      data_termi,
    } = request.body;

    const { data: tarefa, error } = await request.supabaseUser
      .from('tarefas')
      .update({ nome, status, data_come, data_termi })
      .eq('id', id)
      .eq('user_id', request.userId)
      .select()
      .single();

    if (error) return reply.code(400).send({ erro: error.message });
    if (!tarefa) return reply.code(404).send({ erro: 'Tarefa não encontrada' });

    return reply.send(tarefa);
  });

 // DELETE /tarefas/:id
  fastify.delete('/tarefas/:id', { preHandler: autenticar }, async (request, reply) => {
    const { id } = request.params;
 
    const { error, count } = await request.supabaseUser
      .from('tarefas')
      .delete({ count: 'exact' })
      .eq('id', id)
      .eq('user_id', request.userId);
 
    if (error) return reply.code(400).send({ erro: error.message });
    if (count === 0) return reply.code(404).send({ erro: 'Tarefa não encontrada' });
 
    return reply.code(200).send({ mensagem: 'Tarefa excluída com sucesso' });
  });
}