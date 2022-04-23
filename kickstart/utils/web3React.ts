import { InjectedConnector } from '@web3-react/injected-connector';
import { Web3Provider } from '@ethersproject/providers';

export const injected = new InjectedConnector({ supportedChainIds: [4] });

export const getLibrary = (provider: any) => {
  return new Web3Provider(provider);
};
