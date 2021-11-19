
const { contracts } = require('../contracts');
const web3 = require('../web3');


async function fetchBatch(contract, current, lastBlock, acc = [], name) {
    const lastCurrentBlock = current + 300 > lastBlock ? lastBlock : current + 300;
    const options = {
        fromBlock: current,                  //Number || "earliest" || "pending" || "latest"
        toBlock: lastCurrentBlock
    };

    const results = await contract.getPastEvents('Transfer', options);

    acc = [...acc, ...results]
    console.log('Fetched  batch of items  from block', lastCurrentBlock,  'new items', results.length, name);

    if (lastCurrentBlock >= lastBlock) {
        return acc
    } else {
        return await fetchBatch(contract, lastCurrentBlock, lastBlock, acc, name)
    }
}



async function getPoc() {
    const lastBlock = await web3.eth.getBlockNumber()


    return await Promise.all(contracts.map(async contract => {
        console.log('Fetching info for ' + contract.name);
        try {
            const items = await fetchBatch(contract.contract, contract.firstBlock, lastBlock, [] , contract.name)
            console.log('Finished batch for ', contract.name, 'with items', items.length)
            const tokenIds = items.map(i => i.returnValues.tokenId);
            const reducedIds = []
            tokenIds.forEach(id => {
                if (!reducedIds.includes(id)) {
                    reducedIds.push(id)
                }
            })
            console.log('Getting owners for ', contract.name, tokenIds.length, 'unique tokens')
            const owners = await Promise.all(reducedIds.map(async tokenId => {
                try {
                    const owner =  await contract.contract.methods.ownerOf(tokenId).call()
                    return {
                        owner,
                        tokenId
                    }
                }catch(e) {
                    return {
                        tokenId,
                        owner: 'Not found'
                    }
                }
            }))
    
            console.log('End fetching info for ' + contract.name);
            return {
                name: contract.name,
                owners
            }
        }catch(e) {
            console.log('error for', contract.name, e)
            throw e
        }
    }))
}

module.exports = {
    getPoc
}