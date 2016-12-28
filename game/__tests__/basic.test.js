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

    expect(game.getState().cells[0][1].owner).toBe(1);

  });

  it.skip('should allow a player to take another player', () => {
  });

});
