import React from 'react'
import { Layer, Stage} from 'react-konva'
import Cell from "./Cell"

const GamePage = (props) => {
  return (
    <div>
      <Stage width={700} height={700}>
        <Layer>
          <Cell x={50} y={10} owner={1} force={10} type={"king"} />
          <Cell x={200} y={10} owner={0} force={0} type={"mountain"} />
          <Cell x={350} y={10} owner={2} force={50} type={"land"} />
          <Cell x={500} y={10} owner={3} force={50} type={"city"} />
          <Cell x={50} y={160} owner={5} force={10} type={"king"} direction={"up"} />
          <Cell x={200} y={160} owner={4} force={20} type={"land"} direction={"left"} />
          <Cell x={350} y={160} owner={2} force={50} type={"land"} direction={"down"} />
          <Cell x={500} y={160} owner={3} force={50} type={"city"} direction={"right"} />
        </Layer>
      </Stage>
    </div>
  )
}

export default GamePage
