import { useEffect } from "react";
import { currentPlayer } from "../func/games";
import { GameStates, ServerErrors } from "../types"
import { Grid } from "./component/Grid";
import { getSession, logout } from "./func/session";

import { useGame } from "./hooks/useGame"
import { DrawScreen } from "./screen/DrawScreen";
import { LobbyScreen } from "./screen/LobbyScreen"
import { LoginScreen } from "./screen/LoginScreen";
import { PlayScreen } from "./screen/PlayScreen";
import { VictoryScreen } from "./screen/VictoryScreen";

function App() {

  const { state, context, send, playerId } = useGame();
  const canDrop = state === GameStates.PLAY;
  const player = canDrop
    ? currentPlayer(context)
    : undefined;
  const dropToken = canDrop
    ? (x: number) => { send({ type: 'dropToken', x: x }) }
    : undefined;

  useEffect(() => {
    if (playerId) {
      const searchParams = new URLSearchParams({
        id: playerId,
        signature: getSession()!.signature!,
        name: getSession()!.name!,
        gameId: 'test'
      });
      const socket = new WebSocket(`${window.location.protocol.replace('http', 'ws')}//${window.location.host}/ws?${searchParams.toString()}`);
      socket.addEventListener('message', (event) => {
        const message = JSON.parse(event.data);
        if (message.type === 'error' && message.code === ServerErrors.AuthError) {
          logout();
        }
      })
    }
  }, [playerId])

  return (
    <div className="container">
      {!playerId ? <LoginScreen /> : <>
        Player: {playerId}
        {state === GameStates.LOBBY && <LobbyScreen />}
        {state === GameStates.PLAY && <PlayScreen />}
        {state === GameStates.VICTORY && <VictoryScreen />}
        {state === GameStates.DRAW && <DrawScreen />}
        <Grid winingPositions={context.winingPositions} grid={context.grid} onDrop={dropToken} color={player?.color} />
      </>}
    </div>
  )
}

export default App
