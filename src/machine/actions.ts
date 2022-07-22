import { freePositionY, winingPositions, currentPlayer } from "../func/games";
import { GameAction, GameContext, PlayerColor } from "../types";
import { GameModel } from "./GameMachine";

export const joinGameAction: GameAction<'join'> = (context, event) => ({
    players: [...context.players, { id: event.playerId, name: event.name }]
})

export const leaveGameAction: GameAction<'leave'> = (context, event) => ({
    players: context.players.filter(p => p.id !== event.playerId)
})

export const chooseColorAction: GameAction<'chooseColor'> = (context, event) => ({
    players: context.players.map(p => (p.id === event.playerId) ? { ...p, color: (event.color === p.color) ? undefined : event.color } : p)
})

export const dropTokenAction: GameAction<'dropToken'> = ({ grid, players }, { x, playerId }) => {
    const playerColor = players.find(p => playerId === p.id)!.color!;
    const y = freePositionY(grid, x);
    const newGrid = grid.map((row, ydx) => row.map((v, xdx) => x === xdx && y === ydx ? playerColor : v));
    return { grid: newGrid };
};

export const switchPlayerAction = (context: GameContext) => ({
    currentPlayer: context.players.find(p => p.id !== context.currentPlayer)!.id
})

export const saveWiningAction: GameAction<'dropToken'> = (context, event) => ({
    winingPositions: winingPositions(
        context.grid,
        currentPlayer(context).color!,
        event.x,
        context.winLength
    )
})

export const restartAction: GameAction<'restart'> = (context) => ({
    winingPositions: [],
    grid: GameModel.initialContext.grid,
    currentPlayer: null
})

export const setCurrentPlayerAction = (context: GameContext) => ({
    currentPlayer: context.players.find(p => p.color === PlayerColor.YELLOW)!.id
})