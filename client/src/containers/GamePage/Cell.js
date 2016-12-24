import React from 'react'
import { Rect, Line, Group, Text } from 'react-konva'

const ownerColors = [
  '#9E9E9E',
  '#F44336',
  '#2196F3',
  '#4CAF50',
  '#FFC107',
  '#E91E63',
  '#9C27B0',
  '#FFEB3B',
  '#3F51B5'
]

export const Cell = (props) => {
  const { x, y, owner, force, type } = props
  return (
    <Group x={x} y={y}>
      <Rect
        x={0} y={0} fill={ownerColors[owner]}
        width={100} height={100}
        stroke={'black'}
        strokeWidth={3}
      />
      <Text
        x={0} y={32} text={force.toString()}
        width={100}
        shadowColor={'black'}
        shadowBlur={8}
        shadowOpacity={0.7}
        fontSize={32} fill={'#fff'} align={'center'}
      />
    </Group>
  )
}

export default Cell
