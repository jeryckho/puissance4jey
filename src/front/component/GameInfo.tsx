import { discColorClass } from "../../func/color";
import { Player, PlayerColor } from "../../types";

type GameInfoProps = {
    color: PlayerColor,
    name: Player['name']
}

export function GameInfo({ color, name }: GameInfoProps) {
    return <div>
        <h2 className="flex" style={{ gap: '.5rem' }}>Au tour de {name} <div className={discColorClass(color)}></div> de jouer </h2>
    </div>;
}
