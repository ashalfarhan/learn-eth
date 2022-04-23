import { BigNumber, ethers } from 'ethers';
import CampaignFactoryAbi from '../artifacts/abi/CampaignFactory.json';
import CampaignFactoryByteCode from '../artifacts/bytecode/CampaignFactory.json';
import CampaignAbi from '../artifacts/abi/Campaign.json';
import { testProvider } from './utils';
import { Campaign, CampaignFactory } from '../types/ethers-contracts';

let manager: string;
let acc1: string;
let acc2: string;
let acc3: string;
let recipient1: string;
let campaignFactory: CampaignFactory;

beforeEach(async () => {
  [manager, acc1, acc2, acc3, recipient1] = await testProvider.listAccounts();
  const factory = new ethers.ContractFactory(
    CampaignFactoryAbi,
    CampaignFactoryByteCode,
    testProvider.getSigner(manager)
  );

  campaignFactory = (await factory.deploy()) as CampaignFactory;
});

test('should success deploy the factory', async () => {
  expect(campaignFactory.address).toBeTruthy();
  expect(await campaignFactory.getCampaigns()).toHaveLength(0);
});

test('should success create campaign', async () => {
  const minimum = ethers.utils.parseEther('0.01');
  await campaignFactory.createCampaign(minimum);
  expect(await campaignFactory.getCampaigns()).toHaveLength(1);
});

const minimum = ethers.utils.parseEther('0.01');

let campaign: Campaign;
describe('Campaign Contract', () => {
  beforeEach(async () => {
    const manager = testProvider.getSigner(acc1);
    await campaignFactory.connect(manager).createCampaign(minimum);
    const [contractAddress] = await campaignFactory.getCampaigns();
    campaign = new ethers.Contract(
      contractAddress,
      CampaignAbi,
      manager
    ) as Campaign;
  });

  it('should success deploy the new created campaign', async () => {
    expect(campaign.address).toBeTruthy();
    expect(await campaign.manager()).toBe(acc1);
    expect(await campaign.minimumContribution()).toEqual(minimum);
    expect(await campaign.approversCount()).toEqual(BigNumber.from(0));
  });

  it('should fail to contribute if value less than minimumContribution', async () => {
    try {
      await campaign.contribute({ value: ethers.utils.parseEther('0.001') });
      expect(false).toBeTruthy();
    } catch (error) {
      const { message, reason } = error.data;
      expect(message).toBe('revert');
      expect(reason).toBe('Value is less than minimum contribution');
    }
  });

  it('should success to contribute and assign to approvers', async () => {
    const contrib1 = testProvider.getSigner(acc2);
    await campaign
      .connect(contrib1)
      .contribute({ value: ethers.utils.parseEther('0.1') });
    expect(await campaign.approversCount()).toEqual(BigNumber.from(1));
    expect(await campaign.approvers(acc2)).toBe(true);
  });

  it('should failed to create request if not the manager', async () => {
    try {
      await campaign
        .connect(testProvider.getSigner(acc2))
        .createRequest('Buy batteries', '100', acc3);
      expect(false).toBeTruthy();
    } catch (error) {
      const { message, reason } = error.data;
      expect(message).toBe('revert');
      expect(reason).toBe(
        'Only manager of this campaign can call this function'
      );
    }
  });

  it('should success create request', async () => {
    await campaign.createRequest('Buy batteries', '100', acc3);
    expect(await campaign.requests(0)).toHaveProperty(
      'description',
      'Buy batteries'
    );
  });

  it('should fail to approveRequest if not contributor', async () => {
    try {
      await campaign.connect(testProvider.getSigner(acc2)).approveRequest(0);
      expect(false).toBeTruthy();
    } catch (error) {
      const { message, reason } = error.data;
      expect(message).toBe('revert');
      expect(reason).toBe(
        'You are not part of this campaign, please contribute first'
      );
    }
  });

  it('should fail to finalizeRequest if not manager', async () => {
    try {
      await campaign.connect(testProvider.getSigner(acc2)).finalizeRequest(0);
      expect(false).toBeTruthy();
    } catch (error) {
      const { message, reason } = error.data;
      expect(message).toBe('revert');
      expect(reason).toBe(
        'Only manager of this campaign can call this function'
      );
    }
  });

  it('should process the request', async () => {
    const contrib1 = testProvider.getSigner(acc1);
    const beneficiary = testProvider.getSigner(recipient1);
    const balanceBefore = await beneficiary.getBalance();
    const amount = ethers.utils.parseEther('5');
    await campaign
      .connect(contrib1)
      .contribute({ value: ethers.utils.parseEther('8') });
    await campaign.createRequest('Buy keyboard', amount, recipient1);
    await campaign.connect(contrib1).approveRequest(0);
    await campaign.finalizeRequest(0);
    const balanceAfter = await beneficiary.getBalance();
    expect(balanceAfter.sub(balanceBefore)).toEqual(amount);
  });
});
