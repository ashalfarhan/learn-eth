require('dotenv/config');
const { ethers } = require('ethers');
const { abi, bytecode } = require('../artifacts/Lottery.json');

const infura = new ethers.providers.InfuraProvider('rinkeby');
const conn = ethers.providers.InfuraProvider.getUrl(infura.network, {
  projectId: process.env.INFURA_PROJECT_ID,
  projectSecret: process.env.INFURA_PROJECT_SECRET,
});

const provider = new ethers.providers.JsonRpcProvider(conn, infura.network);

async function main() {
  const deployer = new ethers.Wallet(process.env.MANAGER_PRIVATE_KEY, provider);
  const factory = new ethers.ContractFactory(abi, bytecode, deployer);
  const contract = await factory.deploy();
  return contract.address;
}

main()
  .then(addr => {
    console.log('Deployment success: ', infura);
    console.log('Contract address:', addr);
  })
  .catch(err => {
    console.log('Failed to deploy');
    console.error(err);
    process.exit(1);
  });
