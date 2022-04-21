const assert = require('assert');
const ganache = require('ganache-cli');
const { ethers } = require('ethers');
const { interface, bytecode } = require('../scripts/compile');

// const toEth = ethers.utils.formatEther;

/** @type {ethers.providers.Web3Provider} */
let provider;

let manager;
let player1;
let player2;

/** @type {ethers.Contract} */
let lottery;

/** @type {ethers.providers.JsonRpcSigner} */
let deployer;

before(async () => {
  provider = new ethers.providers.Web3Provider(ganache.provider());
  [manager, player1, player2] = await provider.listAccounts();

  const factory = new ethers.ContractFactory(interface, bytecode);
  deployer = provider.getSigner(manager);

  lottery = await factory.connect(deployer).deploy();
});

describe('Lottery Contract', () => {
  it('should success deploy the contract', () => {
    assert.ok(lottery.address);
  });

  it('should have no player initially', async () => {
    const players = await lottery.getPlayers();
    assert.ok(players.length === 0);
  });

  it('should failed to join if no eth supplied', async () => {
    await lottery.join().catch(err => {
      const { error, reason } = err.results[err.hashes[0]];
      assert.equal(error, 'revert');
      assert.equal(reason, 'Join must be cost at least 0.01 ETH');
    });
  });

  it('should success to join if supply correct amount of eth', async () => {
    const value = ethers.utils.parseEther('0.01');
    /** @type {ethers.ContractTransaction} */
    const tx = await lottery.join({
      value,
    });
    await tx.wait();

    const [managerAccount] = await lottery.getPlayers();
    assert.equal(managerAccount, manager);
  });

  it('should success to join if supply more amount of eth', async () => {
    const value = ethers.utils.parseEther('0.1');
    const p1Sign = provider.getSigner(player1);
    await lottery.connect(p1Sign).join({ value });

    const [, p1] = await lottery.getPlayers();
    assert.equal(p1, player1);
  });

  it('should fail to pickWinner if not manager', async () => {
    await lottery.pickWinner().catch(err => {
      const { error, reason } = err.results[err.hashes[0]];
      assert.equal(error, 'revert');
      assert.equal(reason, 'Only manager can call this function');
    });
  });
});
