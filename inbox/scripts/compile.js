const path = require('path');
const fs = require('fs');
const solc = require('solc');

const contractPath = path.resolve(__dirname, '..', 'contracts', 'Inbox.sol');
const source = fs.readFileSync(contractPath, 'utf-8');

const options = {
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
};

const res = JSON.parse(solc.compile(JSON.stringify(options)));
const inboxContract = res.contracts['Inbox.sol'].Inbox;

module.exports = {
  interface: inboxContract.abi,
  bytecode: inboxContract.evm.bytecode.object,
};
