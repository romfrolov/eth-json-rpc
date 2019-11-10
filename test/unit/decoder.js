/**
 * Test which covers the ABI decoding of contracts component.
 *
 * @module test/unit/decoder
 */

'use strict';

require('chai').should();

const Abi       = require('ethereumjs-abi');
const decoder   = require('../../lib/decoder');
const utils     = require('../../lib/helpers');
const generator = require('../helpers/generator');

/**
 * Encode original data and decode it.
 *
 * @param  {String[]} outputParameters
 * @param  {Object[]} originalData
 * @return {Object[]}
 */
function encodeAndDecode(outputParameters, originalData) {
    // encode using 3-rd party lib (we trust it by default)
    const rawOutput = Abi.rawEncode(outputParameters, originalData).toString('hex');
    // decode using our own lib (we don't trust it by default)
    return decoder.decodeRawOutput(outputParameters, rawOutput);
}

describe('Generation of method signatures', () => {
    it('id()', () => {
        utils.encodeTxData('id()', []).should.be.equal('0xaf640d0f');
    });

    it('getDAOById(bytes32)', () => {
        utils.encodeTxData('getDAOById(bytes32)', []).should.be.equal('0xaa22b56b');
    });

    it('getByUser(address)', () => {
        utils.encodeTxData('getByUser(address)', []).should.be.equal('0xd67bf379');
    });
});

describe('ABI decoding', () => {
    it('string', () => {
        const outputParameters = ['string'];
        const originalData = generator.generateByTypes(outputParameters);

        encodeAndDecode(outputParameters, originalData).should.be.deep.equal(originalData);
    });

    it('address', () => {
        const outputParameters = ['address'];
        const originalData = generator.generateByTypes(outputParameters);

        encodeAndDecode(outputParameters, originalData).should.be.deep.equal(originalData);
    });

    it('bool', () => {
        const outputParameters = ['bool'];
        const originalData = generator.generateByTypes(outputParameters);

        encodeAndDecode(outputParameters, originalData).should.be.deep.equal(originalData);
    });

    it('bytes', () => {
        for (let byteSize = 1; byteSize <= 32; byteSize++) {
            const outputParameters = [`bytes${byteSize}`];
            const originalData = generator.generateByTypes(outputParameters);

            encodeAndDecode(outputParameters, originalData).should.be.deep.equal(originalData);
        }
    });

    it('uints', () => {
        for (let bitSize = 8; bitSize <= 256; bitSize += 8) {
            const outputParameters = [`uint${bitSize}`];
            const originalData = generator.generateByTypes(outputParameters);

            encodeAndDecode(outputParameters, originalData).should.be.deep.equal(originalData);
        }
    });

    it('ints', () => {
        for (let bitSize = 8; bitSize <= 256; bitSize += 8) {
            const outputParameters = [`int${bitSize}`];
            const originalData = generator.generateByTypes(outputParameters);

            encodeAndDecode(outputParameters, originalData).should.be.deep.equal(originalData);
        }
    });

    it('array of bools', () => {
        const outputParameters = ['bool[]'];
        const originalData = generator.generateByTypes(outputParameters);

        encodeAndDecode(outputParameters, originalData).should.be.deep.equal(originalData);
    });

    it('array of bytes*', () => {
        for (let byteSize = 1; byteSize <= 32; byteSize++) {
            const outputParameters = [`bytes${byteSize}[]`];
            const originalData = generator.generateByTypes(outputParameters);

            encodeAndDecode(outputParameters, originalData).should.be.deep.equal(originalData);
        }
    });

    it('array of strings', () => {
        for (let byteSize = 1; byteSize <= 32; byteSize++) {
            const outputParameters = ['string[]'];
            const originalData = generator.generateByTypes(outputParameters);

            encodeAndDecode(outputParameters, originalData).should.be.deep.equal(originalData);
        }
    });

    it('array of addresses', () => {
        const outputParameters = ['address[]'];
        const originalData = generator.generateByTypes(outputParameters);

        encodeAndDecode(outputParameters, originalData).should.be.deep.equal(originalData);
    });

    it('array of uints', () => {
        for (let bitSize = 8; bitSize <= 256; bitSize += 8) {
            const outputParameters = [`uint${bitSize}[]`];
            const originalData = generator.generateByTypes(outputParameters);

            encodeAndDecode(outputParameters, originalData).should.be.deep.equal(originalData);
        }
    });

    it('array of ints', () => {
        for (let bitSize = 8; bitSize <= 256; bitSize += 8) {
            const outputParameters = [`int${bitSize}[]`];
            const originalData = generator.generateByTypes(outputParameters);

            encodeAndDecode(outputParameters, originalData).should.be.deep.equal(originalData);
        }
    });
});
