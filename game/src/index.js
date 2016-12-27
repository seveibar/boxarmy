// @flow

import { range } from 'range';

import type {
  InitParams, GameState, Move, Cell, CoordinateCell
} from './types.flow';

export default class Game {

  state: GameState;

  constructor(initialState: GameState) {
    this.state = initialState;
  }

  init(initObject: InitParams) {

    const { players, type } = initObject;

    const squareSize = Math.floor(Math.random() * 10) + 7;
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
      cells: range(0,size.y).map(row => range(0, size.x).map(col =>
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

  getCell({ cell: { x, y } }) : CoordinateCell {
    return {
      cell: this.state.cells[y][x], x, y
    };
  }

  getTargetCell({ cell: { x, y }, direction }) : CoordinateCell {
    const { size } = this.state;
    const dx = (direction === 'right' && 1 || 0) - (direction === 'left' && 1 || 0);
    const dy = (direction === 'down' && 1 || 0) - (direction === 'up' && 1 || 0);
    return this.getCell({
      cell: {
        x: Math.min(Math.max(x + dx, 0), size.x - 1),
        y: Math.min(Math.max(y + dy, 0), size.y - 1)
      }
    });
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

    // Increment all city cells every tick
    state.cells.forEach(row => row.forEach((cell) => {
      if (cell.owner !== 0 && cell.type === 'city') {
        if (cell.owner !== 0 || cell.force < 45) {
          cell.force += 1;
        }
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
    state.players.forEach((player, playerIndex) => {
      while (true) {
        if (player.moves.length === 0) break;
        const move = player.moves[0];
        player.moves = player.moves.slice(1);
        const fromCell = this.getCell(move);
        const toCell = this.getTargetCell(move);

        // Movement must not be to same cell (happens at borders)
        if (toCell.x === fromCell.x && toCell.y === fromCell.y) {
          continue;
        }

        // Player must own cell
        if (fromCell.cell.owner !== playerIndex) {
          continue;
        }

        if (toCell.cell.owner === playerIndex) {
          toCell.cell.force += fromCell.cell.force - 1;
          fromCell.cell.force = 1;
        } else {
          // Moving into enemy cell
          if (toCell.cell.force < fromCell.cell.force - 1) {
            toCell.cell.owner = fromCell.cell.owner;
            toCell.cell.force = (fromCell.cell.force - 1) - toCell.cell.force;
            fromCell.cell.force = 1;
          } else {
            toCell.cell.force = toCell.cell.force - (fromCell.cell.force - 1);
            fromCell.cell.force = 1;
          }
        }
        break;
      }
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
