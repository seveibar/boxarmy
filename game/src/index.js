/** @flow */

import type { InitParams, GameState } from './types.flow';

export default class Game {

  state: GameState;

  constructor() {
    // this.
  }

  init(initObject: InitObject){

    const { size, players } = initObject;

    this.state = {
      players: [
        { name: 'neutral', moves: [] },
      ].concat(players.map(player => ({
        name: player.name,
        moves: []
      })))
    };
  }


  getState(): GameState {
    return this.state;
  }

}
