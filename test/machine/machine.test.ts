import { beforeEach, describe, it, expect } from 'vitest';
import { interpret } from 'xstate';
import { GameMachine, GameModel, makeGame } from '../../src/machine/GameMachine'
import { GameStates, Machine, PlayerColor } from '../../src/types';

describe("machine/GameMachine", () => {
    describe('join', () => {

        let machine: Machine;
        beforeEach(() => {
            machine = interpret(GameMachine).start();
        });

        it('should let a player join', () => {
            expect(machine.send(GameModel.events.join("1", "1")).changed).toBe(true);
            expect(machine.state.context.players).toHaveLength(1);
        });

        it('should let a second player join', () => {
            expect(machine.send(GameModel.events.join("1", "1")).changed).toBe(true);
            expect(machine.state.context.players).toHaveLength(1);
            expect(machine.send(GameModel.events.join("2", "2")).changed).toBe(true);
            expect(machine.state.context.players).toHaveLength(2);
        });

    });

    describe('dropToken', () => {
        let machine: Machine;
        beforeEach(() => {
            machine = makeGame(GameStates.PLAY, {
                players: [
                    { id: '1', name: '1', color: PlayerColor.RED },
                    { id: '2', name: '2', color: PlayerColor.YELLOW },

                ],
                currentPlayer: '1',
                grid: [
                    ["E", "E", "E", "E", "E", "E", "R"],
                    ["E", "E", "E", "E", "E", "R", "Y"],
                    ["E", "E", "E", "E", "E", "R", "R"],
                    ["E", "E", "E", "E", "E", "R", "Y"],
                    ["E", "E", "E", "E", "E", "Y", "R"],
                    ["E", "E", "E", "E", "E", "Y", "Y"]
                ]
            });
        });

        it('should not let unauthorized player drop a token', () => {
            expect(machine.send(GameModel.events.dropToken("2", 0)).changed).toBe(false);
        })
        it('should let player drop a token', () => {
            expect(machine.send(GameModel.events.dropToken("1", 0)).changed).toBe(true);
            expect(machine.state.context.grid[5][0]).toBe(PlayerColor.RED);
            expect(machine.state.value).toBe(GameStates.PLAY);
            expect(machine.state.context.currentPlayer).toBe("2");
        })
        it('should not let player drop a token if filled', () => {
            expect(machine.send(GameModel.events.dropToken("1", 6)).changed).toBe(false);
        })
        it('should let player win', () => {
            expect(machine.send(GameModel.events.dropToken("1", 5)).changed).toBe(true);
            expect(machine.state.value).toBe(GameStates.VICTORY);
        })
        it('should handle draw', () => {
            machine = makeGame(GameStates.PLAY, {
                ...machine.state.context,
                grid: [
                    ["E", "Y", "Y", "Y", "Y", "Y", "Y"],
                    ["Y", "Y", "Y", "Y", "Y", "Y", "Y"],
                    ["Y", "Y", "Y", "Y", "Y", "Y", "Y"],
                    ["Y", "Y", "Y", "Y", "Y", "Y", "Y"],
                    ["Y", "Y", "Y", "Y", "Y", "Y", "Y"],
                    ["Y", "Y", "Y", "Y", "Y", "Y", "Y"],
                ]
            });
            expect(machine.send(GameModel.events.dropToken("1", 0)).changed).toBe(true);
            expect(machine.state.value).toBe(GameStates.DRAW);

        })
        it('should not fire unnecessary draw', () => {
            machine = makeGame(GameStates.PLAY, {
                ...machine.state.context,
                grid: [
                    ["E", "E", "Y", "Y", "Y", "Y", "Y"],
                    ["Y", "Y", "Y", "Y", "Y", "Y", "Y"],
                    ["Y", "Y", "Y", "Y", "Y", "Y", "Y"],
                    ["Y", "Y", "Y", "Y", "Y", "Y", "Y"],
                    ["Y", "Y", "Y", "Y", "Y", "Y", "Y"],
                    ["Y", "Y", "Y", "Y", "Y", "Y", "Y"],
                ]
            });
            expect(machine.send(GameModel.events.dropToken("1", 0)).changed).toBe(true);
            expect(machine.state.value).toBe(GameStates.PLAY);
        })

    });
})