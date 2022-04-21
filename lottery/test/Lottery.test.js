const assert = require('assert');
const ganache = require('ganache-cli');
const { ethers } = require('ethers');
const { interface, bytecode } = require('../scripts/compile');

const provider = new ethers.providers.Web3Provider(ganache.provider());

let manager;
let player1;
let player2;

/** @type {ethers.Contract} */
let lottery;

/** @type {ethers.providers.JsonRpcSigner} */
let deployer;

beforeEach(async () => {
  [manager, player1, player2] = await provider.listAccounts();

  const factory = new ethers.ContractFactory(interface, bytecode);
  deployer = provider.getSigner(manager);

  lottery = await factory.connect(deployer).deploy();
});

describe('Lottery Contract', () => {
  it('should success deploy the contract', async () => {
    assert.ok(lottery.address);
    assert.equal(await lottery.manager(), manager);

    const initialPlayers = await lottery.getTotalPlayers();
    assert.equal(initialPlayers, 0);
  });

  it('should failed to join if no value supplied', async () => {
    try {
      await lottery.join();
      assert(false);
    } catch (err) {
      const { error, reason } = err.results[err.hashes[0]];
      assert.equal(error, 'revert');
      assert.equal(reason, 'Join must be cost at least 0.01 ETH');
    }
  });

  it('should failed to join if supplied value is less than 0.01', async () => {
    const value = ethers.utils.parseUnits('1000', 'wei');
    try {
      await lottery.join({ value });
      assert(false);
    } catch (err) {
      const { error, reason } = err.results[err.hashes[0]];
      assert.equal(error, 'revert');
      assert.equal(reason, 'Join must be cost at least 0.01 ETH');
    }
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

    const [p1] = await lottery.getPlayers();
    assert.equal(p1, player1);
  });

  it('should fail to pickWinner if not manager', async () => {
    const p1Sign = provider.getSigner(player1);
    try {
      await lottery.connect(p1Sign).pickWinner();
      assert(false);
    } catch (err) {
      const { error, reason } = err.results[err.hashes[0]];
      assert.equal(error, 'revert');
      assert.equal(reason, 'Only manager can call this function');
    }
  });

  it('should success pickWinner and send the total ETH to the winner', async () => {
    const value = ethers.utils.parseEther('2');
    const p2Sign = provider.getSigner(player2);

    /** @type {ethers.ContractTransaction} */
    const tx = await lottery.connect(p2Sign).join({
      value,
    });
    await tx.wait();
    const afterJoinBalance = await p2Sign.getBalance();

    /** @type {ethers.ContractTransaction} */
    const tx2 = await lottery.pickWinner();
    await tx2.wait();

    const finalBalance = await p2Sign.getBalance();
    const difference = finalBalance.sub(afterJoinBalance);
    assert(difference > ethers.utils.parseEther('1.8'));
  });
});
