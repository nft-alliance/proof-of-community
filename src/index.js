require('dotenv').config();
const fs = require('fs');
const { getPoc } = require('./poc');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;


async function execute() {
    try {
        console.log('Extracting addresses for the NFT Alliance')

        const result = await getPoc()

        fs.writeFileSync('./output.json', JSON.stringify(result, null, 2));

        const csvWriter = createCsvWriter({
            path: './output.csv',
            header: [
                { id: 'collection', title: 'COLLECTION' },
                { id: 'address', title: 'ADDRESS' },
                { id: 'tokenId', title: 'TOKENID' },
            ]
        });

        const records = []
        result.forEach(nftCollection => {
            nftCollection.owners.forEach(owner => {
                records.push({
                    collection: nftCollection.name,
                    address: owner.owner,
                    tokenId: owner.tokenId
                })
            })
        })

        console.log('Writing csv')

        csvWriter.writeRecords(records)       // returns a promise
            .then(() => {
                console.log('Finished, check the file output.json and output.csv')
            });



    } catch (e) {
        console.log('Error generating POC', e.message);
    }
}


execute()