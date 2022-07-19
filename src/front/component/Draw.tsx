import { prevent } from "../../func/dom"

type DrawProps = {
    onRestart?: () => void
}

export function Draw({ onRestart }: DrawProps) {
    return <div className="flex" style={{ justifyContent: 'space-between' }}>
        <h2 className="flex" style={{ gap: '.5rem' }}>C'est une égalité ! </h2>
        <button onClick={prevent(onRestart)} className="button">Rejouer</button>
    </div>
}