/**
 * Internal helpers.
 *
 * @module lib/helpers
 */

'use strict';

const ethereumAbi    = require('ethereumjs-abi');
const ethereumUtils  = require('ethereumjs-util');
const keccak256      = require('keccak256');

/**
 * Generate method signature and pack it with encoded data.
 *
 * @param  {String}   method Method ABI to get signature from.
 * @param  {Object[]} values Values to encode.
 * @return {String}          Hexadecimal tx data string with method signature and encoded values.
 */
exports.encodeTxData = function encodeTxData(method, values) {
    return values.length === 0
        && '0x' + keccak256(method).toString('hex').slice(0, 8)
        || '0x' + ethereumAbi.simpleEncode.apply(ethereumAbi, [method].concat(values)).toString('hex');
};

/**
 * Identify whether number format is hexadecimal.
 *
 * @param  {String}  str Number of type string.
 * @return {Boolean}     Whether string is in hexadecimal format.
 */
exports.isHex = function isHex(str) {
    const regexp = /^[0-9a-f]+$/;

    if (str.slice(0, 2) === '0x') {
        str = str.slice(2);
    }

    return regexp.test(str.toLowerCase());
};

/**
 * Private key to address with formatting.
 *
 * @param  {Buffer} privateKey
 * @return {String}            Address padded with 0x.
 */
exports.privateToAddress = function privateToAddress(privateKey) {
    return '0x' + ethereumUtils.privateToAddress(privateKey).toString('hex');
};
