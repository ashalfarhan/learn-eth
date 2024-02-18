import { JsonRpcSigner, ethers, parseEther } from 'ethers';
import CampaignFactoryAbi from '../artifacts/abi/CampaignFactory.json';
import CampaignFactoryByteCode from '../artifacts/bytecode/CampaignFactory.json';
import CampaignAbi from '../artifacts/abi/Campaign.json';
import { testProvider } from './utils';
import { Campaign, CampaignFactory } from '../types/ethers-contracts';
import { describe, expect, it, beforeEach, test } from 'vitest';

let manager: JsonRpcSigner;
let acc1: JsonRpcSigner;
let acc2: JsonRpcSigner;
let acc3: JsonRpcSigner;
let recipient1: JsonRpcSigner;
let campaignFactory: CampaignFactory;

beforeEach(async () => {
  [manager, acc1, acc2, acc3, recipient1] = await testProvider.listAccounts();
  const factory = new ethers.ContractFactory(
    CampaignFactoryAbi,
    CampaignFactoryByteCode,
    manager
  );

  campaignFactory = (await factory.deploy()) as CampaignFactory;
});

test('should success deploy the factory', async () => {
  expect(await campaignFactory.getAddress()).toBeTruthy();
  expect(await campaignFactory.getCampaigns()).toHaveLength(0);
});

test('should success create campaign', async () => {
  const minimum = parseEther('0.01');
  await campaignFactory.createCampaign(minimum);
  expect(await campaignFactory.getCampaigns()).toHaveLength(1);
});

const minimum = parseEther('0.01');

let campaign: Campaign;
describe('Campaign Contract', () => {
  beforeEach(async () => {
    await campaignFactory.connect(acc1).createCampaign(minimum);
    const [contractAddress] = await campaignFactory.getCampaigns();
    campaign = new ethers.Contract(
      contractAddress,
      CampaignAbi,
      manager
    ) as unknown as Campaign;
  });

  it('should success deploy the new created campaign', async () => {
    expect(await campaign.getAddress()).toBeTruthy();
    expect(await campaign.manager()).toBe(acc1.address);
    expect(await campaign.minimumContribution()).toEqual(minimum);
    expect(await campaign.approversCount()).toEqual(0n);
  });

  it('should fail to contribute if value less than minimumContribution', async () => {
    expect.assertions(2);
    try {
      await campaign.contribute({ value: parseEther('0.001') });
      expect.fail();
    } catch (error) {
      const { message, reason } = error.data;
      expect(message).toBe('revert');
      expect(reason).toBe('Value is less than minimum contribution');
    }
  });

  it('should success to contribute and assign to approvers', async () => {
    const contrib1 = acc2;
    await campaign.connect(contrib1).contribute({ value: parseEther('0.1') });
    expect(await campaign.approversCount()).toEqual(1n);
    expect(await campaign.approvers(contrib1.address)).toBe(true);
  });

  it('should failed to create request if not the manager', async () => {
    expect.assertions(2);
    try {
      await campaign.connect(acc2).createRequest('Buy batteries', '100', acc3);
      expect.fail();
    } catch (error) {
      const { message, reason } = error.data;
      expect(message).toBe('revert');
      expect(reason).toBe(
        'Only manager of this campaign can call this function'
      );
    }
  });

  it('should success create request', async () => {
    await campaign.connect(acc1).createRequest('Buy batteries', '100', acc3);
    const request = await campaign.requests(0);
    expect(request.description).toBe('Buy batteries');
  });

  it('should fail to approveRequest if not contributor', async () => {
    expect.assertions(2);
    try {
      await campaign.connect(acc2).approveRequest(0);
      expect.fail();
    } catch (error) {
      const { message, reason } = error.data;
      expect(message).toBe('revert');
      expect(reason).toBe(
        'You are not part of this campaign, please contribute first'
      );
    }
  });

  it('should fail to finalizeRequest if not manager', async () => {
    expect.assertions(2);
    try {
      await campaign.connect(acc2).finalizeRequest(0);
      expect.fail();
    } catch (error) {
      const { message, reason } = error.data;
      expect(message).toBe('revert');
      expect(reason).toBe(
        'Only manager of this campaign can call this function'
      );
    }
  });

  it('should process the request', async () => {
    const contrib1 = acc1;
    const beneficiary = recipient1;
    const balanceBefore = await testProvider.getBalance(beneficiary);
    const amount = parseEther('5');
    await campaign.connect(contrib1).contribute({ value: parseEther('8') });
    await campaign
      .connect(contrib1)
      .createRequest('Buy keyboard', amount, recipient1);
    await campaign.connect(contrib1).approveRequest(0);
    await campaign.connect(contrib1).finalizeRequest(0);
    const balanceAfter = await testProvider.getBalance(beneficiary);
    expect(balanceAfter - balanceBefore).toEqual(amount);
  });
});
