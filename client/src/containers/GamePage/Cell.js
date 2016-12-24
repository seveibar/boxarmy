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
              28, 64, 22, 45, 25, 43, 36, 49,
              48, 30, 52, 30, 63, 49, 74, 42,
              78, 45, 72, 64, 27, 64, 27, 73,
              72, 73, 72, 64
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
    case 'mountain':
      background = (
        <Group opacity={0.75}>
          <Line
            points={[
              67, 53, 65, 50, 62, 48, 60, 45,
              58, 43, 55, 40, 53, 37, 51, 34,
              49, 32, 46, 31, 43, 29, 40, 28,
              37, 26, 35, 25, 32, 25, 30, 28,
              28, 31, 26, 34, 24, 38, 22, 41,
              20, 44, 18, 47, 16, 50, 14, 54,
              13, 58, 12, 62, 10, 66, 10, 70
            ]}
            stroke={'#000'}
            strokeWidth={4}
            lineCap={'round'}
            lineJoin={'round'}
          />
          <Line
            points={[
              46, 72, 48, 69, 50, 66, 52, 63,
              54, 60, 57, 58, 60, 58, 62, 57,
              65, 55, 68, 53, 70, 51, 73, 50,
              76, 52, 78, 54, 81, 55, 83, 57,
              86, 60, 88, 63, 90, 66, 90, 71,
              90, 75
            ]}
            stroke={'#000'}
            strokeWidth={4}
            lineCap={'round'}
            lineJoin={'round'}
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
      { force > 0 ?
        <Text
          x={0} y={32} text={force.toString()}
          width={100}
          shadowColor={'black'}
          shadowBlur={8}
          shadowOpacity={1}
          fontSize={32} fill={'#fff'} align={'center'}
        /> : null }
    </Group>
  )
}

export default Cell
