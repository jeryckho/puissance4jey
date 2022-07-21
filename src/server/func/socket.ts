import { SocketStream } from "@fastify/websocket";
import { Machine } from "../../types";
import { ConnectionRepository } from "../repositories/ConnectionRepository";


export function publishMachineToPlayers(machine: Machine["state"], connections: ConnectionRepository, gameId: string) {
    for (const player of machine.context.players) {
        const connection = connections.find(player.id, gameId);
        if (connection) {
            publishMachine(machine, connection);
        }
    }
}

export function publishMachine(machine: Machine["state"], connection: SocketStream) {
    connection.socket.send(JSON.stringify({
        type: 'gameUpdate',
        state: machine.value,
        context: machine.context //HIDE hidden personal things
    }));
}