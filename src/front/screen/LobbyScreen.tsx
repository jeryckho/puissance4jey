import { prevent } from "../../func/dom";
import { Player, PlayerColor } from "../../types";
import { ColorSelector } from "../component/ColorSelector";
import { NameSelector } from "../component/NameSelector";
import { useGame } from "../hooks/useGame";

type LobbyScreenProps = {};

export function LobbyScreen({ }: LobbyScreenProps) {
    const { send, can, context } = useGame();
    const colors = [PlayerColor.YELLOW, PlayerColor.RED];

    const chooseColor = (color: PlayerColor) => send({
        type: 'chooseColor',
        color,
        playerId: color === PlayerColor.YELLOW ? "Bob" : "Bill"
    })
    const startGame = () => send({
        type: 'start'
    });

    const canStart = can({
        type: 'start'
    });

    return <div>
        <ColorSelector players={context.players} colors={colors} onSelect={chooseColor} />
        <p>
            <button className="button" onClick={prevent(startGame)} disabled={!canStart}>Démarrer</button>
        </p>
    </div>
}