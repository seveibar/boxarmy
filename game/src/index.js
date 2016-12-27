/** @flow */

import { range } from 'range';

import type { InitParams, GameState, Move } from './types.flow';

export default class Game {

  state: GameState;

  constructor(initialState: GameState) {
    this.state = initialState;
  }

  init(initObject: InitParams) {

    const { size, players } = initObject;

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

  }

  tick() {
    this.state.ticks += 1;
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
