import { Player, PlayerSession } from "../../types";
import { NameSelector } from "../component/NameSelector";
import { saveSession } from "../func/session";
import { useGame } from "../hooks/useGame";

type LoginScreenProps = {};

export function LoginScreen({ }: LoginScreenProps) {
    const joinGame = async (name: string) => {
        const response: PlayerSession = await fetch("/api/players", { method: 'POST' })
            .then(r => r.json());
        const player = saveSession({
            ...response,
            name
        });
    }

    return <div>
        <NameSelector onSelect={joinGame} />
    </div>
}