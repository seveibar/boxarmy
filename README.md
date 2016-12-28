# Box Army

*Note: This is still a very early stage project*

Box Army is an addicting real-time strategy game that can be played in the brower. [Check it out at boxarmy.io!](http://boxarmy.io)

Box Army was hugely inspired by the massively popular [generals.io](http://generals.io) game.

## Why?

I wanted to experiment with some of the game settings of generals.io and maybe build an AI player, but the game isn't currently open source. Thus, boxarmy was created to allow for experimentation with various game mechanics and experiment with AI players.

As I created the project I experimented with a stateless server approach to increase horizontal scalability. Hopefully the flexibility of the architecture will also allow people to build some really cool extensions/alternate game modes.

When the game starts to stabilize I'll begin collecting game data and release a dataset so people can build AI for the game, we can then integrate the different AI into the engine.

## How to Run

We're using [yarn](https://yarnpkg.com/) here, but you can replace each command with it's [npm equivalent](https://yarnpkg.com/en/docs/migrating-from-npm) if you'd prefer.

```bash
git clone git@github.com:seveibar/boxarmy.git
cd boxarmy

# wow wouldn't it be great if a gulpfile did this...
cd client && yarn install && yarn build && cd ..
cd game && yarn install && yarn build && cd ..
cd server && yarn install && yarn build && cd ..

cd server
yarn start
```

Now visit `http://localhost:8080` in your browser.

Had a problem? [File an issue!](https://github.com/seveibar/boxarmy/issues/new) Others are probably having the same problem!

### Running in Production

TODO (we're not too worried about this right now)

To run in a production mode, you'll want to configure nginx to statically serve `/*` from `client/dist`. You'll then need to set the `NODE_ENV=production` and `REDIS_HOST=redis://yourredishost`. The server can be run with the same `yarn start` command.

## Architecture

This directory contains three distinct projects.

The `client` project is a react/redux client based off a modified version of [arc](https://github.com/diegohaz/arc). The client is just a static web client.

The `game` project is a node module that handles game logic and game state changes. This is where the fundamental game mechanics are. This directory was created using a modified [node-flowtype-boilerplate](https://github.com/jsynowiec/node-flowtype-boilerplate)

The `server` project runs the `/api` endpoints and in development serves the `client` directory and simulates a `redis` server. This directory was created using a modified [node-flowtype-boilerplate](https://github.com/jsynowiec/node-flowtype-boilerplate)

## Contributing

Feel free to tackle any of the posted [issues](https://github.com/seveibar/boxarmy/issues). If you'd like to add a feature or found a bug feel free to open an issue for discussion.

Generally speaking, if you're introducing a feature or mode you should throw in a couple tests, if you need any help with a feature just open a PR/issue and I can provide assistance.

## Testing

Each sub-project can be tested independently, just run `yarn test` in the appropriate directory. Tests are usually defined in `__tests__` but [jest](https://facebook.github.io/jest/) will look for any files that match `*.test.js`, so if appropriate they can reside in the same directory as the source files.

## Special Thanks

Thanks to my brother [@ibarnick](https://github.com/ibarnick) for recommending stateless servers and helping think out some of the server logistics.
