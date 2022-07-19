import { currentPlayer } from "../func/games";
import { GameStates } from "../types"
import { Grid } from "./component/Grid";

import { useGame } from "./hooks/useGame"
import { DrawScreen } from "./screen/DrawScreen";
import { LobbyScreen } from "./screen/LobbyScreen"
import { PlayScreen } from "./screen/PlayScreen";
import { VictoryScreen } from "./screen/VictoryScreen";

function App() {

  const { state, context, send } = useGame();
  const canDrop = state === GameStates.PLAY;
  const player = canDrop
    ? currentPlayer(context)
    : undefined;
  const dropToken = canDrop
    ? (x: number) => { send({ type: 'dropToken', x: x }) }
    : undefined;

  return (
    <div className="container">
      {state === GameStates.LOBBY && <LobbyScreen />}
      {state === GameStates.PLAY && <PlayScreen />}
      {state === GameStates.VICTORY && <VictoryScreen />}
      {state === GameStates.DRAW && <DrawScreen />}
      <Grid winingPositions={context.winingPositions} grid={context.grid} onDrop={dropToken} color={player?.color} />
    </div>
  )
}

export default App
