require('dotenv/config');
const { ethers } = require('ethers');
const abi = require('../artifacts/abi/CampaignFactory.json');
const bytecode = require('../artifacts/bytecode/CampaignFactory.json');

const infura = new ethers.providers.InfuraProvider('rinkeby');
const conn = ethers.providers.InfuraProvider.getUrl(infura.network, {
  projectId: process.env.INFURA_PROJECT_ID,
  projectSecret: process.env.INFURA_PROJECT_SECRET,
});

const provider = new ethers.providers.JsonRpcProvider(conn, infura.network);
const deployer = new ethers.Wallet(process.env.MANAGER_PRIVATE_KEY, provider);

async function main() {
  console.log('Attempting to deploy with account:', deployer.address);
  const factory = new ethers.ContractFactory(abi, bytecode, deployer);
  const contract = await factory.deploy();
  return contract;
}

main()
  .then(contract => {
    console.log('Contract address:', contract.address);
    console.log(
      'Deployment success with transaction hash:',
      contract.deployTransaction.hash
    );
  })
  .catch(err => {
    console.log('Failed to deploy');
    console.error(err);
    process.exit(1);
  });
