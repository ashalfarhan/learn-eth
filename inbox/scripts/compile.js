const path = require('path');
const fs = require('fs/promises');
const solc = require('solc');
//
const contractPath = path.resolve(__dirname, '..', 'contracts', 'Inbox.sol');
const artifactPath = path.resolve(__dirname, '..', 'artifacts', 'Inbox.json');

async function main() {
  const source = await fs.readFile(contractPath, 'utf-8');
  const options = JSON.stringify({
    language: 'Solidity',
    sources: {
      'Inbox.sol': {
        content: source,
      },
    },
    settings: {
      outputSelection: {
        '*': {
          '*': ['*'],
        },
      },
    },
  });

  const res = JSON.parse(solc.compile(options));
  const inboxContract = res.contracts['Inbox.sol'].Inbox;
  const jsonData = JSON.stringify({
    abi: inboxContract.abi,
    bytecode: inboxContract.evm.bytecode,
  });

  await fs.writeFile(artifactPath, jsonData);
}

main()
  .then(() => {
    console.log('Compilation success');
  })
  .catch(error => {
    console.log('Failed to compile');
    console.error(error);
    process.exit(1);
  });
