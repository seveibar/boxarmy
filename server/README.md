[![Dev dependencies][dependencies-badge]][dependencies]
[![Node.js version][nodejs-badge]][nodejs]
[![NPM version][npm-badge]][npm]
[![Build Status][travis-badge]][travis-ci]

[![MIT License][license-badge]][LICENSE]
[![PRs Welcome][prs-badge]][prs]
[![Donate][donate-badge]][donate]

[![Watch on GitHub][github-watch-badge]][github-watch]
[![Star on GitHub][github-star-badge]][github-star]
[![Tweet][twitter-badge]][twitter]

# node-flowtype-boilerplate

Minimalistic boilerplate to jump-start a [Node.js][nodejs] project in ES6 with [Flow][flowtype] type checking.

Provides a basic template, batteries included:

+ ES6 + babel,
  + Removes Flow type annotations,
  + Transforms imports to lazy CommonJS requires,
  + Transforms async/await to generators,
+ [ESLint][eslint] with the [airbnb-base][airbnb-base], [flowtype][eslint-flowtype] and [async/await][eslint-async-await] rules, 
+ [Jest][jest] unit testing and coverage,
+ [Type definitions][flow-typed] for Jest,
+ [NPM scripts for common operations](#available-scripts),
+ [.editorconfig][editorconfig] for consistent file format,
+ [Yarn][yarn] lockfile so only verified and up-to-date dependencies are installed.

## Quick start

This project requires [Node.js][nodejs] 6.2 or later and [NPM][npm], [Yarn][yarn] is optional but recommended. Make sure you have those installed. Then just type following commands:

```
git clone https://github.com/jsynowiec/node-flowtype-boilerplate
cd node-flowtype-boilerplate
yarn || npm install
```

## Available scripts

Run using either `npm run <script>` or `yarn run <script>` comand.

+ `clean` - remove coverage data, Jest cache and transpiled files,
+ `lint` - lint source files and tests,
+ `typecheck` - check type annotations,
+ `test` - lint, typecheck and run tests with coverage,
+ `test-only` - run tests with coverage,
+ `test:watch` - interactive watch mode to automatically re-run tests, 
+ `build` - compile source files,
+ `build:watch` - interactive watch mode, compile sources on change.

## Alternative

As an alternative to Flow type checking, you can try my [Node.js TypeScript boilerplate][ts-boilerplate]. It's basically the same but with TypeScript and TSLint.

## License
MIT License. See the [LICENSE](https://github.com/jsynowiec/node-flowtype-boilerplate/blob/master/LICENSE) file.

[dependencies-badge]: https://david-dm.org/jsynowiec/node-flowtype-boilerplate/dev-status.svg?style=flat-square
[dependencies]: https://david-dm.org/jsynowiec/node-flowtype-boilerplate?type=dev
[nodejs-badge]: https://img.shields.io/badge/node->=%206.2.0-blue.svg?style=flat-square
[nodejs]: https://nodejs.org/dist/latest-v6.x/docs/api/
[npm-badge]: https://img.shields.io/badge/npm->=%203.8.9-blue.svg?style=flat-square
[npm]: https://docs.npmjs.com/
[travis-badge]: https://travis-ci.org/jsynowiec/node-flowtype-boilerplate.svg?branch=master
[travis-ci]: https://travis-ci.org/jsynowiec/node-flowtype-boilerplate
[license-badge]: https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square
[license]: https://github.com/jsynowiec/node-flowtype-boilerplate/blob/master/LICENSE
[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs]: http://makeapullrequest.com
[donate-badge]: https://img.shields.io/badge/$-support-green.svg?style=flat-square
[donate]: http://bit.ly/donate-js
[github-watch-badge]: https://img.shields.io/github/watchers/jsynowiec/node-flowtype-boilerplate.svg?style=social
[github-watch]: https://github.com/jsynowiec/node-flowtype-boilerplate/watchers
[github-star-badge]: https://img.shields.io/github/stars/jsynowiec/node-flowtype-boilerplate.svg?style=social
[github-star]: https://github.com/jsynowiec/node-flowtype-boilerplate/stargazers
[twitter]: https://twitter.com/intent/tweet?text=Check%20out%20this%20Node.js%20ES6+%20@flowtype%20boilerplate%20https://github.com/jsynowiec/node-flowtype-boilerplate%20%F0%9F%91%8D
[twitter-badge]: https://img.shields.io/twitter/url/https/jsynowiec/node-flowtype-boilerplate.svg?style=social
[jest]: https://facebook.github.io/jest/

[flowtype]: https://flowtype.org/
[eslint]: http://eslint.org/
[airbnb-base]: https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb-base
[eslint-flowtype]: https://www.npmjs.com/package/eslint-plugin-flowtype
[eslint-async-await]: https://github.com/zertosh/eslint-plugin-no-async-without-await
[yarn]: https://github.com/yarnpkg/yarn
[flow-typed]: https://github.com/flowtype/flow-typed
[editorconfig]: https://github.com/jsynowiec/node-flowtype-boilerplate/blob/master/.editorconfig

[ts-boilerplate]: https://github.com/jsynowiec/node-typescript-boilerplate
