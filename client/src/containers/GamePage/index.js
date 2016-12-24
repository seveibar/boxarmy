import React from 'react'
import { Layer, Stage} from 'react-konva'
import Cell from './Cell'
import { connect } from 'react-redux'

const GamePage = (props) => {
  const { boardState, playerIndex } = props.state
  const { cells, players } = boardState
  const myPlayer = players[playerIndex]

  const renderCells = []
  for (let ri = 0; ri < cells.length; ri++) {
    for (let ci = 0; ci < cells.length; ci++) {
      const { owner, force, type } = cells[ri][ci]
      const moveUsingCell = myPlayer.moves.find((move) => {
        const { x, y } = move.cell
        return ri === y && ci === x
      })
      let direction
      if (moveUsingCell) {
        direction = moveUsingCell.direction
      }
      renderCells.push({
        x: ci * 100, y: ri * 100, owner, force, type, direction,
        key: [ci, ri].join(',')
      })
    }
  }

  return (
    <div>
      <Stage width={700} height={700}>
        <Layer scale={2}>
          {
            renderCells.map((renderCell) => (
              <Cell {...renderCell} />
            ))
          }
        </Layer>
      </Stage>
    </div>
  )
}

export default connect(
  (state) => ({ state: state.game }),
  (dispatch) => ({ dispatch })
)(GamePage)
