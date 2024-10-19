const path = require('path');
const fs = require('fs/promises');
const solc = require('solc');
//
const contractPath = path.resolve(__dirname, '..', 'contracts', 'Lottery.sol');
const artifactPath = path.resolve(__dirname, '..', 'artifacts', 'Lottery.json');

async function main() {
  const source = await fs.readFile(contractPath, 'utf-8');
  const options = JSON.stringify({
    language: 'Solidity',
    sources: {
      'Lottery.sol': {
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
  const lotteryContract = res.contracts['Lottery.sol'].Lottery;
  const jsonData = JSON.stringify({
    abi: lotteryContract.abi,
    bytecode: lotteryContract.evm.bytecode,
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
