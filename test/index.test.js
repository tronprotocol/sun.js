const { PRIVATE_KEY, CONSUME_USER_RESOURCE_PERCENT, DEPOSIT_FEE, WITHDRAW_FEE, MAPPING_FEE, FEE_LIMIT, MAIN_FULL_NODE_API, MAIN_SOLIDITY_NODE_API, MAIN_EVENT_API, SIDE_FULL_NODE_API, SIDE_SOLIDITY_NODE_API, SIDE_EVENT_API, MAIN_GATEWAY_ADDRESS, SIDE_GATEWAY_ADDRESS, ADDRESS_HEX, ADDRESS_BASE58, TOKEN_ID, CONTRACT_ADDRESS20, HASH20, HASH721, CONTRACT_ADDRESS721, ADDRESS20_MAPPING, ADDRESS721_MAPPING, SIDE_CHAIN_ID, FEE} = require('./helpers/config');

const sunBuilder = require('./helpers/sunBuilder');
const Sun = sunBuilder.Sun;

const chai = require('chai');
const assert = chai.assert;
const assertThrow = require('./helpers/assertThrow');
const Sun = require('tronweb');

// const sunBuilder = require('./helpers/sunBuilder');
// const Sun = sunBuilder.Sun;
const log = require('./helpers/log')
const BigNumber = require('bignumber.js');
const broadcaster = require('./helpers/broadcaster');
const wait = require('./helpers/wait')

describe('Sun Instance', function() {
    describe('#constructor', function() {
        it('should create an instance using an options object with private key', function() {
            const sun = sunBuilder.createInstance();
            assert.instanceOf(sun, Sun);
            assert.equal(sun.mainchain.defaultPrivateKey, PRIVATE_KEY);
            assert.equal(sun.sidechain.defaultPrivateKey, PRIVATE_KEY);
        });

        it('should create an instance using an options object without private key', function() {
            const mainOptions = {
                fullNode: MAIN_FULL_NODE_API,
                solidityNode: MAIN_SOLIDITY_NODE_API,
                eventServer: MAIN_EVENT_API,
            };
            const sideOptions = {
                fullNode: SIDE_FULL_NODE_API,
                solidityNode: SIDE_SOLIDITY_NODE_API,
                eventServer: SIDE_EVENT_API,
            };
            return new Sun(
                mainOptions,
                sideOptions,
                MAIN_GATEWAY_ADDRESS,
                SIDE_GATEWAY_ADDRESS,
                SIDE_CHAIN_ID
            );
            assert.equal(sun.mainchain.defaultPrivateKey, false);
            assert.equal(sun.sidechain.defaultPrivateKey, false);
        });

        it('should create an instance using an options object which only constains a fullhost without private key', function() {
            const mainOptions = {
                fullHost: MAIN_FULL_NODE_API
            };
            const sideOptions = {
                fullHost: SIDE_FULL_NODE_API
            };
            const sun = new Sun(
                mainOptions,
                sideOptions,
                MAIN_GATEWAY_ADDRESS,
                SIDE_GATEWAY_ADDRESS,
                SIDE_CHAIN_ID
            );
            assert.instanceOf(sun, Sun);
            assert.equal(sun.mainchain.defaultPrivateKey, false);
            assert.equal(sun.sidechain.defaultPrivateKey, false);
        });

        it('should create an instance using an options object which only constains a fullhost with private key', function() {
            const mainOptions = {
                fullHost: MAIN_FULL_NODE_API
            };
            const sideOptions = {
                fullHost: SIDE_FULL_NODE_API
            };
            const sun = new Sun(
                mainOptions,
                sideOptions,
                MAIN_GATEWAY_ADDRESS,
                SIDE_GATEWAY_ADDRESS,
                SIDE_CHAIN_ID,
                PRIVATE_KEY
            );
            assert.instanceOf(sun, Sun);
            assert.equal(sun.mainchain.defaultPrivateKey, PRIVATE_KEY);
            assert.equal(sun.sidechain.defaultPrivateKey, PRIVATE_KEY);
        });
    });

    describe('#deposit', function() {
        describe('#depositTrx()', function() {
            const sun = sunBuilder.createInstance();
            it('deposit trx from main chain to side chain', async function() {
                const callValue = 10000000;
                const txID = await sun.depositTrx(callValue, DEPOSIT_FEE, FEE_LIMIT);
                assert.equal(txID.length, 64);
            });

            it('depositTrx with the defined private key', async function() {
                const callValue = 10000000;
                const options = {};
                const txID = await sun.depositTrx(callValue, DEPOSIT_FEE, FEE_LIMIT, options, PRIVATE_KEY);
                assert.equal(txID.length, 64);
            });

            it('depositTrx with permissionId in options object', async function() {
                const callValue = 10000000;
                const options = { permissionId: 0 };
                const txID = await sun.depositTrx(callValue, DEPOSIT_FEE, FEE_LIMIT, options);
                assert.equal(txID.length, 64);
            });

            it('depositTrx with permissionId in options object and the defined private key', async function() {
                const callValue = 10000000;
                const options = { permissionId: 0 };
                const txID = await sun.depositTrx(callValue, DEPOSIT_FEE, FEE_LIMIT, options, PRIVATE_KEY);
                assert.equal(txID.length, 64);
            });

            it('should throw if an invalid trx number is passed', async function() {
                await assertThrow(
                    sun.depositTrx(1000.01, DEPOSIT_FEE, FEE_LIMIT),
                    'Invalid callValue provided'
                );
            });

            it('should throw if an invalid fee limit is passed', async function() {
                await assertThrow(
                    sun.depositTrx(10000, DEPOSIT_FEE, 0),
                    'Invalid feeLimit provided'
                );
            });
        });

        describe('#depositTrc10()', function() {
            const sun = sunBuilder.createInstance();
            it('deposit trc10 from main chain to side chain', async function() {
                const tokenValue = 10;
                const txID = await sun.depositTrc10(TOKEN_ID, tokenValue, DEPOSIT_FEE, FEE_LIMIT);
                assert.equal(txID.length, 64);
            });

            it('depositTrc10 with the defined private key', async function() {
                const tokenValue = 10;
                const options = {};
                const txID = await sun.depositTrc10(TOKEN_ID, tokenValue, DEPOSIT_FEE, FEE_LIMIT, options, PRIVATE_KEY);
                assert.equal(txID.length, 64);
            });

            it('depositTrc10 with permissionId in options object', async function() {
                const tokenValue = 10;
                const options = { permissionId: 0 };
                const txID = await sun.depositTrc10(TOKEN_ID, tokenValue, DEPOSIT_FEE, FEE_LIMIT, options);
                assert.equal(txID.length, 64);
            });

            it('depositTrc10 with permissionId in options object and the defined private key', async function() {
                const tokenValue = 10;
                const options = { permissionId: 0 };
                const txID = await sun.depositTrc10(TOKEN_ID, tokenValue, DEPOSIT_FEE, FEE_LIMIT, options, PRIVATE_KEY);
                assert.equal(txID.length, 64);
            });

            it('should throw if an invalid token id is passed', async function() {
                const tokenId = -10;
                await assertThrow(
                    sun.depositTrc10(tokenId, 100, DEPOSIT_FEE, FEE_LIMIT),
                    'Invalid tokenId provided'
                )
            });

            it('should throw if an invalid token value is passed', async function() {
                const tokenValue = 100.01;
                await assertThrow(
                    sun.depositTrc10(TOKEN_ID, tokenValue, DEPOSIT_FEE, 1000000),
                    'Invalid tokenValue provided'
                );
            });

            it('should throw if an invalid fee limit is passed', async function() {
                const feeLimit = 100000000000;
                await assertThrow(
                    sun.depositTrc10(TOKEN_ID, 100, DEPOSIT_FEE, feeLimit),
                    'Invalid feeLimit provided'
                );
            });
        });

        describe('#depositTrc20', function() {
            const sun = sunBuilder.createInstance();
            it('deposit trc20 from main chain to side chain', async function() {
                const num = 100;
                const txID = await sun.depositTrc20(num, DEPOSIT_FEE, FEE_LIMIT, CONTRACT_ADDRESS20);
                assert.equal(txID.length, 64);
            });

            it('depositTrc20 with the defined private key', async function() {
                const num = 100;
                const options = {};
                const txID = await sun.depositTrc20(num, DEPOSIT_FEE, FEE_LIMIT, CONTRACT_ADDRESS20, options, PRIVATE_KEY);
                assert.equal(txID.length, 64);
            });

            it('depositTrc20 with permissionId in options object', async function() {
                const num = 100;
                const options = { permissionId: 0 };
                const txID = await sun.depositTrc20(num, DEPOSIT_FEE, FEE_LIMIT, CONTRACT_ADDRESS20, options);
                assert.equal(txID.length, 64);
            });

            it('depositTrc20 with permissionId in options object and the defined private key', async function() {
                const num = 100;
                const options = { permissionId: 0 };
                const txID = await sun.depositTrc20(num, DEPOSIT_FEE, FEE_LIMIT, CONTRACT_ADDRESS20, options, PRIVATE_KEY);
                assert.equal(txID.length, 64);
            });

            it('should throw if an invalid num is passed', async function() {
                const num = 100.01;
                await assertThrow(
                    sun.depositTrc20(num, DEPOSIT_FEE, FEE_LIMIT, CONTRACT_ADDRESS20),
                    'Invalid num provided'
                );
            });

            it('should throw if an invalid fee limit is passed', async function() {
                const num = 100;
                const feeLimit = 100000000000;
                await assertThrow(
                    sun.depositTrc20(num, DEPOSIT_FEE, feeLimit, CONTRACT_ADDRESS20),
                    'Invalid feeLimit provided'
                );
            });

            it('should throw if an invalid contract address is passed', async function() {
                await assertThrow(
                    sun.depositTrc20(100, DEPOSIT_FEE, FEE_LIMIT, 'aaaaaaaaaa'),
                    'Invalid contractAddress address provided'
                );
            });
        });

        describe('#depositTrc721', function() {
            const sun = sunBuilder.createInstance();
            it('deposit trc721 from main chain to side chain', async function () {
                const id = 100;
                const txID = await sun.depositTrc20(id, DEPOSIT_FEE, FEE_LIMIT, CONTRACT_ADDRESS721);
                assert.equal(txID.length, 64);
            });
        });
    });

    describe('#mappingTrc', function() {
        const sun = sunBuilder.createInstance();
        it('mappingTrc20', async function() {
            const txID = await sun.mappingTrc20(HASH20, MAPPING_FEE, FEE_LIMIT);
            assert.equal(txID.length, 64);
        });

        it('mappingTrc20 with the defined private key', async function() {
            const options = {};
            const txID = await sun.mappingTrc20(HASH20, MAPPING_FEE, FEE_LIMIT, options, PRIVATE_KEY);
            assert.equal(txID.length, 64);
        });

        it('mappingTrc20 with permissionId in options object', async function() {
            const options = { permissionId: 0 };
            const txID = await sun.mappingTrc20(HASH20, MAPPING_FEE, FEE_LIMIT, options);
            assert.equal(txID.length, 64);
        });

        it('mappingTrc20 with permissionId in options object and the defined private key', async function() {
            const options = { permissionId: 0 };
            const txID = await sun.mappingTrc20(HASH20, MAPPING_FEE, FEE_LIMIT, options, PRIVATE_KEY);
            assert.equal(txID.length, 64);
        });

        it('should throw if an invalid trxHash', async function() {
            const trxHash = '';
            await assertThrow(
                sun.mappingTrc20(trxHash, MAPPING_FEE, FEE_LIMIT),
                'Invalid trxHash provided'
            );
        });

        it('should throw if an invalid fee limit is passed', async function() {
            const feeLimit = 100000000000;
            await assertThrow(
                sun.mappingTrc20(HASH20, MAPPING_FEE, feeLimit),
                'Invalid feeLimit provided'
            );
        });

        it('mappingTrc721', async function() {
            const txID = await sun.mappingTrc721(HASH721, MAPPING_FEE, FEE_LIMIT);
            assert.equal(txID.length, 64);
        })
    });

    describe('#withdraw', function() {
        describe('#withdrawTrx()', function() {
            const sun = sunBuilder.createInstance();
            it('withdraw trx from side chain to main chain', async function() {
                const txID = await sun.withdrawTrx(10000000, WITHDRAW_FEE, 10000000);
                assert.equal(txID.length, 64);
            });

            it('withdrawTrx with the defined private key', async function() {
                const callValue = 10000000;
                const options = {};
                const txID = await sun.withdrawTrx(callValue, WITHDRAW_FEE, FEE_LIMIT, options, PRIVATE_KEY);
                assert.equal(txID.length, 64);
            });

            it('withdrawTrx with permissionId in options object', async function() {
                const callValue = 10000000;
                const options = { permissionId: 0 };
                const txID = await sun.withdrawTrx(callValue, WITHDRAW_FEE, FEE_LIMIT, options);
                assert.equal(txID.length, 64);
            });

            it('withdrawTrx with permissionId in options object and the defined private key', async function() {
                const callValue = 10000000;
                const options = { permissionId: 0 };
                const txID = await sun.withdrawTrx(callValue, WITHDRAW_FEE, FEE_LIMIT, options, PRIVATE_KEY);
                assert.equal(txID.length, 64);
            });

            it('should throw if an invalid trx number is passed', async function() {
                await assertThrow(
                    sun.withdrawTrx(1000.01, WITHDRAW_FEE, FEE_LIMIT),
                    'Invalid callValue provided'
                );
            });

            it('should throw if an invalid fee limit is passed', async function() {
                await assertThrow(
                    sun.withdrawTrx(10000, WITHDRAW_FEE, 0),
                    'Invalid feeLimit provided'
                );
            });
        });

        describe('#withdrawTrc10()', function() {
            const sun = sunBuilder.createInstance();
            it('withdraw trc10 from side chain to main chain', async function() {
                const tokenValue = 10;
                const txID = await sun.withdrawTrc10(TOKEN_ID, tokenValue, WITHDRAW_FEE, FEE_LIMIT);
                assert.equal(txID.length, 64);
            });

            it('withdrawTrc10 with the defined private key', async function() {
                const tokenValue = 10;
                const options = {};
                const txID = await sun.withdrawTrc10(TOKEN_ID, tokenValue, WITHDRAW_FEE, FEE_LIMIT, options, PRIVATE_KEY);
                assert.equal(txID.length, 64);
            });

            it('withdrawTrc10 with permissionId in options object', async function() {
                const tokenValue = 10;
                const options = { permissionId: 0 };
                const txID = await sun.withdrawTrc10(TOKEN_ID, tokenValue, WITHDRAW_FEE, FEE_LIMIT, options);
                assert.equal(txID.length, 64);
            });

            it('withdrawTrc10 with permissionId in options object and the defined private key', async function() {
                const tokenValue = 10;
                const options = { permissionId: 0 };
                const txID = await sun.withdrawTrc10(TOKEN_ID, tokenValue, WITHDRAW_FEE, FEE_LIMIT, options, PRIVATE_KEY);
                assert.equal(txID.length, 64);
            });

            it('should throw if an invalid token id is passed', async function() {
                const tokenId = -10;
                await assertThrow(
                    sun.withdrawTrc10(tokenId, 100, WITHDRAW_FEE, 1000000),
                    'Invalid tokenId provided'
                )
            });

            it('should throw if an invalid token value is passed', async function() {
                const tokenValue = 10.01;
                await assertThrow(
                    sun.withdrawTrc10(TOKEN_ID, tokenValue, WITHDRAW_FEE, FEE_LIMIT),
                    'Invalid tokenValue provided'
                );
            });

            it('should throw if an invalid fee limit is passed', async function() {
                const feeLimit = 100000000000;
                await assertThrow(
                    sun.withdrawTrc10(TOKEN_ID, 100, WITHDRAW_FEE, feeLimit),
                    'Invalid feeLimit provided'
                );
            });
        });

        describe('#withdrawTrc', function() {
            describe('#withdrawTrc20', function() {
                const sun = sunBuilder.createInstance();
                it('withdraw trc20 from side chain to main chain', async function() {
                    const num = 10;
                    const txID = await sun.withdrawTrc20(num, WITHDRAW_FEE, FEE_LIMIT, ADDRESS20_MAPPING);
                    assert.equal(txID.length, 64);
                });

                it('withdrawTrc20 with the defined private key', async function() {
                    const num = 10;
                    const options = {};
                    const txID = await sun.withdrawTrc20(num, WITHDRAW_FEE, FEE_LIMIT, ADDRESS20_MAPPING, options, PRIVATE_KEY);
                    assert.equal(txID.length, 64);
                });

                it('withdrawTrc20 with permissionId in options object', async function() {
                    const num = 10;
                    const options = { permissionId: 0 };
                    const txID = await sun.withdrawTrc20(num, WITHDRAW_FEE, FEE_LIMIT, ADDRESS20_MAPPING, options);
                    assert.equal(txID.length, 64);
                });

                it('withdrawTrc20 with permissionId in options object and the defined private key', async function() {
                    const num = 10;
                    const options = { permissionId: 0 };
                    const txID = await sun.withdrawTrc20(num, WITHDRAW_FEE, FEE_LIMIT, ADDRESS20_MAPPING, options, PRIVATE_KEY);
                    assert.equal(txID.length, 64);
                });

                it('should throw if an invalid num is passed', async function() {
                    const num = 10.01;
                    await assertThrow(
                        sun.withdrawTrc20(num, WITHDRAW_FEE, FEE_LIMIT, ADDRESS20_MAPPING),
                        'Invalid numOrId provided'
                    );
                });

                it('should throw if an invalid fee limit is passed', async function() {
                    const feeLimit = 100000000000;
                    await assertThrow(
                        sun.withdrawTrc20(100, WITHDRAW_FEE, feeLimit, ADDRESS20_MAPPING),
                        'Invalid feeLimit provided'
                    );
                });

                it('should throw if an invalid contract address is passed', async function() {
                    await assertThrow(
                        sun.withdrawTrc20(100, WITHDRAW_FEE, FEE_LIMIT, 'aaaaaaaaaa'),
                        'Invalid contractAddress address provided'
                    );
                });
            });

            describe('#withdrawTrc721', async function() {
                const sun = sunBuilder.createInstance();
                it('withdraw trc721 from side chain to main chain', async function() {
                    const id = 100;
                    const txID = await sun.withdrawTrc721(id, WITHDRAW_FEE, FEE_LIMIT, ADDRESS20_MAPPING);
                    assert.equal(txID.length, 64);
                });
            });
        });
    });

    // ///// test tronweb
    describe('#version()', function () {
        it('should verify that the version is available as static and non-static property', function () {
            const sun = sunBuilder.createInstance();

            assert.equal(typeof sun.version, 'string');
            assert.equal(typeof sun.version, 'string');
        });
    });


    describe('#fullnodeVersion()', function () {
        it('should verify that the version of the fullNode is available', function () {
            const sun = sunBuilder.createInstance();
            assert.equal(typeof sun.fullnodeVersion, 'string');

        });
    });

    describe('#setDefaultBlock()', function () {
        it('should accept a positive integer', function () {
            const sun = sunBuilder.createInstance();

            sun.setDefaultBlock(1);

            assert.equal(sun.defaultBlock, 1);
        });

        it('should correct a negative integer', function () {
            const sun = sunBuilder.createInstance();

            sun.setDefaultBlock(-2);

            assert.equal(sun.defaultBlock, 2);
        });

        it('should accept 0', function () {
            const sun = sunBuilder.createInstance();

            sun.setDefaultBlock(0);

            assert.equal(sun.defaultBlock, 0);
        });

        it('should be able to clear', function () {
            const sun = sunBuilder.createInstance();

            sun.setDefaultBlock();

            assert.equal(sun.defaultBlock, false);
        });

        it('should accept "earliest"', function () {
            const sun = sunBuilder.createInstance();

            sun.setDefaultBlock('earliest');

            assert.equal(sun.defaultBlock, 'earliest');
        });

        it('should accept "latest"', function () {
            const sun = sunBuilder.createInstance();

            sun.setDefaultBlock('latest');

            assert.equal(sun.defaultBlock, 'latest');
        });

        it('should reject a decimal', function () {
            const sun = sunBuilder.createInstance();

            assert.throws(() => sun.setDefaultBlock(10.2), 'Invalid block ID provided');
        });

        it('should reject a string', function () {
            const sun = sunBuilder.createInstance();

            assert.throws(() => sun.setDefaultBlock('test'), 'Invalid block ID provided');
        });
    });

    describe('#setPrivateKey()', function () {
        it('should accept a private key', function () {
            const mainOptions = {
                fullNode: MAIN_FULL_NODE_API,
                solidityNode: MAIN_SOLIDITY_NODE_API,
                eventServer: MAIN_EVENT_API,
            };
            const sideOptions = {
                fullNode: SIDE_FULL_NODE_API,
                solidityNode: SIDE_SOLIDITY_NODE_API,
                eventServer: SIDE_EVENT_API,
            };
            const sun =  new Sun(
                mainOptions,
                sideOptions,
                MAIN_GATEWAY_ADDRESS,
                SIDE_GATEWAY_ADDRESS,
                SIDE_CHAIN_ID
            );

            sun.setPrivateKey(PRIVATE_KEY);

            assert.equal(sun.defaultPrivateKey, PRIVATE_KEY);
        });

        it('should set the appropriate address for the private key', function () {
            const mainOptions = {
                fullNode: MAIN_FULL_NODE_API,
                solidityNode: MAIN_SOLIDITY_NODE_API,
                eventServer: MAIN_EVENT_API,
            };
            const sideOptions = {
                fullNode: SIDE_FULL_NODE_API,
                solidityNode: SIDE_SOLIDITY_NODE_API,
                eventServer: SIDE_EVENT_API,
            };
            const sun = new Sun(
                mainOptions,
                sideOptions,
                MAIN_GATEWAY_ADDRESS,
                SIDE_GATEWAY_ADDRESS,
                SIDE_CHAIN_ID
            );

            sun.setPrivateKey(PRIVATE_KEY);

            assert.equal(sun.defaultAddress.hex, ADDRESS_HEX);
            assert.equal(sun.defaultAddress.base58, ADDRESS_BASE58);
        });

        it('should reject an invalid private key', function () {
            const mainOptions = {
                fullNode: MAIN_FULL_NODE_API,
                solidityNode: MAIN_SOLIDITY_NODE_API,
                eventServer: MAIN_EVENT_API,
            };
            const sideOptions = {
                fullNode: SIDE_FULL_NODE_API,
                solidityNode: SIDE_SOLIDITY_NODE_API,
                eventServer: SIDE_EVENT_API,
            };
            const sun = new Sun(
                mainOptions,
                sideOptions,
                MAIN_GATEWAY_ADDRESS,
                SIDE_GATEWAY_ADDRESS,
                SIDE_CHAIN_ID
            );

            assert.throws(() => sun.mainchain.setPrivateKey('test'), 'Invalid private key provided');
        });

        it('should emit a privateKeyChanged event', function (done) {
            this.timeout(1000);

            const sun = sunBuilder.createInstance();

            sun.mainchain.on('privateKeyChanged', privateKey => {
                done(
                    assert.equal(privateKey, PRIVATE_KEY)
                );
            });

            sun.mainchain.setPrivateKey(PRIVATE_KEY);
        });
    });

    describe('#setAddress()', function () {
        it('should accept a hex address', function () {
            const sun = sunBuilder.createInstance();

            sun.mainchain.setAddress(ADDRESS_HEX);

            assert.equal(sun.defaultAddress.hex, ADDRESS_HEX);
            assert.equal(sun.defaultAddress.base58, ADDRESS_BASE58);
        });

        it('should accept a base58 address', function () {
            const sun = sunBuilder.createInstance();

            sun.mainchain.setAddress(ADDRESS_BASE58);

            assert.equal(sun.mainchain.defaultAddress.hex, ADDRESS_HEX);
            assert.equal(sun.mainchain.defaultAddress.base58, ADDRESS_BASE58);
        });

        it('should reset the private key if the address doesn\'t match', function () {
            const sun = sunBuilder.createInstance();

            assert.equal(sun.mainchain.defaultPrivateKey, PRIVATE_KEY);

            sun.mainchain.setAddress(
                ADDRESS_HEX.substr(0, ADDRESS_HEX.length - 1) + '8'
            );

            assert.equal(sun.mainchain.defaultPrivateKey, false);
            assert.equal(sun.mainchain.defaultAddress.hex, ADDRESS_HEX);
            assert.equal(sun.mainchain.defaultAddress.base58, ADDRESS_BASE58);
        });

        it('should not reset the private key if the address matches', function () {
            const sun = sunBuilder.createInstance();

            sun.mainchain.setAddress(ADDRESS_BASE58);

            assert.equal(sun.mainchain.defaultPrivateKey, PRIVATE_KEY);
        });

        it('should emit an addressChanged event', function (done) {
            this.timeout(1000);

            const sun = sunBuilder.createInstance();

            sun.mainchain.on('addressChanged', ({hex, base58}) => {
                done(
                    assert.equal(hex, ADDRESS_HEX) &&
                    assert.equal(base58, ADDRESS_BASE58)
                );
            });

            sun.mainchain.setAddress(ADDRESS_BASE58);
        });
    });

    describe('#isValidProvider()', function () {
        it('should accept a valid provider', function () {
            const sun = sunBuilder.createInstance();
            const provider = new HttpProvider(FULL_NODE_API);

            assert.equal(sun.mainchain.isValidProvider(provider), true);
        });

        it('should accept an invalid provider', function () {
            const sun = sunBuilder.createInstance();

            assert.equal(sun.mainchain.isValidProvider('test'), false);
        });
    });

    describe('#setFullNode()', function () {
        it('should accept a HttpProvider instance', function () {
            const sun = sunBuilder.createInstance();
            const provider = new HttpProvider(FULL_NODE_API);

            sun.mainchain.setFullNode(provider);

            assert.equal(sun.mainchain.fullNode, provider);
        });

        it('should accept a valid URL string', function () {
            const sun = sunBuilder.createInstance();
            const provider = FULL_NODE_API;

            sun.mainchain.setFullNode(provider);

            assert.equal(sun.mainchain.fullNode.host, provider);
        });

        it('should reject a non-string', function () {
            assert.throws(() => {
                sunBuilder.createInstance().mainchain.setFullNode(true)
            }, 'Invalid full node provided');
        });

        it('should reject an invalid URL string', function () {
            assert.throws(() => {
                sunBuilder.createInstance().mainchain.setFullNode('example.')
            }, 'Invalid URL provided to HttpProvider');
        });
    });

    describe('#setSolidityNode()', function () {
        it('should accept a HttpProvider instance', function () {
            const sun = sunBuilder.createInstance();
            const provider = new HttpProvider(SOLIDITY_NODE_API);

            sun.mainchain.setSolidityNode(provider);

            assert.equal(sun.mainchain.solidityNode, provider);
        });

        it('should accept a valid URL string', function () {
            const sun = sunBuilder.createInstance();
            const provider = SOLIDITY_NODE_API;

            sun.mainchain.setSolidityNode(provider);

            assert.equal(sun.mainchain.solidityNode.host, provider);
        });

        it('should reject a non-string', function () {
            assert.throws(() => {
                sunBuilder.createInstance().setSolidityNode(true)
            }, 'Invalid solidity node provided');
        });

        it('should reject an invalid URL string', function () {
            assert.throws(() => {
                sunBuilder.createInstance().setSolidityNode('_localhost')
            }, 'Invalid URL provided to HttpProvider');
        });
    });

    describe('#setEventServer()', function () {
        it('should accept a valid URL string', function () {
            const sun = sunBuilder.createInstance().mainchain;
            const eventServer = EVENT_API;

            sun.setEventServer(eventServer);

            assert.equal(sun.eventServer.host, eventServer);
        });

        it('should reset the event server property', function () {
            const sun = sunBuilder.createInstance().mainchain;

            sun.setEventServer(false);

            assert.equal(sun.eventServer, false);
        });

        it('should reject an invalid URL string', function () {
            const sun = sunBuilder.createInstance().mainchain;

            assert.throws(() => {
                sun.setEventServer('test%20')
            }, 'Invalid URL provided to HttpProvider');
        });

        it('should reject an invalid URL parameter', function () {
            const sun = sunBuilder.createInstance().mainchain;

            assert.throws(() => {
                sun.setEventServer({})
            }, 'Invalid event server provided');
        });
    });

    describe('#currentProviders()', function () {
        it('should return the current providers', function () {
            const sun = sunBuilder.createInstance().mainchain;
            const providers = sun.currentProviders();

            assert.equal(providers.fullNode.host, FULL_NODE_API);
            assert.equal(providers.solidityNode.host, SOLIDITY_NODE_API);
            assert.equal(providers.eventServer.host, EVENT_API);
        });
    });

    describe('#currentProvider()', function () {
        it('should return the current providers', function () {
            const sun = sunBuilder.createInstance().mainchain;
            const providers = sun.currentProvider();

            assert.equal(providers.fullNode.host, FULL_NODE_API);
            assert.equal(providers.solidityNode.host, SOLIDITY_NODE_API);
            assert.equal(providers.eventServer.host, EVENT_API);
        });
    });

    describe('#sha3()', function () {
        it('should match web3 sha function', function () {
            const input = 'casa';
            const expected = '0xc4388c0eaeca8d8b4f48786df8517bc8ca379e8cf9566af774448e46e816657d';

            assert.equal(Sun.sha3(input), expected);
        });
    });

    describe('#toHex()', function () {
        it('should convert a boolean to hex', function () {
            let input = true;
            let expected = '0x1';
            assert.equal(Sun.toHex(input), expected);

            input = false;
            expected = '0x0';
            assert.equal(Sun.toHex(input), expected);
        });

        it('should convert a BigNumber to hex', function () {
            let input = BigNumber('123456.7e-3');
            let expected = '0x7b.74ea4a8c154c985f06f7';
            assert.equal(Sun.toHex(input), expected);

            input = new BigNumber(89273674656);
            expected = '0x14c9202ba0';
            assert.equal(Sun.toHex(input), expected);

            input = BigNumber('23e89');
            expected = '0x1210c23ede2d38fed455e938516db71cfaf3ec4a1c8f3fa92f98a60000000000000000000000';
            assert.equal(Sun.toHex(input), expected);
        });

        it('should convert an object to an hex string', function () {
            let input = {address: 'TTRjVyHu1Lv3DjBPTgzCwsjCvsQaHKQcmN'};
            let expected = '0x7b2261646472657373223a225454526a56794875314c7633446a425054677a4377736a4376735161484b51636d4e227d';
            assert.equal(Sun.toHex(input), expected);

            input = [1, 2, 3];
            expected = '0x5b312c322c335d';
            assert.equal(Sun.toHex(input), expected);
        });

        it('should convert a string to hex', function () {
            let input = 'salamon';
            let expected = '0x73616c616d6f6e';
            assert.equal(Sun.toHex(input), expected);
        });

        it('should leave an hex string as is', function () {
            let input = '0x73616c616d6f6e';
            let expected = '0x73616c616d6f6e';
            assert.equal(Sun.toHex(input), expected);
        });

        it('should convert a number to an hex string', function () {
            let input = 24354;
            let expected = '0x5f22';
            assert.equal(Sun.toHex(input), expected);

            input = -423e-2;
            expected = '-0x4.3ae147ae147ae147ae14';
            assert.equal(Sun.toHex(input), expected);
        });

        it('should throw an error if the value is not convertible', function () {

            assert.throws(() => {
                Sun.toHex(Sun)
            }, 'The passed value is not convertible to a hex string');
        });

    });

    describe("#toUtf8", function () {

        it("should convert an hex string to utf8", function () {

            let input = '0x73616c616d6f6e';
            let expected = 'salamon';
            assert.equal(Sun.toUtf8(input), expected);

        });

        it("should convert an hex string to utf8", function () {

            let input = '0xe69cbae6a2b0e58f8ae8a18ce4b89ae8aebee5a487';
            let expected = '机械及行业设备';
            assert.equal(Sun.toUtf8(input), expected);

        });

        it('should throw an error if the string is not a valid hex string in strict mode', function () {
            let input = 'salamon';

            assert.throws(() => {
                Sun.toUtf8(input, true)
            }, 'The passed value is not a valid hex string');
        });

    });

    describe("#fromUtf8", function () {

        it("should convert an utf-8 string to hex", function () {

            let input = 'salamon';
            let expected = '0x73616c616d6f6e';
            assert.equal(Sun.fromUtf8(input), expected);

            input = '机械及行业设备';
            expected = '0xe69cbae6a2b0e58f8ae8a18ce4b89ae8aebee5a487';
            assert.equal(Sun.fromUtf8(input), expected);

        });

        it('should throw an error if the utf-8 string is not a string', function () {
            assert.throws(() => {
                Sun.fromUtf8([])
            }, 'The passed value is not a valid utf-8 string');
        });

    });

    describe("#toAscii", function () {

        it("should convert a hex string to ascii", function () {

            let input = '0x73616c616d6f6e';
            let expected = 'salamon';
            assert.equal(Sun.toAscii(input), expected);

            input = '0xe69cbae6a2b0e58f8ae8a18ce4b89ae8aebee5a487';
            expected = 'æºæ¢°åè¡ä¸è®¾å¤';
            // 'f\u001c:f"0e\u000f\nh!\fd8\u001ah.>e$\u0007';
            assert.equal(Sun.toAscii(input), expected);
        });

        it('should throw an error if the string is not a valid hex string', function () {
            let input = 'salamon';
            assert.throws(() => {
                Sun.toAscii(input)
            }, 'The passed value is not a valid hex string');
        });

    });

    describe("#fromAscii", function () {

        it("should convert an ascii string to hex", function () {

            let input = 'salamon';
            let expected = '0x73616c616d6f6e';
            assert.equal(Sun.fromAscii(input), expected);

            input = 'æºæ¢°åè¡ä¸è®¾å¤';
            expected = '0xe69cbae6a2b0e58f8ae8a18ce4b89ae8aebee5a487';
            assert.equal(Sun.fromAscii(input), expected);
        });

        it('should throw an error if the utf-8 string is not a string', function () {
            let result;
            assert.throws(() => {
                Sun.fromAscii([])
            }, 'The passed value is not a valid utf-8 string');
        });

    });

    describe("#toBigNumber", function () {

        it("should convert a hex string to a bignumber", function () {

            let input = '0x73616c61';
            let expected = 1935764577;
            assert.equal(Sun.toBigNumber(input).toNumber(), expected);


        });

        it("should convert a number to a bignumber", function () {

            let input = 1935764577;
            let expected = 1935764577;

            assert.equal(Sun.toBigNumber(input).c[0], expected);
        });

        it("should convert a number string to a bignumber", function () {

            let input = '89384775883766237763193576457709388576373';
            let expected = [8938477588376, 62377631935764, 57709388576373];

            assert.equal(Sun.toBigNumber(input).c[0], expected[0]);
            assert.equal(Sun.toBigNumber(input).c[1], expected[1]);
            assert.equal(Sun.toBigNumber(input).c[2], expected[2]);
        });
    });

    describe("#toDecimal", function () {

        it("should convert a hex string to a number", function () {

            let input = '0x73616c61';
            let expected = 1935764577;
            assert.equal(Sun.toDecimal(input), expected);
        });

        it("should convert a number to a bignumber", function () {

            let input = 1935764577;
            let expected = 1935764577;

            assert.equal(Sun.toDecimal(input), expected);
        });

        it("should convert a number string to a bignumber", function () {

            let input = '89384775883766237763193576457709388576373';
            let expected = 8.938477588376623e+40;

            assert.equal(Sun.toDecimal(input), expected);
        });
    });

    describe("#fromDecimal", function () {

        it("should convert a number to an hex string to a number", function () {

            let input = 1935764577;
            let expected = '0x73616c61';
            assert.equal(Sun.fromDecimal(input), expected);
        });

        it("should convert a negative number to an hex string to a number", function () {

            let input = -1935764577;
            let expected = '-0x73616c61';
            assert.equal(Sun.fromDecimal(input), expected);
        });
    });


    describe("#toSun", function () {

        it("should convert some trx to sun", function () {

            let input = 324;
            let expected = 324e6;
            assert.equal(Sun.toSun(input), expected);
        });
    });


    describe("#fromSun", function () {
        it("should convert a negative number to an hex string to a number", function () {

            let input = 3245e6;
            let expected = 3245;
            assert.equal(Sun.fromSun(input), expected);
        });
    });

    describe("#isAddress", function () {
        it("should verify that a string is a valid base58 address", function () {

            let input = 'TYPG8VeuoVAh2hP7Vfw6ww7vK98nvXXXUG';
            assert.equal(Sun.isAddress(input), true);
        });

        it("should verify that a string is an invalid base58 address", function () {

            let input = 'TYPG8VeuoVAh2hP7Vfw6ww7vK98nvXXXUs';
            assert.equal(Sun.isAddress(input), false);

            input = 'TYPG8VeuoVAh2hP7Vfw6ww7vK98nvXXXUG89';
            assert.equal(Sun.isAddress(input), false);

            input = 'aYPG8VeuoVAh2hP7Vfw6ww7vK98nvXXXUG';
            assert.equal(Sun.isAddress(input), false);
        });

        it("should verify that a string is a valid hex address", function () {

            let input = '4165cfbd57fa4f20687b2c33f84c4f9017e5895d49';
            assert.equal(Sun.isAddress(input), true);
        });

        it("should verify that a string is an invalid base58 address", function () {

            let input = '0x65cfbd57fa4f20687b2c33f84c4f9017e5895d49';
            assert.equal(Sun.isAddress(input), false);

            input = '4165cfbd57fa4f20687b2c33f84c4f9017e589';
            assert.equal(Sun.isAddress(input), false);

            input = '4165cfbd57fa4f20687b2c33f84c4f9017e5895d4998';
            assert.equal(Sun.isAddress(input), false);
        });
    });

    describe("#createAccount", function () {
        it("should create a new account", async function () {
            const sun = sunBuilder.createInstance();

            const newAccount = await Sun.createAccount();
            assert.equal(newAccount.privateKey.length, 64);
            assert.equal(newAccount.publicKey.length, 130);
            let address = sun.address.fromPrivateKey(newAccount.privateKey);
            assert.equal(address, newAccount.address.base58);

            // TODO The new accounts returns an uppercase address, while everywhere else we handle lowercase addresses. Maybe we should make it consistent and let createAccount returning a lowercase address
            assert.equal(sun.address.toHex(address), newAccount.address.hex.toLowerCase());
        });
    });

    describe("#isConnected", function () {
        it("should verify that sun is connected to nodes and event server", async function () {

            this.timeout(10000)

            const sun = sunBuilder.createInstance().mainchain;
            const isConnected = await sun.isConnected();

            assert.isTrue(isConnected.fullNode);
            assert.isTrue(isConnected.solidityNode);
            assert.isTrue(isConnected.eventServer);

        });
    });

    describe("#getEventsByTransactionID", async function () {

        let accounts
        let sun
        let contractAddress
        let contract

        before(async function () {
            sun = sunBuilder.createInstance().mainchain;
            accounts = await sunBuilder.getTestAccounts(-1);

            const result = await broadcaster(sun.transactionBuilder.createSmartContract({
                abi: [
                    {
                        "anonymous": false,
                        "inputs": [
                            {
                                "indexed": true,
                                "name": "_sender",
                                "type": "address"
                            },
                            {
                                "indexed": false,
                                "name": "_receiver",
                                "type": "address"
                            },
                            {
                                "indexed": false,
                                "name": "_amount",
                                "type": "uint256"
                            }
                        ],
                        "name": "SomeEvent",
                        "type": "event"
                    },
                    {
                        "constant": false,
                        "inputs": [
                            {
                                "name": "_receiver",
                                "type": "address"
                            },
                            {
                                "name": "_someAmount",
                                "type": "uint256"
                            }
                        ],
                        "name": "emitNow",
                        "outputs": [],
                        "payable": false,
                        "stateMutability": "nonpayable",
                        "type": "function"
                    }
                ],
                bytecode: "0x608060405234801561001057600080fd5b50610145806100206000396000f300608060405260043610610041576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063bed7111f14610046575b600080fd5b34801561005257600080fd5b50610091600480360381019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050610093565b005b3373ffffffffffffffffffffffffffffffffffffffff167f9f08738e168c835bbaf7483705fb1c0a04a1a3258dd9687f14d430948e04e3298383604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019250505060405180910390a250505600a165627a7a7230582033629e2b0bba53f7b5c49769e7e360f2803ae85ac80e69dd61c7bb48f9f401f30029"
            }, accounts.hex[0]), accounts.pks[0])

            contractAddress = result.receipt.transaction.contract_address
            contract = await sun.contract().at(contractAddress)

        });


        it('should emit an unconfirmed event and get it', async function () {

            this.timeout(60000)
            sun.setPrivateKey(accounts.pks[1])
            let txId = await contract.emitNow(accounts.hex[2], 2000).send({
                from: accounts.hex[1]
            })
            let events
            while (true) {
                events = await sun.getEventByTransactionID(txId)
                if (events.length) {
                    break
                }
                await wait(0.5)
            }

            assert.equal(events[0].result._receiver.substring(2), accounts.hex[2].substring(2))
            assert.equal(events[0].result._sender.substring(2), accounts.hex[1].substring(2))
            assert.equal(events[0].resourceNode, 'fullNode')

        })

    });

    describe("#getEventResult", async function () {

        let accounts
        let sun
        let contractAddress
        let contract
        let eventLength = 0

        before(async function () {
            sun = sunBuilder.createInstance().mainchain;
            accounts = await sunBuilder.getTestAccounts(-1);

            const result = await broadcaster(sun.transactionBuilder.createSmartContract({
                abi: [
                    {
                        "anonymous": false,
                        "inputs": [
                            {
                                "indexed": true,
                                "name": "_sender",
                                "type": "address"
                            },
                            {
                                "indexed": false,
                                "name": "_receiver",
                                "type": "address"
                            },
                            {
                                "indexed": false,
                                "name": "_amount",
                                "type": "uint256"
                            }
                        ],
                        "name": "SomeEvent",
                        "type": "event"
                    },
                    {
                        "constant": false,
                        "inputs": [
                            {
                                "name": "_receiver",
                                "type": "address"
                            },
                            {
                                "name": "_someAmount",
                                "type": "uint256"
                            }
                        ],
                        "name": "emitNow",
                        "outputs": [],
                        "payable": false,
                        "stateMutability": "nonpayable",
                        "type": "function"
                    }
                ],
                bytecode: "0x608060405234801561001057600080fd5b50610145806100206000396000f300608060405260043610610041576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063bed7111f14610046575b600080fd5b34801561005257600080fd5b50610091600480360381019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050610093565b005b3373ffffffffffffffffffffffffffffffffffffffff167f9f08738e168c835bbaf7483705fb1c0a04a1a3258dd9687f14d430948e04e3298383604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019250505060405180910390a250505600a165627a7a7230582033629e2b0bba53f7b5c49769e7e360f2803ae85ac80e69dd61c7bb48f9f401f30029"
            }, accounts.hex[0]), accounts.pks[0])

            contractAddress = result.receipt.transaction.contract_address
            contract = await sun.contract().at(contractAddress)

        });

        it('should emit an event and wait for it', async function () {

            this.timeout(60000)
            sun.setPrivateKey(accounts.pks[3])
            await contract.emitNow(accounts.hex[4], 4000).send({
                from: accounts.hex[3]
            })
            eventLength++
            let events
            while (true) {
                events = await sun.getEventResult(contractAddress, {
                    eventName: 'SomeEvent',
                    sort: 'block_timestamp'
                })
                if (events.length === eventLength) {
                    break
                }
                await wait(0.5)
            }

            const event = events[events.length - 1]

            assert.equal(event.result._receiver.substring(2), accounts.hex[4].substring(2))
            assert.equal(event.result._sender.substring(2), accounts.hex[3].substring(2))
            assert.equal(event.resourceNode, 'fullNode')

        })


    });
});

