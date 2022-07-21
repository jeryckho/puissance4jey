import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import fastifyWebsocket from '@fastify/websocket';
import { v4 } from 'uuid';
import { sign, verify } from './func/crypto';
import { resolve } from 'path';
import { ServerErrors } from '../types';
import { ConnectionRepository } from './repositories/ConnectionRepository';
import { GameRepository } from './repositories/GameRepository';
import { GameModel } from '../machine/GameMachine';
import { publishMachine } from './func/socket';

const connections = new ConnectionRepository();
const games = new GameRepository(connections);

const fastify = Fastify({ logger: true });
fastify.register(fastifyStatic, {
    root: resolve("./public")
});
fastify.register(fastifyWebsocket)
fastify.register(async (f) => {
    f.get('/ws', { websocket: true }, (connection, req) => {
        const query = req.query as Record<string, string>;
        const playerId = query.id ?? '';
        const signature = query.signature ?? '';
        const playerName = query.name || 'John Doe';
        const gameId = query.gameId;

        if (!gameId) {
            connection.end();
            f.log.error('No gameId')
            return;
        }
        if (!verify(playerId, signature)) {
            f.log.error('bad signature')
            connection.socket.send(JSON.stringify({
                type: 'error',
                code: ServerErrors.AuthError
            }));
            return;
        }

        const game = games.find(gameId) ?? games.create(gameId);
        connections.persist(playerId, gameId, connection);
        game.send(GameModel.events.join(playerId, playerName));
        publishMachine(game.state, connection);

        connection.socket.on("message", (rawMessage) => {
            const message = JSON.parse(rawMessage.toLocaleString());
            if (message.type === 'gameUpdate') {
                game.send(message.event);
            }
        });

        connection.socket.on("close", () => {
            connections.remove(playerId, gameId);
            game.send(GameModel.events.leave(playerId));
            games.clean(gameId);
        });
    })
})

fastify.post('/api/players', (req, res) => {
    const id = v4();
    const signature = sign(id);
    res.send({
        id,
        signature
    });
});

fastify.listen({ port: 8000 }).catch((err) => {
    fastify.log.error(err);
    process.exit(1);
}).then(() => fastify.log.info('started@8000'));
