import { beforeEach, it, expect, describe } from 'vitest';
import { GanacheProvider } from '@ethers-ext/provider-ganache';
import { ethers, type JsonRpcSigner, parseEther } from 'ethers';
import { abi, bytecode } from '../artifacts/Lottery.json';
import { Lottery } from '../types/ethers-contracts';

const provider = new GanacheProvider();

let manager: JsonRpcSigner;
let player1: JsonRpcSigner;
let player2: JsonRpcSigner;
let deployer: JsonRpcSigner;

let lottery: Lottery;

beforeEach(async () => {
  [manager, player1, player2] = await provider.listAccounts();

  const factory = new ethers.ContractFactory(abi, bytecode);
  deployer = await provider.getSigner();

  lottery = (await factory.connect(deployer).deploy()) as Lottery;
});

describe('Lottery Contract', () => {
  it('should success deploy the contract', async () => {
    expect(await lottery.getAddress()).toBeTruthy();
    expect(await lottery.manager()).toBe(manager.address);

    const initialPlayers = await lottery.getTotalPlayers();
    expect(initialPlayers).toBe(0n);
  });

  it('should failed to join if no value supplied', async () => {
    expect.assertions(3);
    try {
      await lottery.join();
      expect.fail();
    } catch (err) {
      const { message, reason } = err.data;
      expect(err.name).toBe('RuntimeError');
      expect(message).toBe('revert');
      expect(reason).toBe('Join must be cost at least 0.01 ETH');
    }
  });

  it('should failed to join if supplied value is less than 0.01', async () => {
    expect.assertions(3);
    const value = parseEther('0.0001');
    try {
      await lottery.join({ value });
      expect.fail();
    } catch (err) {
      const { message, reason } = err.data;
      expect(err.name).toBe('RuntimeError');
      expect(message).toBe('revert');
      expect(reason).toBe('Join must be cost at least 0.01 ETH');
    }
  });

  it('should success to join if supply correct amount of eth', async () => {
    const value = parseEther('0.01');
    const tx = await lottery.join({ value });
    await tx.wait();

    const [managerAccount] = await lottery.getPlayers();
    expect(managerAccount).toBe(manager.address);
  });

  it('should success to join if supply more amount of eth', async () => {
    const value = parseEther('0.1');
    await lottery.connect(player1).join({ value });

    const [p1] = await lottery.getPlayers();
    expect(p1).toBe(player1.address);
  });

  it('should fail to pickWinner if not manager', async () => {
    expect.assertions(3);
    try {
      await lottery.connect(player1).pickWinner();
      expect.fail();
    } catch (err) {
      const { message, reason } = err.data;
      expect(err.name).toBe('RuntimeError');
      expect(message).toBe('revert');
      expect(reason).toBe('Only manager can call this function');
    }
  });

  it('should success pickWinner and send the total ETH to the winner', async () => {
    const value = parseEther('2');

    const tx = await lottery.connect(player2).join({ value });
    await tx.wait();
    const afterJoinBalance = await provider.getBalance(player2.address);

    const tx2 = await lottery.pickWinner();
    await tx2.wait();

    const finalBalance = await provider.getBalance(player2.address);
    const difference = finalBalance - afterJoinBalance;
    expect(difference >= parseEther('1.8')).toBe(true);
  });
});
