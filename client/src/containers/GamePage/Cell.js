import React from 'react'
import { Circle, Rect, Line, Group, Text } from 'react-konva'
import { KingElement, MountainElement, CityElement } from './elements'

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
  const { x, y, owner, force, type, direction, onClick, selected } = props

  let background
  switch (type) {
    case 'king':
      background = KingElement
      break
    case 'mountain':
      background = MountainElement
      break
    case 'city':
      background = CityElement
      break
  }

  let directionArrow
  if (direction) {
    let rotation
    switch (direction) {
      case 'up':
        rotation = -90
        break
      case 'down':
        rotation = 90
        break
      case 'left':
        rotation = 180
        break
      case 'right':
        rotation = 0
        break
    }
    directionArrow = (
      <Group x={50} y={50} rotation={rotation}>
        <Line
          points={[25, 0, 45, 0, 38, 8, 45, 0, 38, -8]}
          stroke={'#fff'}
          strokeWidth={4}
          lineCap={'round'}
          lineJoin={'round'}
          />
      </Group>
    )
  }

  return (
    <Group x={x} y={y}>
      <Rect
        x={0} y={0} fill={ownerColors[owner]}
        width={100} height={100}
        opacity={selected ? .75 : 1}
        onClick={() => onClick()}
        stroke={'black'}
        strokeWidth={3}
      />
      { background }
      { force > 0 ?
        <Text
          x={0} y={32} text={force.toString()}
          width={100}
          shadowColor={'black'}
          shadowBlur={8}
          onClick={() => onClick()}
          shadowOpacity={1}
          fontSize={32} fill={'#fff'} align={'center'}
        /> : null }
        { directionArrow }
    </Group>
  )
}

export default Cell
