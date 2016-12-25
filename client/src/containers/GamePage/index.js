import React from 'react'
import { Layer, Stage, Group, Rect } from 'react-konva'
import Cell from './Cell'
import { connect } from 'react-redux'
import {
  mouseDown, mouseUp, mouseMove, scroll, cellSelected,
  moveSelectedCell, clearMoves
} from '../../store/game/actions'

const GamePage = (props) => {
  const { dispatch } = props
  const { boardState, playerIndex, camera, mouse, selectedCell } = props.state
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
      const selected = selectedCell && (selectedCell.ci == ci && selectedCell.ri == ri)
      let direction
      if (moveUsingCell) {
        direction = moveUsingCell.direction
      }
      renderCells.push({
        x: ci * 100, y: ri * 100, owner, force, type, direction,
        ri, ci, selected, key: [ci, ri].join(',')
      })
    }
  }

  // TODO this is a hacky fix b/c onKeyDown on the div didn't work
  window.removeEventListener('keydown', window.keyEvent)
  window.keyEvent = (e) => {
    switch (e.keyCode) {
      case 68: // d
      case 39: // right-arrow
        dispatch(moveSelectedCell('right'))
        break
      case 87: // w
      case 38: // up-arrow
        dispatch(moveSelectedCell('up'))
        break
      case 65: // a
      case 37: // left-arrow
        dispatch(moveSelectedCell('left'))
        break
      case 83: // s
      case 40: // down-arrow
        dispatch(moveSelectedCell('down'))
        break
      case 81:
        dispatch(clearMoves())
        break
      default:
        return
    }
  }
  window.addEventListener('keydown', window.keyEvent)

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
        if (mouse.down) {
          dispatch(mouseMove(e.clientX, e.clientY))
        }
      }}
      onWheel={(e) => {
        dispatch(scroll(e.deltaY / -200))
      }}
      >
      <Stage width={innerWidth} height={innerHeight}>
        <Layer>
          <Group
            x={-1 * camera.x * camera.scale.x + innerWidth / 2}
            y={-1 * camera.y * camera.scale.y + innerHeight / 2}
            offsetX={camera.x}
            offsetY={camera.y}
            scaleX={camera.scale.x}
            scaleY={camera.scale.y}>
            {
            renderCells.map((renderCell) => (
              <Cell
                onClick={() => {
                  dispatch(cellSelected(renderCell.ri, renderCell.ci))
                }}
                {...renderCell}
              />
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
