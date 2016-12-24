import React from 'react'
import { Layer, Stage} from 'react-konva'
import Cell from "./Cell"

const GamePage = (props) => {
  return (
    <div>
      <Stage width={700} height={700}>
        <Layer>
          <Cell x={50} y={10} owner={1} force={10} type={"land"}/>
        </Layer>
      </Stage>
    </div>
  )
}

export default GamePage
