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
      cells: Array(size.x).map((_,i) => {
        console.log(i);
        return i;
      })
    };
  }


  getState(): GameState {
    return this.state;
  }

}
