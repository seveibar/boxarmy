/** @flow */

import { range } from 'range';

import type { InitParams, GameState } from './types.flow';

export default class Game {

  state: GameState;

  init(initObject: InitParams) {

    const { size, players } = initObject;

    this.state = {
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


  getState(): GameState {
    return this.state;
  }

}
