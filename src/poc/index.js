
const { contracts } = require('../contracts');
const web3 = require('../web3');


async function fetchBatch(contract, current, lastBlock, acc = []) {
    const lastCurrentBlock = current + 2000 > lastBlock ? lastBlock : current + 2000;
    const options = {
        fromBlock: current,                  //Number || "earliest" || "pending" || "latest"
        toBlock: lastCurrentBlock
    };

    const results = await contract.getPastEvents('Transfer', options);

    acc = [...acc, ...results]
    console.log('Fetched first batch of items', results.length, 'new items');

    if (lastCurrentBlock >= lastBlock) {
        return acc
    } else {
        return await fetchBatch(contract, lastCurrentBlock, lastBlock, acc)
    }
}



async function getPoc() {
    const lastBlock = await web3.eth.getBlockNumber()


    return await Promise.all(contracts.map(async contract => {
        console.log('Fetching info for ' + contract.name);
        const items = await fetchBatch(contract.contract, contract.firstBlock, lastBlock, [] )
        const tokenIds = items.map(i => i.returnValues.tokenId);
        const owners = await Promise.all(tokenIds.map(async tokenId => {
            const owner =  await contract.contract.methods.ownerOf(tokenId).call()
            return {
                owner,
                tokenId
            }
        }))

        console.log('End fetching info for ' + contract.name);
        console.log(owners)
        return {
            name: contract.name,
            owners
        }
    }))
}

module.exports = {
    getPoc
}