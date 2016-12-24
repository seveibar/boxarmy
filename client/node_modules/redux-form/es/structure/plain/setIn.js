import _toPath from 'lodash-es/toPath';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var setInWithPath = function setInWithPath(state, value, first) {
  for (var _len = arguments.length, rest = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
    rest[_key - 3] = arguments[_key];
  }

  if (first === undefined) {
    return value;
  }
  var next = setInWithPath.apply(undefined, [state && state[first], value].concat(rest));
  if (!state) {
    var initialized = isNaN(first) ? {} : [];
    initialized[first] = next;
    return initialized;
  }
  if (Array.isArray(state)) {
    var copy = [].concat(_toConsumableArray(state));
    copy[first] = next;
    return copy;
  }
  return _extends({}, state, _defineProperty({}, first, next));
};

var setIn = function setIn(state, field, value) {
  return setInWithPath.apply(undefined, [state, value].concat(_toConsumableArray(_toPath(field))));
};

export default setIn;