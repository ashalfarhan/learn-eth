import { beforeEach, it, expect, describe } from 'vitest';
import { JsonRpcSigner, ethers } from 'ethers';
import { GanacheProvider } from '@ethers-ext/provider-ganache';
import { abi, bytecode } from '../artifacts/Inbox.json';
import { Inbox } from '../types/ethers-contracts';

const provider = new GanacheProvider();

let inbox: Inbox;
let deployer: JsonRpcSigner;

beforeEach(async () => {
  const factory = new ethers.ContractFactory(abi, bytecode);
  deployer = await provider.getSigner();

  inbox = (await factory
    .connect(deployer)
    // When deploying a contract
    // we need to pass the argument
    // if the contract have a required constructor argument
    .deploy('Hello world!')) as Inbox;
});

describe('Inbox Contract', () => {
  it('should success deploy the contract', async () => {
    expect(await inbox.getAddress()).toBeTruthy();
  });

  it('should have correct initial message', async () => {
    expect(await inbox.message()).toBe('Hello world!');
  });

  it('should success update the message', async () => {
    await inbox.setMessage('Hola Mundo!');
    expect(await inbox.message()).toBe('Hola Mundo!');
  });
});
