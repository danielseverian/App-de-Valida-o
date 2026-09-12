import { supabase } from '../lib/supabase.js';
import 'dotenv/config';

import { createClient } from '@supabase/supabase-js';


export async function authRoutes(fastify) {
  fastify.post('/cadastro', async (request, reply) => {
    const { nome, email, senha } = request.body;

    const { data, error } = await supabase.auth.signUp({
      email,
      password: senha,
      options: { data: { nome } }
    });

    if (error) return reply.code(400).send({ message: error.message });
    
    if (data.user && data.user.identities && data.user.identities.length === 0) {
    return reply.code(409).send({ message: 'E-mail já cadastrado' });
  }

    return reply.code(201).send({
    mensagem: 'Cadastro realizado! Verifique seu e-mail para confirmar.',
    usuario: {
        id: data.user.id,
        nome: data.user.user_metadata.nome,
        email: data.user.email
    }
    });
  });

  fastify.post('/login', async (request, reply) => {
    const { email, senha } = request.body;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: senha
    });

    if (error) return reply.code(401).send({ message: error.message });

    return reply.send({
      token: data.session.access_token,
      usuario: data.user
    });
  });

// Rota opcional de redefinição de senha, proposta como atividade complementar.  
  fastify.post('/redefinir-senha', async (request, reply) => {
    const { token, novaSenha } = request.body;

    if (!token) {
      return reply.code(400).send({ message: 'Campo "token" é obrigatório' });
    }

    if (!novaSenha) {
      return reply.code(400).send({ message: 'Campo "novaSenha" é obrigatório' });
    }

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return reply.code(501).send({
        message: 'Redefinição de senha incompleta: falta SUPABASE_SERVICE_ROLE_KEY no .env'
      });
    }

    const { data, error: erroToken } = await supabase.auth.getUser(token);
    if (erroToken || !data.user) {
      return reply.code(401).send({ message: 'Token inválido ou expirado' });
    }

    const supabaseAdmin = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { error } = await supabaseAdmin.auth.admin.updateUserById(
      data.user.id,
      { password: novaSenha }
    );

    if (error) return reply.code(400).send({ message: error.message });

    return reply.send({ mensagem: 'Senha redefinida com sucesso.' });
  });
}