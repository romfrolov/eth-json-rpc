/**
 * Generator which can create blocks and events.
 *
 * @module test/helpers/generator
 */

'use strict';

const chance = require('chance')();
const BI     = require('big-integer');

exports.generateByType  = generateByType;
exports.generateByTypes = generateByTypes;

/**
 * Generate hexadecimal string.
 *
 * @param  {Number} len Length of string to generate.
 * @return {String}     Generated output.
 */
function generateHex(len) {
    return '0x' + chance.string({ length: len, pool: '0123456789abcdef' });
}

/**
 * Generate uint.
 *
 * @param  {Number} bitSize
 * @param  {Number} min
 * @param  {Number} max
 * @return {String}         Generated output.
 */
function generateUint(bitSize, min=0, max=2 ** bitSize - 1) {
    return BI(chance.integer({ min, max })).toString(10);
}

/**
 * Generate int.
 *
 * @param  {Number} bitSize
 * @param  {Number} min
 * @param  {Number} max
 * @return {String}         Generated output.
 */
function generateInt(bitSize, min=(-1) * 2 ** (bitSize / 2) + 1, max=2 ** (bitSize / 2) - 1) {
    return BI(chance.integer({ min, max })).toString(10);
}

function generateString(max=64) {
    return chance.string({ length: max });
}

/**
 * Generate value by type of the variable.
 *
 * @param  {String} type Name of Solidity type.
 * @param  {Number} min  Minimal length of the generated output.
 * @param  {Number} max  Maximal length of the generated output.
 * @return {String}      Random generated value of the specified type.
 */
function generateByType(type, min, max) {
    let output = [];

    switch (true) {
        case (/^bool$/).test(type): {
            output = !!Math.round(Math.random());
            break;
        }
        case (/^bytes.(.*[0-9]){0,2}$/).test(type): {
            const byteSize = (/\d+/).exec(type);

            output = generateHex(byteSize * 2);
            break;
        }
        case (/^string$/).test(type): {
            output = generateString(max);
            break;
        }
        case (/^address$/).test(type): {
            output = generateHex(40);
            break;
        }
        case (/^u?int(.*[0-9]){0,3}$/).test(type): {
            const bitSize = (/\d+/).exec(type);

            output = type.includes('u') ? generateUint(bitSize, min, max) : generateInt(bitSize, min, max);
            break;
        }
        // arrays
        case (/^bool\[]$/).test(type): {
            const len = chance.integer({ min: 1, max: 20 });

            for (let i = 0; i < len; i++) {
                output.push(!!Math.round(Math.random()));
            }
            break;
        }
        case (/^bytes.(.*[0-9]){0,2}\[]$/).test(type): {
            const byteSize = (/\d+/).exec(type);
            const len = chance.integer({ min: 1, max: 20 });

            for (let i = 0; i < len; i++) {
                output.push(generateHex(byteSize * 2));
            }
            break;
        }
        case (/^string\[]$/).test(type): {
            const len = chance.integer({ min: 1, max: 20 });

            for (let i = 0; i < len; i++) {
                output.push(generateString(max));
            }
            break;
        }
        case (/^address\[]$/).test(type): {
            const len = chance.integer({ min: 1, max: 20 });

            for (let i = 0; i < len; i++) {
                output.push(generateHex(40));
            }
            break;
        }
        case (/^u?int(.*[0-9]){0,3}\[]$/).test(type): {
            const bitSize = (/\d+/).exec(type);
            const len = chance.integer({ min: 1, max: 20 });

            if (type.includes('u')) {
                for (let i = 0; i < len; i++) {
                    output.push(generateUint(bitSize, min, max));
                }
            } else {
                for (let i = 0; i < len; i++) {
                    output.push(generateInt(bitSize, min, max));
                }
            }
            break;
        }
    }

    return output;
}

/**
 * Generate values by types of the variables.
 *
 * @param  {String[]} type Names of Solidity type.
 * @return {String[]}      Random generated values of the specified types.
 */
function generateByTypes(types) {
    return types.map(type => generateByType(type));
}
