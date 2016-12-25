// @flow

export type InitParams = {
  size: {x: number, y:number}
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

export type GameState = {
  players: Array<Player>,
  cells: Array<Array<Cell>>
};
