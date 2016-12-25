import React from 'react'
import { Layer, Stage, Group } from 'react-konva'
import Cell from './Cell'
import { connect } from 'react-redux'
import {
  mouseDown, mouseUp, mouseMove
} from '../../store/game/actions'

const GamePage = (props) => {
  const { dispatch } = props
  const { boardState, playerIndex, camera, mouse } = props.state
  const { cells, players } = boardState
  const myPlayer = players[playerIndex]

  // Collect all the information to render the cells
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
  const { innerWidth, innerHeight } = window
  return (
    <div
      onMouseDown={(e) => {
        dispatch(mouseDown(e.clientX, e.clientY))
      }}
      onMouseUp={(e) => {
        dispatch(mouseUp(e.clientX, e.clientY))
      }}
      onMouseMove={(e) => {
        if (mouse.down){
          dispatch(mouseMove(e.clientX, e.clientY))
        }
      }}
      >
      <Stage width={innerWidth} height={innerHeight}>
        <Layer>
          <Group
            x={camera.x + innerWidth / 2}
            y={camera.y + innerHeight / 2}
            offsetX={camera.x}
            offsetY={camera.y}
            scaleX={camera.scale.x}
            scaleY={camera.scale.y}>
            {
              renderCells.map((renderCell) => (
                <Cell {...renderCell} />
              ))
            }
          </Group>
        </Layer>
      </Stage>
    </div>
  )
}

export default connect(
  (state) => ({ state: state.game }),
  (dispatch) => ({ dispatch })
)(GamePage)
