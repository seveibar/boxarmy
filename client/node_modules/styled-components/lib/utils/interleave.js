'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

// eslint-disable-next-line max-len
exports.default = function (strings, interpolations) {
  return interpolations.reduce(function (array, interp, i) {
    return array.concat(interp, strings[i + 1]);
  }, [strings[0]]);
};

module.exports = exports['default'];