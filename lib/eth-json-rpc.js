/**
 * Lightweight wrapper library on top of Ethereum JSON RPC.
 *
 * @module lib/eth-json-rpc
 */

'use strict';

const url     = require('url');
const prom    = require('util').promisify;
const jayson  = require('jayson');
const Eth     = require('../api/eth');
const utils   = require('../api/utils');

module.exports = EthRpc;

EthRpc.utils = utils;

/**
 * Initialize client with proper protocol and extract its request method.
 *
 * @param {String} [providerUrl=http://localhost:8545] ETH RPC url.
 * @class
 *
 * @example
 * const ethRpc = require('eth-rpc')('https://mainnet.infura.io');
 */
function EthRpc(providerUrl = 'http://localhost:8545') {
    if (!new.target) {
        return new EthRpc(providerUrl);
    }

    const method = (url.parse(providerUrl).protocol === 'http:') && 'http' || 'https';
    const client = jayson.client[method](providerUrl);

    Object.defineProperties(this, {
        client:  {value: client},
        request: {value: prom(client.request).bind(client)},
        rpc:     {value: rpc},
        utils:   {value: utils}
    });
    Object.defineProperty(this, 'eth', {value: Eth(this)});
}

/**
 * Raw json rpc request to method eth_call.
 *
 * @param  {String}   method Name of the RPC method to call
 * @param  {?Object}  params Array of arguments for called method
 * @param  {Number}   id     Request ID
 * @return {Promise}         Response result.
 */
function rpc(method, params, id = 1) {
    return this.request(method, params, id)
        .then(function onSuccess(res) {
            if (!res || !res.result || res.error) {
                throw res && res.error || 'RPC responded with null';
            }

            return res.result;
        });
}
