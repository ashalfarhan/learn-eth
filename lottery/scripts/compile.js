const path = require('path');
const fs = require('fs');
const solc = require('solc');

const contractPath = path.resolve(__dirname, '..', 'contracts', 'Lottery.sol');
const source = fs.readFileSync(contractPath, 'utf-8');

const options = {
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
};

const res = JSON.parse(solc.compile(JSON.stringify(options)));
const lotteryContract = res.contracts['Lottery.sol'].Lottery;

module.exports = {
  interface: lotteryContract.abi,
  bytecode: lotteryContract.evm.bytecode.object,
};
