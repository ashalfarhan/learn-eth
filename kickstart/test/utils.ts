import { provider } from 'ganache';
import { ethers } from 'ethers';
import { ExternalProvider } from '@ethersproject/providers';

const ganacheProvide = provider({
  quiet: true,
}) as unknown as ExternalProvider;

export const testProvider = new ethers.providers.Web3Provider(ganacheProvide);
// trigger kickstart