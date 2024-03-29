const abiCastleDAO = require('./abis/castledao.json');
const abiRealm = require('./abis/realm-abi.json');
const abiBunnyGang = require('./abis/bunnygang.json');
const abiRandomwalk = require('./abis/abirandomwalk.json');
const web3 = require('../web3')

const contractAddresses = [{
    name: 'CastleDAO',
    address: '0x71f5C328241fC3e03A8c79eDCD510037802D369c',
    // Used to count transfer events since
    firstBlock: '386564',
    abi: abiCastleDAO
}, {
    name: 'Realm',
    address: '0x4de95c1E202102E22E801590C51D7B979f167FBB',
    // Used to count transfer events since
    firstBlock: '758297',
    abi: abiRealm
},{
    name: 'TheBunnyGang',
    address: '0x091dB4502cbd66492D3e509403Bb7aC721AC9F84',
    // Used to count transfer events since
    firstBlock: '431967',
    abi: abiBunnyGang
},{
    name: 'RandomWalkNFT',
    address: '0x895a6F444BE4ba9d124F61DF736605792B35D66b',
    // Used to count transfer events since
    firstBlock: '2910155',
    abi: abiRandomwalk
}]

const contracts = contractAddresses.map(c => {
    const contract = new web3.eth.Contract(c.abi, c.address);
    return {
        ...c,
        contract
    }
});

module.exports = {
    contracts
}