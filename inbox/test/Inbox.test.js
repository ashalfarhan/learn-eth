const assert = require('assert');
const ganache = require('ganache');
const { ethers } = require('ethers');
const { abi, bytecode } = require('../artifacts/Inbox.json');

const provider = new ethers.providers.Web3Provider(
  ganache.provider({ quiet: true })
);

/** @type {ethers.Contract} */
let inbox;
/** @type {ethers.providers.JsonRpcSigner} */
let deployer;

beforeEach(async () => {
  const factory = new ethers.ContractFactory(abi, bytecode);
  deployer = provider.getSigner();

  inbox = await factory
    .connect(deployer)
    // When deploying a contract
    // we need to pass the argument
    // if the contract have a required constructor argument
    .deploy('Hello world!');
});

describe('Inbox Contract', () => {
  it('should success deploy the contract', () => {
    assert.ok(inbox.address);
  });

  it('should have correct initial message', async () => {
    assert.equal(await inbox.message(), 'Hello world!');
  });

  it('should success update the message', async () => {
    await inbox.setMessage('Hola Mundo!');
    assert.equal(await inbox.message(), 'Hola Mundo!');
  });
});
