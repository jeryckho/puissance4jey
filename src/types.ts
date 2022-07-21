import { ContextFrom, EventFrom, InterpreterFrom } from "xstate";
import { GameMachine, GameModel } from "./machine/GameMachine";

export type Position = {
    x: number,
    y: number
}

export enum GameStates {
    LOBBY = 'LOBBY',
    PLAY = 'PLAY',
    VICTORY = 'VICTORY',
    DRAW = 'DRAW'
}

export enum QueryParams {
    GAMEID = 'gameId'
}

export enum PlayerColor {
    RED = 'R',
    YELLOW = 'Y'
}
export type Player = {
    id: string,
    name: string,
    color?: PlayerColor
}
export type PlayerSession = {
    id: string,
    name: string,
    signature: string
}

export type CellEmpty = "E";
export type CellState = "R" | "Y" | PlayerColor.RED | PlayerColor.YELLOW | CellEmpty;
export type GridState = CellState[][];
export type GameContext = ContextFrom<typeof GameModel>;
export type GameEvents = EventFrom<typeof GameModel>;
export type GameEvent<T extends GameEvents['type']> = GameEvents & { type: T };
export type GameGuard<T extends GameEvents['type']> = (
    context: GameContext,
    event: GameEvent<T>
) => boolean;
export type GameAction<T extends GameEvents['type']> = (
    context: GameContext,
    event: GameEvent<T>
) => Partial<GameContext>;

export type Machine = InterpreterFrom<typeof GameMachine>;

export enum ServerErrors {
    AuthError
}