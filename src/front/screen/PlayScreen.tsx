import { currentPlayer } from "../../func/games";
import { GameInfo } from "../component/GameInfo";
import { useGame } from "../hooks/useGame";

type PlayScreenProps = {};

export function PlayScreen({ }: PlayScreenProps) {
    const { context } = useGame();
    const player = currentPlayer(context);

    return <div>
        <GameInfo color={player.color!} name={player.name} />
    </div>
}