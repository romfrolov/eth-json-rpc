/**
 * ABI decoding.
 * @see https://solidity.readthedocs.io/en/v0.4.25/abi-spec.html
 *
 * @module lib/decoder
 */

'use strict';

const BI = require('big-integer');

exports.decodeRawOutput = decodeRawOutput;
exports.decodeInt       = decodeInt;
exports.decodeUint      = decodeUint;
exports.decodeAddress   = decodeAddress;
exports.decodeBool      = decodeBool;
exports.decodeString    = decodeString;

const digitRegExp      = /\d+/;
const bytesRegExp      = /^bytes.(.*[0-9]){0,2}$/;
const uintRegExp       = /^uint(.*[0-9]){0,3}$/;
const intRegExp        = /^int(.*[0-9]){0,3}$/;
const bytesArrayRegExp = /^bytes.(.*[0-9]){0,2}\[]$/;
const uintArrayRegExp  = /^uint(.*[0-9]){0,3}\[]$/;
const intArrayRegExp   = /^int(.*[0-9]){0,3}\[]$/;

/**
 * Decode raw call output.
 *
 * @param  {String[]} types     Array of output parameters types.
 * @param  {String}   rawOutput Hexadecimal string of encoded RPC response result.
 * @return {String[]}           Decoded output arguments.
 */
function decodeRawOutput(types, rawOutput) {
    let result = [];

    for (let type of types) {
        switch (true) {
            case bytesRegExp.test(type): {
                const len   = digitRegExp.exec(types);
                const bytes = '0x' + rawOutput.slice(0, len * 2);
                rawOutput   = rawOutput.slice(64);
                result.push(bytes);
                break;
            }
            case type === 'bytes': {
                const iOfStart = 128;
                const len      = parseInt(rawOutput.slice(64, iOfStart));
                const iOfEnd   = 128 + len * 2;
                const bytes    = rawOutput.slice(iOfStart, iOfEnd);
                rawOutput      = rawOutput.slice(Math.ceil(iOfEnd / 64) * 64);
                result.push(bytes);
                break;
            }
            case type === 'string': {
                const iOfStart = 128;
                const len      = parseInt(rawOutput.slice(64, iOfStart), 16);
                const iOfEnd   = 128 + len * 2;
                const string   = decodeString(rawOutput.slice(iOfStart, iOfEnd));
                rawOutput = rawOutput.slice(Math.ceil(iOfEnd / 64) * 64);
                result.push(string);
                break;
            }
            case type === 'address': {
                result.push(decodeAddress(rawOutput.slice(0, 64)));
                rawOutput = rawOutput.slice(64);
                break;
            }
            case type === 'bool': {
                result.push(decodeBool(rawOutput.slice(0, 64)));
                rawOutput = rawOutput.slice(64);
                break;
            }
            case uintRegExp.test(type): {
                result.push(decodeUint(rawOutput.slice(0, 64)));
                rawOutput = rawOutput.slice(64);
                break;
            }
            case intRegExp.test(type): {
                result.push(decodeInt(rawOutput.slice(0, 64)));
                rawOutput = rawOutput.slice(64);
                break;
            }
            // arrays
            case type === 'bool[]': {
                const iOfStart = 128;
                const len      = parseInt(rawOutput.slice(64, iOfStart), 16);
                const iOfEnd   = 128 + len * 64;
                const bools    = rawOutput.slice(iOfStart, iOfEnd).match(/.{1,64}/g).map(bytes32 => decodeBool(bytes32));
                rawOutput      = rawOutput.slice(iOfEnd);
                result.push(bools);
                break;
            }
            case bytesArrayRegExp.test(type): {
                const byteSize = digitRegExp.exec(type);
                const iOfStart = 128;
                const len      = parseInt(rawOutput.slice(64, iOfStart), 16);
                const iOfEnd   = iOfStart + len * 64;
                const bytes    = rawOutput.slice(iOfStart, iOfEnd).match(/.{1,64}/g).map(bytes32 => '0x' + bytes32.slice(0, byteSize * 2));
                rawOutput      = rawOutput.slice(iOfEnd);
                result.push(bytes);
                break;
            }
            case type === 'string[]': {
                let arrayLen   = parseInt(rawOutput.slice(64, 128), 16);
                const iOfStart = 128;

                let len;
                let strings = [];
                let i = iOfStart;

                while (arrayLen-- > 0) {
                    len    = parseInt(rawOutput.slice(i, i + 64), 16);
                    strings.push(decodeString(rawOutput.slice(i + 64, i + 64 + len * 2)));

                    i += 64 + Math.ceil(len * 2 / 64) * 64;
                }

                rawOutput = rawOutput.slice(i);
                result.push(strings);
                break;
            }
            case type === 'address[]': {
                const iOfStart  = 128;
                const len       = parseInt(rawOutput.slice(64, iOfStart), 16);
                const iOfEnd    = 128 + len * 64;
                const addresses = rawOutput.slice(iOfStart, iOfEnd).match(/.{1,64}/g).map(bytes32 => decodeAddress(bytes32));
                rawOutput       = rawOutput.slice(iOfEnd);
                result.push(addresses);
                break;
            }
            case uintArrayRegExp.test(type): {
                const iOfStart = 128;
                const len      = parseInt(rawOutput.slice(64, iOfStart), 16);
                const iOfEnd   = 128 + len * 64;
                const uints    = rawOutput.slice(iOfStart, iOfEnd).match(/.{1,64}/g).map(bytes32 => decodeUint(bytes32));
                rawOutput      = rawOutput.slice(iOfEnd);
                result.push(uints);
                break;
            }
            case intArrayRegExp.test(type): {
                const iOfStart = 128;
                const len      = parseInt(rawOutput.slice(64, iOfStart), 16);
                const iOfEnd   = 128 + len * 64;
                const ints     = rawOutput.slice(iOfStart, iOfEnd).match(/.{1,64}/g).map(bytes32 => decodeInt(bytes32));
                rawOutput      = rawOutput.slice(iOfEnd);
                result.push(ints);
                break;
            }
            default: {
                throw new Error('No case for parameter: ', type, '. Response: ', rawOutput, '.');
                // NOTE not supported types: bytes[]; mixed types with arrays e.g. (uint256[], address)
            }
        }
    }

    return result;
}

/**
 * Decode int from bytes32 hex string.
 *
 * @param  {String} bytes32
 * @return {String}         Normalized integer as a string.
 */
function decodeInt(bytes32) {
    const int = BI(bytes32, 16);
    switch (true) {
        case int > 2 ** 128 - 1: {
            const mask = BI('f'.repeat(64), 16);
            return int.xor(mask).plus(1).multiply(-1).toString(10);
        }
        case int <= 2 ** 128 - 1: {
            return int.toString(10);
        }
    }
}

/**
 * Decode uint.
 *
 * @param  {String} bytes32
 * @return {String}
 */
function decodeUint(bytes32) {
    return BI(bytes32, 16).toString(10);
}

/**
 * Decode address.
 *
 * @param  {String} bytes32
 * @return {String}
 */
function decodeAddress(bytes32) {
    return '0x' + bytes32.slice(24);
}

/**
 * Decode boolean.
 *
 * @param  {String}  bytes32
 * @return {Boolean}
 */
function decodeBool(bytes32) {
    return !!parseInt(bytes32, 16);
}

/**
 * Decode string.
 *
 * @param  {String} bytes
 * @return {String}
 */
function decodeString(bytes) {
    return Buffer.from(bytes, 'hex').toString('utf8');
}
