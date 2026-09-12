import Fastify from 'fastify';
import { authRoutes } from './routes/auth.js';
import { tarefasRoutes } from './routes/tarefas.js';

const fastify = Fastify({ logger: true });

fastify.register(authRoutes, { prefix: '/auth' });
fastify.register(tarefasRoutes);

fastify.listen({ port: 3000 }, (err) => {
  if (err) throw err;
  console.log('Servidor rodando na porta 3000');
});