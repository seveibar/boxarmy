import React from 'react'
import { Circle, Rect, Line, Group, Text } from 'react-konva'

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

  let background
  switch (type) {
    case 'king':
      background = (
        <Group opacity={0.75}>
          <Line
            points={[
              27.652926, 64.4567, 22.475894, 44.6325, 25.253814,
              42.6122, 36.365492, 48.5468, 47.855977, 29.85902,
              51.644049, 29.98528, 63.134534, 48.7994, 73.867405,
              42.4859, 77.529208, 45.0113, 72.099638, 64.4567,
              26.769042, 63.9517, 26.895312, 72.6642, 72.225907,
              72.6642, 72.0113, 64.099638
            ]}
            stroke={'#000'}
            strokeWidth={4}
            lineCap={'round'}
            lineJoin={'round'}
            />
          <Circle
            radius={5}
            stroke={'#000'}
            strokeWidth={4}
            x={20}
            y={40}
            />
          <Circle
            radius={5}
            stroke={'#000'}
            strokeWidth={4}
            x={50}
            y={25}
            />
          <Circle
            radius={5}
            stroke={'#000'}
            strokeWidth={4}
            x={80}
            y={40}
            />
        </Group>
      )
      break
  }

  return (
    <Group x={x} y={y}>
      <Rect
        x={0} y={0} fill={ownerColors[owner]}
        width={100} height={100}
        stroke={'black'}
        strokeWidth={3}
      />
      { background }
      <Text
        x={0} y={32} text={force.toString()}
        width={100}
        shadowColor={'black'}
        shadowBlur={8}
        shadowOpacity={1}
        fontSize={32} fill={'#fff'} align={'center'}
      />
    </Group>
  )
}

export default Cell
