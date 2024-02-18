require('dotenv/config');
const { ethers, InfuraProvider } = require('ethers');
const { abi, bytecode } = require('../artifacts/Lottery.json');

const infura = new InfuraProvider(
  'sepolia',
  process.env.INFURA_PROJECT_ID,
  process.env.INFURA_PROJECT_SECRET
);

const deployer = new ethers.Wallet(
  process.env.MANAGER_PRIVATE_KEY,
  infura.provider
);

async function main() {
  console.log('Attempting to deploy with account:', deployer.address);
  const factory = new ethers.ContractFactory(abi, bytecode, deployer);
  const contract = await factory.deploy();
  return contract.getAddress();
}

main()
  .then(contractAddress => {
    console.log('Done:', { contractAddress });
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
