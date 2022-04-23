import type { Signer } from '@ethersproject/abstract-signer';
import type { Provider } from '@ethersproject/providers';
import { Contract } from 'ethers';
import CampaignFactoryAbi from '@app/artifacts/abi/CampaignFactory.json';
import CampaignAbi from '@app/artifacts/abi/Campaign.json';
import { Campaign, CampaignFactory } from '@app/types';
import { getProvider } from './provider';

const CAMPAIGN_FACTORY_ADDRESS = '0x97df115463B545745E5cf4686238D6cFd2310677';

export function getCampaignFactoryContract(
  signer: Signer | Provider = getProvider()
) {
  return new Contract(
    CAMPAIGN_FACTORY_ADDRESS,
    CampaignFactoryAbi,
    signer
  ) as CampaignFactory;
}

export function getCampaignContract(
  address: string,
  signer: Signer | Provider = getProvider()
) {
  return new Contract(address, CampaignAbi, signer) as Campaign;
}
