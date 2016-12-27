/** @flow */

import Game from '../src';

describe('game mechanics', () => {

  let game;
  it('should start the game with a state', () => {
    game = new Game();

    game.init({
      type: "FFA8",
      size: { x: 2, y: 2 },
      players: [
        {
          name: "player1",
          start: { x: 0,y: 0 }
        },
        {
          name: "player2",
          start: { x: 1,y: 1 }
        }
      ]
    });

    const initialState = game.getState();
    expect(initialState.players).toEqual([
      {
        name: 'neutral',
        moves: []
      },
      {
        name: 'player1',
        moves: []
      },
      {
        name: 'player2',
        moves: []
      }
    ]);

    expect(initialState.cells).toEqual([
      [
        { type: "king", owner: 1, force: 1 },
        { type: "land", owner: 0, force: 0 },
      ],
      [
        { type: "land", owner: 0, force: 0 },
        { type: "king", owner: 2, force: 1 },
      ]
    ]);

    expect(initialState.size).toBeDefined();
    expect(initialState.ticks).toBe(0);

  });

  it('should increment cells', () => {

    game.tick();

    expect(game.getState().cells[0][0].force).toBe(2);


  });

  it('should allow the entry of moves into the game', () => {
    game.addMove(1, {
      cell: { x: 0, y: 0 },
      direction: "right"
    });

    expect(game.getState().players[1].moves).toEqual([
      {
        cell: { x: 0, y: 0 },
        direction: "right"
      }
    ]);
  });

  it('should move cells on a turn', () => {
    game.tick();

    expect(game.getState().cells[1][0].owner).toBe(1);

  });

  it('should allow a player to take another player', () => {
    game.increment('land');
    game.turn();
    expect(game.getState().cells).toDeepEqual([
      [
        { type: "king", owner: 2, force: 1 }, // r0,c0
        { type: "land", owner: 2, force: 3 }, // r0,c1
      ],
      [
        { type: "land", owner: 2, force: 1 }, // r1,c0
        { type: "king", owner: 2, force: 1 }, // r1,c1
      ]
    ]);
  });

});
