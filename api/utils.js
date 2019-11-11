/**
 * utils api.
 *
 * @module api/utils
 */

'use strict';

const BI      = require('big-integer');
const utils   = require('../lib/helpers');
const decoder = require('../lib/decoder');

/**
 * Default Ethereum address length (2 chars for prefix + 40 characters for 20 bytes).
 *
 * @type {Number}
 */
const ADDRESS_LENGTH = 42;

exports.isZeroAddress  = isZeroAddress;
exports.isValidAddress = isValidAddress;

/**
 * Check whether address is zero or not.
 *
 * @param  {String}  address Ethereum address.
 * @return {Boolean}         Whether address is zero.
 */
function isZeroAddress(address) {
    return BI(address.slice(2), 16).isZero();
}

/**
 * Validate address.
 *
 * @param  {String}  address Ethereum address.
 * @return {Boolean}         Whether address is valid.
 */
function isValidAddress(address) {
    return address
        && address.length === ADDRESS_LENGTH
        && utils.isHex(address)
        && !isZeroAddress(address);
}

/**
 * Get method output parameter types from contract ABI.
 *
 * @param  {Object[]} contractAbi Contract ABI.
 * @param  {String}   method      Method name.
 * @return {String[]}
 */
exports.getMethodOutputParameters = function (contractAbi, method) {
    return [...getMethodOutputParameters(contractAbi, method)];
};

/**
 * Decode raw data returned from the contract call.
 *
 * @param  {String[]}    types     Parameter types.
 * @param  {String}      rawOutput Raw output data.
 * @return {String|Bool}
 */
exports.decodeRawOutput = function decodeRawOutput(types, rawOutput) {
    return decoder.decodeRawOutput(types, rawOutput);
};

/**
 * Get method output types of parameters.
 *
 * @generator
 * @param  {Object[]} contractAbi
 * @param  {String}   method
 * @yields {String}               Types as array of strings.
 */
function* getMethodOutputParameters(contractAbi, method) {
    for (let {name, outputs} of contractAbi) {
        if (name === method.split('(')[0]) {
            yield* outputs.map((output) => output.type);
        }
    }
}
