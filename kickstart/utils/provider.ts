import { StaticJsonRpcProvider, Web3Provider } from '@ethersproject/providers';
import { ethers } from 'ethers';

const projectId =
  process.env.INFURA_PROJECT_ID ?? process.env.NEXT_PUBLIC_INFURA_PROJECT_ID;

const infura = new ethers.providers.InfuraProvider('rinkeby', {
  projectId,
});

export const getProvider = () => {
  if (typeof window === 'undefined' || !window.ethereum) {
    const provider = new StaticJsonRpcProvider(infura.connection);
    return provider;
  }
  return new ethers.providers.Web3Provider(window.ethereum);
};

export function getSigner(account: string, provider?: Web3Provider) {
  return provider?.getSigner(account).connectUnchecked();
}

export const getProviderOrSigner = (
  provider?: Web3Provider,
  account?: string | null
) => {
  return account ? getSigner(account, provider) : provider;
};
