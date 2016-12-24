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
    case 'city':
      background = (<Group>
        <Line
          points={[
            20, 80, 20, 78, 20, 76, 20, 75, 20, 73, 20, 72, 20, 70, 20, 70, 21,
            70, 23, 70, 24, 70, 25, 70, 26, 70, 28, 70, 28, 68, 28, 67, 28, 65,
            28, 64, 28, 62, 28, 61, 28, 59, 28, 58, 28, 56, 28, 55, 28, 53, 28,
            52, 28, 50, 28, 49, 28, 47, 28, 46, 28, 44, 28, 43, 28, 41, 28, 40,
            28, 38, 28, 37, 28, 35, 28, 34, 28, 32, 28, 31, 28, 29, 28, 28, 28,
            26, 28, 25, 28, 23, 28, 22, 28, 20, 29, 20, 30, 20, 31, 20, 33, 20,
            34, 20, 35, 20, 37, 20, 37, 21, 37, 22, 37, 24, 37, 25, 37, 27, 37,
            28, 37, 30, 38, 30, 40, 30, 41, 30, 42, 30, 43, 30, 45, 30, 45, 28,
            45, 27, 45, 25, 45, 24, 45, 22, 45, 21, 45, 20, 47, 20, 48, 20, 49,
            20, 50, 20, 52, 20, 53, 20, 54, 20, 54, 22, 54, 23, 54, 25, 54, 26,
            54, 28, 54, 29, 55, 30, 56, 30, 57, 30, 59, 30, 60, 30, 61, 30, 62,
            29, 62, 28, 62, 26, 62, 25, 62, 23, 62, 22, 62, 20, 63, 20, 64, 20,
            66, 20, 67, 20, 68, 20, 69, 20, 71, 20, 71, 21, 71, 22, 71, 24, 71,
            25, 71, 27, 71, 28, 71, 30, 71, 31, 71, 33, 71, 34, 71, 36, 71, 37,
            71, 39, 71, 40, 71, 42, 71, 43, 71, 45, 71, 46, 71, 48, 71, 49, 71,
            51, 71, 52, 71, 54, 71, 55, 71, 57, 71, 58, 71, 60, 71, 62, 71, 63,
            71, 65, 71, 66, 71, 68, 71, 69, 72, 70, 73, 70, 74, 70, 76, 70, 77,
            70, 78, 70, 80, 70, 80, 71, 80, 73, 80, 74, 80, 76, 80, 77, 80, 79,
            79, 80, 78, 80, 76, 80, 75, 80, 74, 80, 72, 80, 71, 80, 70, 80, 69,
            80, 67, 80, 66, 80, 65, 80, 63, 80, 62, 80, 61, 80, 60, 80, 58, 80,
            57, 80, 56, 80, 54, 80, 53, 80, 52, 80, 51, 80, 49, 80, 48, 80, 47,
            80, 45, 80, 44, 80, 43, 80, 41, 80, 40, 80, 39, 80, 38, 80, 36, 80,
            35, 80, 34, 80, 32, 80, 31, 80, 30, 80, 29, 80, 27, 80, 26, 80, 25,
            80, 23, 80, 22, 80, 21, 80, 20, 80
          ]}
          stroke={'#000'}
          strokeWidth={4}
          lineCap={'round'}
          lineJoin={'round'}
          />
        <Line
          points={[
            34, 40, 44,40, 44, 50, 34,50, 34,40
          ]}
          stroke={'#000'}
          strokeWidth={4}
          lineCap={'round'}
          lineJoin={'round'}
          />
        <Line
          points={[
            54, 40, 64,40, 64, 50, 54,50, 54,40
          ]}
          stroke={'#000'}
          strokeWidth={4}
          lineCap={'round'}
          lineJoin={'round'}
          />
        <Line
          points={[
            40,80, 40,60, 60,60, 60,80
          ]}
          stroke={'#000'}
          strokeWidth={4}
          lineCap={'round'}
          lineJoin={'round'}
          />
      </Group>)
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
