import { Campaign } from './ethers-contracts';

export type CampaignRequest = Awaited<ReturnType<Campaign['requests']>>;
export * from './ethers-contracts';
