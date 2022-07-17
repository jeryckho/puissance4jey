import { beforeEach, describe, it, expect } from 'vitest';
import { interpret, InterpreterFrom } from 'xstate';
import { GameMachine, GameModel } from '../../src/machine/GameMachine'

describe("machine/guards", () => {
    describe('canJoinGuard', () => {

        let machine: InterpreterFrom<typeof GameMachine>;
        beforeEach(() => {
            machine = interpret(GameMachine).start();
        });

        it('should let a player join', () => {
            expect(machine.send(GameModel.events.join("1","1")).changed).toBe(true);
        });

        it('should not let a player join more than once', () => {
            expect(machine.send(GameModel.events.join("1","1")).changed).toBe(true);
            expect(machine.send(GameModel.events.join("1","1")).changed).toBe(false);
        });

        it('should let a second player join', () => {
            expect(machine.send(GameModel.events.join("1","1")).changed).toBe(true);
            expect(machine.send(GameModel.events.join("2","2")).changed).toBe(true);
        });

        it('should not let a third player join', () => {
            expect(machine.send(GameModel.events.join("1","1")).changed).toBe(true);
            expect(machine.send(GameModel.events.join("2","2")).changed).toBe(true);
            expect(machine.send(GameModel.events.join("3","3")).changed).toBe(false);
        });
    })
})