const path = require('path');
const solc = require('solc');
const fs = require('fs');
//
const contractPath = path.join(__dirname, '..', 'contracts');
const artifactPath = path.join(__dirname, '..', 'artifacts');

function main() {
  if (!fs.existsSync(path.join(artifactPath, 'bytecode'))) {
    fs.mkdirSync(path.join(artifactPath, 'bytecode'));
  }
  const file = 'Campaign.sol';
  const source = fs.readFileSync(path.join(contractPath, file), 'utf8');

  const options = JSON.stringify({
    language: 'Solidity',
    sources: {
      [file]: {
        content: source,
      },
    },
    settings: {
      outputSelection: {
        [file]: {
          ['*']: ['abi', 'evm.bytecode'],
        },
      },
    },
  });

  const res = JSON.parse(solc.compile(options));
  const contracts = res.contracts[file];

  Object.keys(contracts).forEach(contract => {
    fs.writeFileSync(
      path.join(artifactPath, 'abi', `${contract}.json`),
      JSON.stringify(contracts[contract].abi)
    );
    fs.writeFileSync(
      path.join(artifactPath, 'bytecode', `${contract}.json`),
      JSON.stringify(contracts[contract].evm.bytecode)
    );
  });

  console.log('Compiled successfully!');
}

main();
