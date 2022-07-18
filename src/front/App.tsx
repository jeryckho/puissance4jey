import { PlayerColor } from "../types"
import { ColorSelector } from "./component/ColorSelector"
import { Grid } from "./component/Grid"
import { NameSelector } from "./component/NameSelector"
import { GameInfo } from "./component/GameInfo"
import { Victory } from "./component/Victory"

function App() {

  return (
    <div className="container">
      <NameSelector onSelect={() => null} />
      <hr />
      <ColorSelector onSelect={() => null} players={[
        { id: '1', name: 'Bob', color: PlayerColor.RED },
        { id: '2', name: 'Bill', color: PlayerColor.YELLOW }
      ]} colors={[PlayerColor.YELLOW, PlayerColor.RED]} />
      <hr />
      <GameInfo name="Bob" color={PlayerColor.RED} />
      <Victory name="Bob" color={PlayerColor.RED}/>
      <Grid color={PlayerColor.RED} onDrop={() => null} grid={[
        ["E", "E", "E", "E", "E", "E", "R"],
        ["E", "E", "E", "E", "E", "R", "Y"],
        ["E", "E", "E", "E", "E", "R", "R"],
        ["E", "E", "E", "E", "E", "R", "Y"],
        ["E", "E", "E", "E", "E", "Y", "R"],
        ["E", "E", "E", "E", "E", "Y", "Y"]
      ]} />
    </div>
  )
}

export default App
