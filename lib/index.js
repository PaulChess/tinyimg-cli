const tinyimg = module.exports = {};

tinyimg.log = require('./log');

Object.defineProperty(global, 'tinyimg', {
  enumerable: true,
  writable: false,
  value: tinyimg
});