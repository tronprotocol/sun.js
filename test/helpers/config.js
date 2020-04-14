const mainFullNode = 'https://testhttpapi.tronex.io';
const mainSolidityNode = 'https://testhttpapi.tronex.io';
const mainEventServer = 'https://testapi.tronex.io';

const sideFullNode = 'https://suntest.tronex.io';
const sideSolidityNode = 'https://suntest.tronex.io';
const sideEventServer = 'https://suntest.tronex.io';

module.exports = {
    PRIVATE_KEY: 'D26F041BAE7B1CB8E82148B0640247D5C4DA08839672FBBD595DF49721C87D61',  // account private key, do not show it at any place
    CONSUME_USER_RESOURCE_PERCENT: 30,
    DEPOSIT_FEE: 0,
    MAPPING_FEE: 0,
    WITHDRAW_FEE: 10000000,
    FEE_LIMIT: 100000000,
    MAIN_FULL_NODE_API: mainFullNode,
    MAIN_SOLIDITY_NODE_API: mainSolidityNode,
    MAIN_EVENT_API: mainEventServer,
    SIDE_FULL_NODE_API: sideFullNode,
    SIDE_SOLIDITY_NODE_API: sideSolidityNode,
    SIDE_EVENT_API: sideEventServer,
    NETWORK_ID: "*",
    MAIN_GATEWAY_ADDRESS: 'TFLtPoEtVJBMcj6kZPrQrwEdM3W3shxsBU',
    MAIN_GATEWAY_ADDRESS_HEX: '413af23f37da0d48234fdd43d89931e98e1144481b',
    SIDE_GATEWAY_ADDRESS: 'TRDepx5KoQ8oNbFVZ5sogwUxtdYmATDRgX',
    SIDE_GATEWAY_ADDRESS_HEX: '41a74544b896f6a50f8ef1c2d64803c462cbdb019d',
    SIDE_CHAIN_ID: '413AF23F37DA0D48234FDD43D89931E98E1144481B',
    ADDRESS_HEX: '410951161a338f32d5d8834b97e39350ff5f49dc32',
    ADDRESS_BASE58: 'TApUDmCr9X1SzhgBzmQxpfe85QzESPhAFZ',
    TOKEN_ID: 1000001,
    HASH20: 'c599148ed97c881eee7269344c29d3bb356afa6127a86df39a7c154ee8d4584f',
    CONTRACT_ADDRESS20: 'TGKuXDnvdHv9RNE6BPXUtNLK2FrVMBDAuA',
    CONTRACT_ADDRESS20_HEX: '4145bae5fb418cbc625a38f075a5d18075cb2fc371',
    ADDRESS20_MAPPING: 'TJUczRVQ8bLX7G9GJGf24KMVgsPvwiyhMX',
    ADDRESS20_MAPPING_HEX: '415d51181d8461d0cd1537eaf5560ec081bdf5543d',
    HASH721: '5c5acf3d0d6653ab847d79232de68c7f8df0c55727317944f3f81243d6e547ae',
    CONTRACT_ADDRESS721: 'TUxDmFbEceGgjWCb6rLVcrFgnsWwofPdPq',
    CONTRACT_ADDRESS721_HEX: '41d03a9c278072eda0d10769c5b31b33ef5ad2825b',
    ADDRESS721_MAPPING: 'TCp6QQZEU4V7BSPSEE3fS7xT5FcozF3Ai8',
    ADDRESS721_MAPPING_HEX: '411f2f205d31e15b284f8771c0f9f01dfc6d164e57',
    UPDATED_TEST_TOKEN_OPTIONS: {
        description: 'Very useless utility token',
        url: 'https://none.example.com',
        freeBandwidth: 10,
        freeBandwidthLimit: 100
    },
    getTokenOptions: () => {
        const rnd = Math.random().toString(36).substr(2);
        return {
            name: `Token${rnd}`,
            abbreviation: `T${rnd.substring(2).toUpperCase()}`,
            description: 'Useless utility token',
            url: `https://example-${rnd}.com/`,
            totalSupply: 100000000,
            saleEnd: Date.now() + 60000, // 1 minute
            frozenAmount: 5,
            frozenDuration: 1,
            trxRatio: 10,
            tokenRatio: 2,
            saleStart: Date.now() + 500,
            freeBandwidth: 100,
            freeBandwidthLimit: 1000
        }
    },
    isProposalApproved: async (tronWeb, proposal) => {
        let chainParameters = await tronWeb.trx.getChainParameters()
        for(let param of chainParameters) {
            if(param.key === proposal) {
                return param.value
            }
        }
        return false
    }
}
