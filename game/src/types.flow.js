// @flow

export type InitParams = {
  size: {x: number, y:number},
  type: string,
  players: Array<{ name: string, start: { x: number, y:number } }>
};

export type Move = {
  cell: {x: number, y: number},
  direction: "up"|"down"|"left"|"right"
};

export type Player = {
  name: string,
  moves: Array<Move>
};

export type Cell = {
  owner: number,
  force: number,
  type: "king"|"mountain"|"land"|"city"
};

export type CoordinateCell = {
  cell: Cell,
  x: number,
  y: number
}

export type GameState = {
  ticks: number,
  size: { x:number, y:number },
  players: Array<Player>,
  cells: Array<Array<Cell>>
};
