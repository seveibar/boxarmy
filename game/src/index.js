// @flow

import { range } from 'range';

import type { InitParams, GameState, Move } from './types.flow';

export default class Game {

  state: GameState;

  constructor(initialState: GameState) {
    this.state = initialState;
  }

  init(initObject: InitParams) {

    const { players, type } = initObject;

    const squareSize = Math.floor(Math.random() * 10);
    const size = initObject.size || {
      x: squareSize,
      y: squareSize
    };

    this.state = {
      ticks: 0,
      size,
      players: [
        { name: 'neutral', moves: [] },
      ].concat(players.map(player => ({
        name: player.name,
        moves: []
      }))),
      cells: range(0,size.x).map(row => range(0, size.y).map(col =>
        ({ type: 'land', owner: 0, force: 0 })))
    };

    // Update cells where the player starts with the king
    players.forEach((player, index) => {
      const start = player.start || {
        x: Math.floor(Math.random() * size.x),
        y: Math.floor(Math.random() * size.y),
      };
      this.state.cells[start.x][start.y] = {
        type: 'king',
        owner: index + 1,
        force: 1
      };
    });
  }

  getCell(x:number, y:number) {
    return this.state.cells[x][y]
  }

  tick() {
    const { state } = this;
    state.ticks += 1;

    // Increment all king cells every tick
    state.cells.forEach(row => row.forEach((cell) => {
      if (cell.owner !== 0 && cell.type === 'king') {
        cell.force += 1;
      }
    }));

    // Increment all land cells every 30 seconds (60 ticks)
    if (state.ticks % 60 === 0) {
      state.cells.forEach(row => row.forEach((cell) => {
        if (cell.owner !== 0 && cell.type === 'land') {
          cell.force += 1;
        }
      }));
    }

    // Move players, each player gets to execute one possible move
    state.players.slice(1).forEach((player) => {
      const move = player.moves[0]
      const fromCell = { x:
    });

  }

  addMove(playerIndex: number, move: Move) {
    this.state.players[playerIndex].moves.push(move);
  }

  clearMoves(playerIndex: number) {
    this.state.players[playerIndex].moves = [];
  }

  getState(): GameState {
    return this.state;
  }

}
