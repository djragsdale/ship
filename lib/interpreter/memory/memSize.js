const typeKeywords = require('../../constants/typeKeywords');
const types = require('../../constants/types');

const byteSize = 8;

// In bits
const sizes = {
  [typeKeywords[types.Boolean]]: 1,
  [typeKeywords[types.Character]]: 4 * byteSize, // utf-8
  [typeKeywords[types.Float]]: 4 * byteSize,
  [typeKeywords[types.String]]: 1024 * 4 * byteSize, // 1024 characters
};

module.exports = sizes;
