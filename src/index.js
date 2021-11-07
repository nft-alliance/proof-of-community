require('dotenv').config();
const fs = require('fs');
const { getPoc } = require('./poc');


async function execute() {
    try {
        console.log('Extracting addresses for the NFT Alliance')

        const result = await getPoc()
        
        fs.writeFileSync('./output.json', JSON.stringify(result, null, 2));

        console.log('Finished, check the file output.json')
    } catch (e) {
        console.log('Error generating POC', e.message);
    }
}


execute()