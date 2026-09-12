import { createClient } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase.js';
import 'dotenv/config';

export async function autenticar(request, reply) {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
        return reply.code(401).send({ erro: 'Token ausente' });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
        return reply.code(401).send({ erro: 'Token inválido' });
    }

    if (!data.user.email_confirmed_at) {
        return reply.code(403).send({ erro: 'E-mail não verificado' });
    }

    request.userId = data.user.id;

    request.supabaseUser = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_ANON_KEY,
        {
            global: {
                headers: { Authorization: `Bearer ${token}` }
            }
        }
    );

}