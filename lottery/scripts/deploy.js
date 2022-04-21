require('dotenv/config');
const { ethers } = require('ethers');
const { interface, bytecode } = require('./compile');

const infura = new ethers.providers.InfuraProvider('rinkeby');
const conn = ethers.providers.InfuraProvider.getUrl(infura.network, {
  projectId: process.env.INFURA_PROJECT_ID,
  projectSecret: process.env.INFURA_PROJECT_SECRET,
});

const provider = new ethers.providers.JsonRpcProvider(conn, infura.network);

async function main() {
  const deployer = new ethers.Wallet(process.env.MANAGER_PRIVATE_KEY, provider);
  const factory = new ethers.ContractFactory(interface, bytecode, deployer);

  const contract = await factory.deploy();
  console.log('Contract address:', contract.address);
  console.log('Contract abi:', JSON.stringify(interface));
  console.log('Deploy transaction:', contract.deployTransaction);
}

main().catch(err => {
  console.log('Failed with error:');
  console.error(err);
  process.exit(1);
});
