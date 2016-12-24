/** @flow */

import Game from '../src';

describe('game mechanics', () => {

  let game;
  it('should start the game with a state', () => {
    game = new Game();

    game.init({
      sizex: 2,
      sizey: 2,
      players: 2,
      startingPositions: [
        [0,0], [1,1]
      ],
      obstacles: false
    });

    expect(game.getState()).toDeepEqual({
      players: [
        {
          moves: []
        },
        {
          moves: []
        },
        {
          moves: []
        }
      ],
      cells: [
        [
          { type: "king", owner: 1, force: 1 },
          { type: "land", owner: 0, force: 0 },
        ],
        [
          { type: "land", owner: 0, force: 0 },
          { type: "king", owner: 2, force: 1 },
        ]
      ]
    });
  });

  it('should increment cells', () => {

    game.increment("king");
    game.increment("king");

    expect(game.getState().cells).toDeepEqual([
      [
        { type: "king", owner: 1, force: 3 },
        { type: "land", owner: 0, force: 0 },
      ],
      [
        { type: "land", owner: 0, force: 0 },
        { type: "king", owner: 2, force: 3 },
      ]
    ]);
  })

  it('should allow the entry of moves into the game', () => {
    game.addMove({
      player: 1,
      move: {
        cellx: 0,
        celly: 0,
        direction: "right",
        portion: 1
      }
    });

    game.addMove({
      player: 1,
      move: {
        cellx: 1,
        celly: 0,
        direction: "down",
        portion: 1
      }
    });

    game.addMove({
      player: 2,
      move: {
        cellx: 1,
        celly: 1,
        direction: "right",
        portion: 1
      }
    });

    expect(game.getState().players).toDeepEqual([
      { moves: [] },
      { moves: [{
        cellx: 0,
        celly: 0,
        direction: "right",
        portion: 1
      }, {
        cellx: 1,
        celly: 0,
        direction: "down",
        portion: 1
      }]
      },
      { moves: [{
        cellx: 1,
        celly: 1,
        direction: "left",
        portion: 1
      }]
      },
    ]);
  });

  it('should move cells on a turn', () => {
    game.turn();

    expect(game.getState().players).toDeepEqual([
      { moves: [] },
      { moves: [{
        cellx: 1,
        celly: 0,
        direction: "down",
        portion: 1
      }]
      },
      { moves: [] },
    ]);

    expect(game.getState().cells).toDeepEqual([
      [
        { type: "king", owner: 1, force: 1 }, // r0,c0
        { type: "land", owner: 1, force: 1 }, // r0,c1
      ],
      [
        { type: "land", owner: 2, force: 1 }, // r1,c0
        { type: "king", owner: 2, force: 1 }, // r1,c1
      ]
    ]);
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
