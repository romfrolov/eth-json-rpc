# ETH RPC

![](https://github.com/romfrolov/eth-json-rpc/workflows/build/badge.svg) [![npm version](https://badge.fury.io/js/eth-json-rpc.svg)](https://badge.fury.io/js/eth-json-rpc) [![Coverage Status](https://coveralls.io/repos/github/romfrolov/eth-json-rpc/badge.svg?branch=master)](https://coveralls.io/github/romfrolov/eth-json-rpc?branch=master) [![install size](https://packagephobia.now.sh/badge?p=eth-json-rpc)](https://packagephobia.now.sh/result?p=eth-json-rpc)

Lightweight wrapper library on top of [Ethereum JSON RPC](https://github.com/ethereum/wiki/wiki/JSON-RPC).

## Quick start

```bash
npm install eth-json-rpc
```

```js
const ethRpc = require('eth-json-rpc')('https://mainnet.infura.io');

(async () => {

    // Get block number.
    const blockNumber = await ethRpc.eth.blockNumber();

    console.log(blockNumber); // 7280000

    // Call contract method.
    const totalSupply = await ethRpc.eth.call({methodSignature: 'totalSupply()', to: CONTRACT_ADDRESS});

    console.log(totalSupply); // 0x00000000000000000000000000000000000000000000d3c21bcecceda1000000

    // Send transaction to contract.
     const transactionHash = await ethRpc.eth.transaction({methodSignature: 'mint(uint256)', to: CONTRACT_ADDRESS, args: [100], privateKey: PRIVATE_KEY});

     console.log(transactionHash); // 0x36af4c76dd7f2a204b1a340fb6327ae8ff9e2efe2f974b054d3a36314635a10c

})();
```

## Features

- lightweight
- support of batch RPC requests
- minimum level of abstraction layers
- ease of work with contracts

## API

### eth

- `call` - Call contract method.
- `transaction` - Create transaction object, sign transaction, serialize transaction, send transaction.
- `gasPrice` - Get gas price.
- `getCode` - Get code at address.
- `getTransactionReceipt` - Get transaction receipt.
- `getTransactionCount` - Get number of transactions the address sent.
- `blockNumber` - Get number of the latest block.
- `getBlock` - Get block by number.
- `getLogs` - Get logs from blocks.
- `getBlocks` - Get blocks with logs in a batch RPC request.
- `getBlocksFromArray` - Get blocks with logs in a batch RPC request with optional consistency.

### utils

- `isZeroAddress` - Check whether address is zero or not.
- `isValidAddress` - Validate address.
- `getMethodOutputParameters` - Get method output parameter types from contract ABI.
- `decodeRawOutput` - Decode raw data returned from the contract call.

For a complete documentation visit [documentation](#documentation) section.

## Documentation

```bash
npm run docs      # generate docs
npm run http-docs # start HTTP server serving docs
```

## Tests

```bash
npm test
```

## License

The eth-json-rpc library is licensed under the GNU GENERAL PUBLIC LICENSE, which can be found in this repository in the `LICENSE` file.

## Acknowledgments

- This library was written with support of [Wings Project](https://wings.ai)
