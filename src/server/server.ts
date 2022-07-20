import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import { v4 } from 'uuid';
import { sign, verify } from './func/crypto';
import { resolve } from 'path';

const fastify = Fastify({ logger: true });
fastify.register(fastifyStatic, {
    root: resolve("./public")
});

fastify.post('/api/players', (req, res) => {
    const playerId = v4();
    const signature = sign(playerId);
    res.send({
        playerId,
        signature
    });
});

fastify.listen({ port: 8000 }).catch((err) => {
    fastify.log.error(err);
    process.exit(1);
}).then(() => fastify.log.info('started@8000'));
