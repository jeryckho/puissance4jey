import { GameContext, GridState, Player, PlayerColor } from "../types";

export function freePositionY(grid: GridState, x: number): number {
    for (let y = grid.length - 1; y >= 0; y--) {
        if (grid[y][x] === 'E') {
            return y;
        }
    }
    return -1;
}

export function winingPositions(grid: GridState, color: PlayerColor, x: number, size: number) {
    const directions = [
        [1, 0],
        [0, 1],
        [1, 1],
        [1, -1]
    ];
    const initialPosition = {
        y: freePositionY(grid, x),
        x: x
    };
    for (let direction of directions) {
        let items = [initialPosition];
        for (let forward of [1, -1]) {
            for (let i = 1; i < size; i++) {
                const x = initialPosition.x + (i * direction[0] * forward);
                const y = initialPosition.y + (i * direction[1] * forward);
                if (grid?.[y]?.[x] !== color) {
                    break;
                }
                items.push({ x, y });
            }
            if (items.length >= size) {
                return items;
            }
        }
    }
    return [];
}

export function currentPlayer(context: GameContext): Player {
    const player = context.players.find(p => p.id === context.currentPlayer);
    if (player === undefined) {
        throw new Error("Cant find current player");
    }
    return player;
}

export function countEmptyCells(grid: GridState): number {
    let count = 0;
    for (const row of grid) {
        for (const cell of row) {
            if (cell === "E") count++;
        }
    }
    return count;

}