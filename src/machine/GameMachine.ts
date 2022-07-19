import { interpret, InterpreterFrom } from "xstate";
import { createModel } from "xstate/lib/model"
import { GameStates, GameContext, GridState, Player, PlayerColor, Position } from "../types";
import { chooseColorAction, dropTokenAction, joinGameAction, leaveGameAction, restartAction, saveWiningAction, setCurrentPlayerAction, switchPlayerAction } from "./actions";
import { canChooseColorGuard, canDropTokenGuard, canJoinGuard, canLeaveGuard, canStartGuard, isDrawMoveGuard, isWiningMoveGuard } from "./guard";

export const GameModel = createModel({
    players: [] as Player[],
    currentPlayer: null as null | Player['id'],
    winLength: 4,
    winingPositions: [] as Position[],
    grid: [
        ["E", "E", "E", "E", "E", "E", "E"],
        ["E", "E", "E", "E", "E", "E", "E"],
        ["E", "E", "E", "E", "E", "E", "E"],
        ["E", "E", "E", "E", "E", "E", "E"],
        ["E", "E", "E", "E", "E", "E", "E"],
        ["E", "E", "E", "E", "E", "E", "E"]
    ] as GridState
}, {
    events: {
        join: (playerId: Player['id'], name: Player['name']) => ({ playerId, name }),
        leave: (playerId: Player['id']) => ({ playerId }),
        chooseColor: (playerId: Player['id'], color: PlayerColor) => ({ playerId, color }),
        start: (playerId: Player['id']) => ({ playerId }),
        dropToken: (playerId: Player['id'], x: number) => ({ playerId, x }),
        restart: (playerId: Player['id']) => ({ playerId }),
    }
});

export const GameMachine = GameModel.createMachine({
    id: 'game',
    context: GameModel.initialContext,
    initial: GameStates.LOBBY,
    states: {
        [GameStates.LOBBY]: {
            on: {
                join: {
                    cond: canJoinGuard,
                    actions: [GameModel.assign(joinGameAction)],
                    target: GameStates.LOBBY
                },
                leave: {
                    cond: canLeaveGuard,
                    actions: [GameModel.assign(leaveGameAction)],
                    target: GameStates.LOBBY
                },
                chooseColor: {
                    cond: canChooseColorGuard,
                    actions: [GameModel.assign(chooseColorAction)],
                    target: GameStates.LOBBY
                },
                start: {
                    cond: canStartGuard,
                    actions: [GameModel.assign(setCurrentPlayerAction)],
                    target: GameStates.PLAY
                }
            }

        },
        [GameStates.PLAY]: {
            after: {
                30_000: {
                    target: GameStates.PLAY,
                    actions: [GameModel.assign(switchPlayerAction)]
                }
            },
            on: {
                dropToken: [{
                    cond: isWiningMoveGuard,
                    actions: [GameModel.assign(saveWiningAction), GameModel.assign(dropTokenAction)],
                    target: GameStates.VICTORY,
                }, {
                    cond: isDrawMoveGuard,
                    actions: [GameModel.assign(dropTokenAction)],
                    target: GameStates.DRAW,
                }, {
                    cond: canDropTokenGuard,
                    actions: [GameModel.assign(dropTokenAction), GameModel.assign(switchPlayerAction)],
                    target: GameStates.PLAY,
                }]
            }
        },
        [GameStates.VICTORY]: {
            on: {
                restart: {
                    target: GameStates.LOBBY,
                    actions: [GameModel.assign(restartAction), GameModel.assign(setCurrentPlayerAction)]
                }
            }
        },
        [GameStates.DRAW]: {
            on: {
                restart: {
                    target: GameStates.LOBBY,
                    actions: [GameModel.assign(restartAction), GameModel.assign(setCurrentPlayerAction)]
                }
            }
        }
    }
});

export function makeGame(state: GameStates = GameStates.LOBBY, context: Partial<GameContext> = {}): InterpreterFrom<typeof GameMachine> {
    const machine = interpret(
        GameMachine.withContext({
            ...GameModel.initialContext,
            ...context
        })
    ).start();
    machine.state.value = state;
    return machine;
}