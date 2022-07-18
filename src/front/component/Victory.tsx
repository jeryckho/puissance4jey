import { discColorClass } from "../../func/color"
import { prevent } from "../../func/dom"
import { Player, PlayerColor } from "../../types"


type VictoryProps = {
    color: PlayerColor,
    name: Player['name'],
    onRestart?: () => void
}

export function Victory ({color, name, onRestart}: VictoryProps) {
    return <div className="flex" style={{justifyContent: 'space-between'}}>
        <h2 className="flex" style={{gap: '.5rem'}}>Bravo, victoire de {name} <div className={discColorClass(color)}></div> ! </h2>
        <button onClick={prevent(onRestart)} className="button">Rejouer</button>
    </div>
}