/**
 * Test which covers communication with Ethereum RPC eth API.
 *
 * @module test/integrational/eth
 */

'use strict';

require('chai').should();

const ganache  = require('ganache-cli');
const contract = require('../resources/testContract');

/**
 * Test RPC port.
 *
 * @type {Number}
 */
const TEST_PORT = +process.env.TEST_PORT || 9545;

const ethRpc = require('../../lib/eth-json-rpc')(`http://localhost:${TEST_PORT}`);

/**
 * Test account private key.
 *
 * @type {String}
 */
const PRIVATE_KEY = 'da8e316c9e63e6725d93ebae25f923c567c4d7e9fbd2d1740a4e27d4a6094fab';

/**
 * Test RPC.
 *
 * @class
 */
function TestRpc() {
    if (!new.target) { return new TestRpc(); }
    this.server = ganache.server({accounts: [{balance: '1000000000000000000000000', secretKey: '0x' + PRIVATE_KEY}], locked: false});
    this.start = function start(port) { return Promise.resolve(this.server.listen(port)); };
    this.close = function close() { this.server.close(); };
}

describe('eth', () => {
    const server = TestRpc();

    let contractAddress;

    before('launch test RPC', async () => {
        await server.start(TEST_PORT);
    });

    it('[eth_blockNumber]', async () => {
        const blockNumber = await ethRpc.eth.blockNumber();

        blockNumber.should.be.equal(0);
    });

    it('[eth_getBlockByNumber]', async () => {
        const block = await ethRpc.eth.getBlock(0);

        block.transactionsRoot.should.be.equal('0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421');
    });

    it('[eth_getLogs]', async () => {
        const logs = await ethRpc.eth.getLogs(0, 0);

        logs.should.be.deep.equal([]);
    });

    it('[eth_gasPrice]', async () => {
        const gasPrice = await ethRpc.eth.gasPrice();

        gasPrice.should.be.equal('0x77359400');
    });

    it('[eth_sendRawTransaction,eth_getTransactionReceipt] create contract', async () => {
        const transactionHash = await ethRpc.eth.transaction(null, null, null, PRIVATE_KEY, null, null, null, null, contract.bytecode);

        transactionHash.should.be.equal('0xf215270841a77eb9757903e99786897a6aab784ff1041438c5ff5a50fadc0cde');

        contractAddress = (await ethRpc.eth.getTransactionReceipt(transactionHash)).contractAddress;
    });

    it('[eth_getCode]', async () => {
        const response = await ethRpc.eth.getCode(contractAddress);

        const isContract = response && response !== '0x';

        isContract.should.be.equal(true);
    });

    it('[eth_call]', async () => {
        const totalSupply = await ethRpc.eth.call('totalSupply()', contractAddress);

        totalSupply.should.be.equal('0x00000000000000000000000000000000000000000000d3c21bcecceda1000000');
    });

    it('[eth_sendRawTransaction] call method', async () => {
        const transactionHash = await ethRpc.eth.transaction('mint(uint256)', contractAddress, [100], PRIVATE_KEY);

        transactionHash.should.be.equal('0x36af4c76dd7f2a204b1a340fb6327ae8ff9e2efe2f974b054d3a36314635a10c');
    });

    after('close test RPC', () => {
        server.close();
    });
});
