/**
 * Test which covers auxiliary functionality.
 *
 * @module test/integrational/utils
 */

'use strict';

const ethRpc = require('../../lib/eth-json-rpc');

const contract = require('../resources/testContract');

describe('eth', () => {
    const ZERO_ADDRESS    = '0x0000000000000000000000000000000000000000';
    const INVALID_ADDRESS = '0x0ccaf8cb1c92aef64dd36ce1f3882d195180ad5'; // Invalid length.
    const VALID_ADDRESS   = '0x0ccaf8cb1c92aef64dd36ce1f3882d195180ad5c';

    it('address is zero', () => {
        ethRpc.utils.isZeroAddress(ZERO_ADDRESS).should.be.true;
    });

    it('address is not zero', () => {
        ethRpc.utils.isZeroAddress(VALID_ADDRESS).should.be.false;
    });

    it('address is invalid', () => {
        ethRpc.utils.isValidAddress(INVALID_ADDRESS).should.be.false;
    });

    it('address is valid', () => {
        ethRpc.utils.isValidAddress(VALID_ADDRESS).should.be.true;
    });

    it('get method output parameters', () => {
        const params = ethRpc.utils.getMethodOutputParameters(contract.abi, 'totalSupply');

        params.should.be.deep.equal(['uint256']);
    });

    it('decode raw output', () => {
        const data = 'fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe';

        const output = ethRpc.utils.decodeRawOutput(['int32'], data);

        output.should.be.deep.equal(['-2']);
    });
});
