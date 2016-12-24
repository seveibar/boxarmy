'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isTag;
function isTag(target) /* : %checks */{
  return typeof target === 'string';
}
module.exports = exports['default'];